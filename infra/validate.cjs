const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const ts = require('typescript');

assert.ok(process.argv[2], 'Usage: node infra/validate.cjs <compiled-main.json>');
const main = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const resource = (template, type) => {
  const matches = template.resources.filter(entry => entry.type.toLowerCase() === type.toLowerCase());
  assert.equal(matches.length, 1, `Expected one declaration of ${type}`);
  return matches[0];
};
const group = resource(main, 'Microsoft.Resources/deployments').properties.template;
const environment = resource(group, 'Microsoft.Resources/deployments').properties.template;
const deployments = environment.resources.filter(entry => entry.type === 'Microsoft.Resources/deployments');
const bootstrap = deployments.find(entry => entry.name.includes('workspace-bootstrap'));
const attached = deployments.find(entry => entry.name.includes('workspace-attach'));
const workspace = resource(bootstrap.properties.template, 'Microsoft.OperationalInsights/workspaces');
const transform = readFileSync(join(__dirname, 'app-events.kql'), 'utf8');

test('one dedicated group, production only, closed defaults and runtime-only contact', () => {
  assert.match(main.$schema, /subscriptionDeploymentTemplate/);
  resource(main, 'Microsoft.Resources/resourceGroups');
  assert.deepEqual(main.parameters.location.allowedValues, ['westeurope']);
  assert.equal(main.parameters.resourceGroupName.defaultValue, undefined);
  for (const template of [main, group]) {
    assert.equal(template.parameters.notificationEmail.type.toLowerCase(), 'securestring');
    assert.equal(template.parameters.notificationEmail.defaultValue, undefined);
    assert.equal(template.parameters.budgetStartDate.defaultValue, undefined);
    assert.equal(template.parameters.enableDevIngestion, undefined);
    assert.equal(template.parameters.enableProdIngestion.defaultValue, false);
  }
  assert.deepEqual(group.variables.environmentSettings.map(entry => entry.name), ['prod']);
  assert.deepEqual(environment.parameters.environmentName.allowedValues, ['prod']);
  assert.match(environment.variables.suffix, /environmentName/);
  assert.equal(bootstrap.properties.parameters.enableIngestion.value, false);
  assert.equal(environment.parameters.enableIngestion.defaultValue, false);
});

test('both workspace passes enforce the cap, 90-day retention and Entra-only reads', () => {
  for (const deployment of deployments) {
    const settings = resource(deployment.properties.template,
      'Microsoft.OperationalInsights/workspaces').properties;
    assert.equal(settings.sku.name, 'PerGB2018');
    assert.equal(settings.retentionInDays, 90);
    assert.ok([0.1, "[json('0.1')]"].includes(settings.workspaceCapping.dailyQuotaGb));
    assert.equal(settings.features.disableLocalAuth, true);
    assert.equal(settings.features.enableLogAccessUsingOnlyResourcePermissions, false);
    assert.equal(settings.features.immediatePurgeDataOn30Days, false);
    assert.equal(settings.features.enableDataExport, false);
    assert.match(settings.publicNetworkAccessForIngestion, /enableIngestion.*Enabled.*Disabled/);
  }
  assert.equal(workspace.properties.publicNetworkAccessForQuery, 'Enabled');
  const table = resource(environment, 'Microsoft.OperationalInsights/workspaces/tables');
  assert.equal(table.properties.retentionInDays, 90);
  assert.equal(table.properties.totalRetentionInDays, 90);
  assert.equal(resource(environment, 'Microsoft.Insights/components').properties.RetentionInDays, 90);
  assert.deepEqual(environment.variables.appTables, [
    'AppAvailabilityResults', 'AppBrowserTimings', 'AppDependencies', 'AppExceptions',
    'AppEvents', 'AppMetrics', 'AppPageViews', 'AppPerformanceCounters', 'AppRequests',
    'AppSystemEvents', 'AppTraces'
  ]);
  assert.ok(table.dependsOn.some(dependency => dependency.includes('workspace-bootstrap')));
});

test('DCR is attached before the component and covers every declared App table', () => {
  const rule = resource(environment, 'Microsoft.Insights/dataCollectionRules');
  assert.equal(rule.kind, 'WorkspaceTransforms');
  assert.deepEqual(rule.dependsOn, ['tables']);
  const flow = rule.properties.copy.find(entry => entry.name === 'dataFlows');
  assert.match(flow.count, /appTables/);
  assert.match(flow.input.streams[0], /Microsoft-Table-/);
  assert.match(flow.input.transformKql, /AppEvents/);
  assert.match(flow.input.transformKql, /source \| where false/);
  assert.ok(Object.values(environment.variables).includes(transform));
  assert.match(attached.properties.parameters.transformationRuleId.value, /dataCollectionRules/);
  const component = resource(environment, 'Microsoft.Insights/components');
  assert.match(component.properties.WorkspaceResourceId, /workspace-attach/);
  assert.equal(component.properties.DisableIpMasking, false);
  assert.equal(component.properties.DisableLocalAuth, false);
  assert.match(component.properties.publicNetworkAccessForIngestion, /enableIngestion.*Enabled.*Disabled/);
});

test('schema 2 storage reconstructs bounded fields and strips all unapproved identities', () => {
  const projection = transform.split('| project ');
  assert.equal(projection.length, 2);
  assert.match(projection[1], /^TimeGenerated, Name,/);
  assert.doesNotMatch(transform, /\b_ResourceId\b/);
  assert.match(projection[1], /Properties = pack\(/);
  assert.match(projection[1], /Measurements = iif\(/);
  assert.match(projection[1], /ItemCount = toint\(1\)/);
  assert.doesNotMatch(projection[1],
    /incoming|ClientIP|ClientCity|ClientCountryOrRegion|ClientStateOrProvince|AppRoleInstance|OperationId|UserAuthenticatedId/);
  assert.match(transform, /schemaVersion == '2'/);
  assert.doesNotMatch(transform, /schemaVersion == '1'/);
  assert.match(transform, /and isfinite\(duration\) and duration >= 0 and duration <= 3600000/);
  assert.match(transform,
    /duration = toreal\(iif\(isempty\(tostring\(measurements.durationMs\)\),\s*'-1', tostring\(measurements.durationMs\)\)\)/);
  assert.match(transform, /Name == 'sysml.error' and validOperation and code in/);
  assert.match(transform, /Name endswith '.operation' and validOperation and outcome in/);
  assert.match(projection[1], /UserId = iif\(validUsageIdentity, tolower\(UserId\), ''\)/);
  assert.match(projection[1], /SessionId = iif\(validUsageIdentity, tolower\(SessionId\), ''\)/);
  const bags = projection[1].replace(/view in \([^)]+\)/g, 'view in (...)');
  const keys = [...bags.matchAll(/'([A-Za-z][A-Za-z0-9]*)',/g)]
    .map(match => match[1]);
  assert.deepEqual([...new Set(keys)].sort(), [
    'action', 'code', 'component', 'durationMs', 'extensionVersion', 'host', 'lspVersion',
    'operation', 'outcome', 'panel', 'platform', 'schemaVersion', 'sequence', 'view', 'vscodeVersion'
  ].sort());
});

test('only usage with UUIDv4 pairs and safe positive integer sequence can be correlated', () => {
  assert.match(transform, /validUsageIdentity = Name != 'sysml.error'/);
  const patterns = [...transform.matchAll(/(?:UserId|SessionId) matches regex '([^']+)'/g)];
  assert.equal(patterns.length, 2);
  for (const [, pattern] of patterns) {
    const uuid = new RegExp(pattern);
    assert.ok(uuid.test('12345678-1234-4234-9234-123456789abc'));
    assert.ok(uuid.test('ABCDEF12-1234-4ABC-ABCD-123456789ABC'));
    for (const invalid of ['', 'machine-id', 'person@example.invalid',
      '12345678-1234-1234-9234-123456789abc', '12345678-1234-4234-7234-123456789abc',
      '12345678-1234-4234-9234-123456789abc/path']) assert.ok(!uuid.test(invalid));
  }
  assert.match(transform, /isfinite\(sequence\) and sequence >= 1 and sequence <= 9007199254740991/);
  assert.match(transform, /gettype\(measurements.sequence\) in \('long', 'real'\)/);
  assert.match(transform, /sequence == floor\(sequence, 1\)/);
  assert.match(transform, /Measurements = iif\(validUsageIdentity,/);
  const durationGate = transform.split('| extend validDuration = ')[1].split('| extend')[0];
  assert.doesNotMatch(durationGate, /sysml.error|sysml.panel.opened|sysml.explorer.operation/);
  assert.match(transform, /iif\(validDuration, pack\('durationMs', round\(duration, 0\)\), parse_json\('\{\}'\)\)/);
});

test('shared budget, alerts and resource boundaries stay unchanged', () => {
  const budget = resource(group, 'Microsoft.Consumption/budgets').properties;
  assert.equal(budget.amount, 20);
  assert.equal(budget.timeGrain, 'Monthly');
  assert.equal(budget.filter, undefined);
  assert.deepEqual(Object.values(budget.notifications).map(entry => entry.threshold), [80, 100]);
  assert.ok(Object.values(budget.notifications).every(entry => entry.contactEmails.length === 1));
  const receiver = resource(group, 'Microsoft.Insights/actionGroups').properties.emailReceivers;
  assert.equal(receiver.length, 1);
  assert.equal(receiver[0].useCommonAlertSchema, true);
  const alerts = resource(environment, 'Microsoft.Insights/scheduledQueryRules').properties;
  assert.equal(alerts.skipQueryValidation, false);
  assert.equal(alerts.evaluationFrequency, 'PT1H');
  assert.equal(environment.variables.rules.find(rule => rule.name === 'errors').threshold, 10);
  assert.equal(environment.variables.rules.find(rule => rule.name === 'ingestion').threshold, 80);
  const automaticAlert = resource(environment,
    'Microsoft.AlertsManagement/smartDetectorAlertRules').properties;
  assert.equal(automaticAlert.state, 'Disabled');
  assert.deepEqual(automaticAlert.actionGroups.groupIds, ["[parameters('actionGroupId')]"]);
  assert.equal(automaticAlert.detector.id, 'FailureAnomaliesDetector');
  const allowed = new Set([
    'Microsoft.Resources/resourceGroups', 'Microsoft.Resources/deployments',
    'Microsoft.OperationalInsights/workspaces', 'Microsoft.OperationalInsights/workspaces/tables',
    'Microsoft.Insights/components', 'Microsoft.Insights/dataCollectionRules',
    'Microsoft.Insights/actionGroups', 'Microsoft.Insights/scheduledQueryRules',
    'Microsoft.Insights/workbooks', 'Microsoft.Consumption/budgets',
    'Microsoft.AlertsManagement/smartDetectorAlertRules'
  ].map(resourceType => resourceType.toLowerCase()));
  const walk = template => {
    for (const entry of template.resources) {
      assert.ok(allowed.has(entry.type.toLowerCase()), `Unexpected resource or reader grant: ${entry.type}`);
      if (entry.properties?.template) walk(entry.properties.template);
    }
    assert.doesNotMatch(JSON.stringify(template.outputs || {}), /connectionString|instrumentationKey/i);
  };
  walk(main);
});

const workbook = JSON.parse(readFileSync(join(__dirname, 'workbook-queries.json'), 'utf8'));
const environmentSource = readFileSync(join(__dirname, 'modules/environment.bicep'), 'utf8');
const queryById = id => {
  const query = workbook.queries.find(entry => entry.id === id);
  assert.ok(query, `Missing workbook query: ${id}`);
  return query.query;
};

test('workbooks link to App Insights and use real parameter query fields and defaults', () => {
  assert.ok(Object.values(environment.variables).some(value =>
    JSON.stringify(value) === JSON.stringify(workbook)));
  const deployedWorkbook = resource(environment, 'Microsoft.Insights/workbooks');
  assert.match(deployedWorkbook.properties.sourceId, /resourceId\('Microsoft.Insights\/components'/);
  assert.match(environmentSource, /fallbackResourceIds: \[applicationInsights.id\]/);
  assert.match(environmentSource, /query: '\$\{queryScope\}\$\{query.query\}'/);
  assert.match(environmentSource, /query: '\$\{workbookDefinition.timeScope\}\$\{parameter.query\}'/);
  assert.match(environmentSource, /query: '\$\{queryScope\}\$\{workbookDefinition.sessionParameter.query\}'/);
  assert.equal((environmentSource.match(/timeContextFromParameter: 'TimeRange'/g) || []).length, 3);
  assert.doesNotMatch(environmentSource, /querySettings|timeContext:|durationMs: 604800000/);
  assert.match(environmentSource, /crossComponentResources: \[workspace.id\]/);
  assert.match(environmentSource, /version: 'KqlParameterItem\/1.0'/);
  assert.match(environmentSource, /style: 'tabs'/);
  assert.match(environmentSource, /parameterName: 'Page'/);
  const parameters = new Map(workbook.parameters.map(parameter => [parameter.name, parameter]));
  assert.equal(parameters.get('TimeRange').type, 4);
  assert.equal(parameters.get('TimeRange').value.durationMs, 30 * 86400000);
  assert.deepEqual(parameters.get('TimeRange').typeSettings.selectableValues
    .map(value => value.durationMs), [1, 7, 30, 90].map(days => days * 86400000));
  assert.equal(parameters.get('TimeRange').typeSettings.allowCustom, true);
  for (const name of ['Version', 'Host']) {
    assert.equal(parameters.get(name).type, 2);
    assert.equal(parameters.get(name).value, '*');
    assert.equal(parameters.get(name).multiSelect, false);
  }
  assert.equal(parameters.get('Host').jsonData, undefined);
  assert.equal(parameters.get('Host').query,
    "datatable(value:string, label:string, selected:bool)['*', 'All hosts', true, "
    + "'desktop', 'Desktop', false, 'remote', 'Remote', false, 'web', 'Web', false]");
  assert.match(parameters.get('Version').query, /'\*', 'All versions', true/);
  assert.doesNotMatch(parameters.get('Version').query, /\{Version/);
  assert.match(parameters.get('Version').query, /\{Host:escape\}/);
  assert.equal(workbook.sessionParameter.value, 'none');
  assert.match(workbook.sessionParameter.query, /top 100 by LastSeen desc/);
  assert.doesNotMatch(workbook.sessionParameter.query, /UserId/);
});

test('every analytics query inherits schema/date/version/host scope and bounded retention', () => {
  assert.match(workbook.timeScope, /max_of\(datetime\(\{TimeRange:start\}\), WindowEnd - 90d, ago\(90d\)\)/);
  assert.match(workbook.notice, /retained last 90 days/);
  assert.match(workbook.timeScope, /TimeGenerated >= WindowStart and TimeGenerated <= WindowEnd/);
  assert.match(workbook.timeScope, /schemaVersion\) == '2'/);
  for (const name of ['Version', 'Host']) {
    assert.match(workbook.filterScope, new RegExp(`\\{${name}:escape\\}.*== '\\*' or`));
  }
  assert.match(workbook.filterScope, /let UsageEvents = Events \| where Name != 'sysml.error'/);
  assert.match(workbook.filterScope, /let FeatureEvents = CorrelatedUsage\n\| where Name != 'sysml.language.operation'/);
  const ids = workbook.queries.map(query => query.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const query of workbook.queries) {
    assert.ok(workbook.sections.some(section => section.id === query.section));
    assert.ok(query.description.length > 50);
    assert.ok(['table', 'timechart', 'barchart'].includes(query.visualization));
    assert.doesNotMatch(query.query, /AppEvents|ago\(|ClientIP|UserAuthenticatedId|machineId|email/i);
    assert.match(query.query, /\b(Events|UsageEvents|CorrelatedUsage|FeatureEvents|_LogOperation)\b/);
  }
  const cap = queryById('cap-interruptions');
  assert.match(cap, /TimeGenerated >= WindowStart and TimeGenerated <= WindowEnd/);
  assert.match(cap, /'\{Version:escape\}' == '\*' and '\{Host:escape\}' == '\*'/);
});

test('installation activity and returns are window-relative and never infer first-ever users', () => {
  const overview = queryById('activity-overview');
  for (const days of [1, 7, 30]) assert.ok(overview.includes(`LastSeen > WindowEnd - ${days}d`));
  assert.match(overview, /summarize LastSeen = max\(TimeGenerated\) by UserId/);
  assert.match(overview, /MAUWindowComplete = WindowStart <= WindowEnd - 30d/);
  const returning = queryById('returning-installations');
  assert.match(returning, /Midpoint = WindowStart \+ \(WindowEnd - WindowStart\) \/ 2/);
  assert.match(returning, /Returning = countif\(EarlierEvents > 0 and LaterEvents > 0\)/);
  assert.match(returning, /100.0 \* Returning \/ SecondHalfActive/);
  assert.match(queryById('feature-reach'), /AllInstallations = toscalar\(CorrelatedUsage/);
  assert.match(queryById('feature-reach'), /AllSessions = toscalar\(CorrelatedUsage/);
  assert.match(queryById('feature-session-frequency'), /by Feature, SessionId/);
  assert.match(workbook.notice, /not people/);
  assert.match(workbook.notice, /opt-out/);
  assert.match(workbook.notice, /rate caps/);
  assert.match(workbook.notice, /failed-boot denominator/);
});

test('journeys order numeric sequence within sessions and expose no installation identifiers', () => {
  assert.match(workbook.filterScope, /Sequence = tolong\(Measurements.sequence\)/);
  const transitions = queryById('transitions');
  assert.match(transitions, /where Copies == 1/);
  assert.match(transitions, /sort by SessionId asc, Sequence asc\n\| serialize/);
  assert.match(transitions, /NextSession == SessionId and NextSequence > Sequence/);
  assert.match(transitions, /by FromFeature = Feature, ToFeature = NextFeature\n\| top 25/);
  assert.doesNotMatch(transitions, /UserId/);
  const journey = queryById('session-journey');
  assert.match(journey, /^CorrelatedUsage/);
  assert.match(journey, /SessionId == '\{Session:escape\}'/);
  assert.match(journey, /order by Sequence asc, TimeGenerated asc\n\| take 500/);
  assert.doesNotMatch(journey, /UserId|project \*/);
});

test('latencies and operation rates use usage only; error-only records stay separate', () => {
  const latency = queryById('latency');
  assert.match(latency, /^UsageEvents/);
  for (const percentile of [50, 95, 99]) assert.ok(latency.includes(`percentile(DurationMs, ${percentile})`));
  assert.match(latency, /by Name, Operation, Outcome, Version/);
  const outcomes = queryById('operation-outcomes');
  assert.match(outcomes, /^UsageEvents\n\| where Name endswith '.operation'/);
  assert.match(outcomes, /Operations = count\(\)/);
  for (const numerator of ['Failures', 'Rejections', 'Cancellations', 'Successes']) {
    assert.ok(outcomes.includes(`100.0 * ${numerator} / Operations`));
  }
  const errors = queryById('standalone-errors');
  assert.match(errors, /^Events\n\| where Name == 'sysml.error'/);
  assert.doesNotMatch(errors, /UserId|SessionId|join|dcount|Pct|\/ Operations/);
  assert.match(queryById('ingestion-health'), /ErrorIdentityViolations = countif/);
  assert.match(queryById('retained-volume'), /_IsBillable == 'true'/);
});

test('DCR event and enum allowlists match the current TypeScript sender', () => {
  const path = join(__dirname, '../src/telemetry/telemetryService.ts');
  const source = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true);
  const declarations = new Map();
  const accepted = new Map();
  const schemaVersions = [];
  const visit = node => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      declarations.set(node.name.text, ts.isAsExpression(node.initializer)
        ? node.initializer.expression : node.initializer);
    }
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)
      && node.expression.text === 'accept' && ts.isStringLiteral(node.arguments[0])
      && ts.isIdentifier(node.arguments[1])) {
      accepted.set(node.arguments[0].text, node.arguments[1].text);
    }
    if (ts.isPropertyAssignment(node) && node.name.getText(source) === 'schemaVersion') {
      assert.ok(ts.isStringLiteral(node.initializer));
      schemaVersions.push(node.initializer.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  assert.deepEqual(schemaVersions, ['2']);
  const strings = node => {
    assert.ok(node && ts.isArrayLiteralExpression(node));
    return node.elements.map(element => {
      assert.ok(ts.isStringLiteral(element));
      return element.text;
    });
  };
  const inList = expression => {
    const match = transform.match(new RegExp(`${expression} in \\(([^)]+)\\)`));
    assert.ok(match, `Missing DCR enum: ${expression}`);
    return [...match[1].matchAll(/'([^']+)'/g)].map(value => value[1]);
  };
  const operations = declarations.get('operations');
  assert.ok(ts.isObjectLiteralExpression(operations));
  const components = operations.properties.map(property => property.name.getText(source));
  assert.deepEqual(inList('Name'), [
    'sysml.extension.activated', 'sysml.panel.opened', 'sysml.error',
    ...components.map(component => `sysml.${component}.operation`)
  ]);
  for (const property of operations.properties) {
    const component = property.name.getText(source);
    const actions = strings(property.initializer);
    if (actions.length === 1) {
      assert.ok(transform.includes(`component == '${component}' and action == '${actions[0]}'`));
    } else {
      assert.deepEqual(inList(`component == '${component}' and action`), actions);
    }
  }
  for (const [key, constant] of [['panel', 'panels'], ['code', 'failureCodes'],
    ['outcome', 'outcomes'], ['view', 'views']]) {
    assert.deepEqual(inList(key), strings(declarations.get(constant)));
  }
  const metadata = source.statements.find(statement =>
    ts.isInterfaceDeclaration(statement) && statement.name.text === 'TelemetryMetadata');
  for (const key of ['host', 'platform']) {
    const member = metadata.members.find(entry => entry.name.getText(source) === key);
    assert.ok(ts.isUnionTypeNode(member.type));
    assert.deepEqual(inList(key), member.type.types.map(type => type.literal.text));
  }
  const optionalEnums = {
    format: ['png', 'svg', 'json', 'csv'],
    mode: ['byFile', 'bySemantic'],
    tab: ['requirements', 'elements', 'relationships', 'matrix']
  };
  for (const [key, values] of Object.entries(optionalEnums)) {
    if (accepted.has(key)) {
      assert.deepEqual(strings(declarations.get(accepted.get(key))), values);
      assert.deepEqual(inList(key), values, `Update infrastructure for implemented ${key}`);
    } else {
      assert.ok(!transform.includes(`'${key}',`), `Do not enable unimplemented ${key}`);
    }
  }
});
