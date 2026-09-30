@allowed(['prod'])
param environmentName string
param location string
param actionGroupId string
param enableIngestion bool = false

var suffix = 'sysml-${environmentName}-${uniqueString(resourceGroup().id)}'
var workspaceName = 'log-${suffix}'
var eventTransform = loadTextContent('../app-events.kql')
var tags = {
  workload: 'sysml-extension-telemetry'
  environment: environmentName
  managedBy: 'bicep'
}
var appTables = [
  'AppAvailabilityResults'
  'AppBrowserTimings'
  'AppDependencies'
  'AppExceptions'
  'AppEvents'
  'AppMetrics'
  'AppPageViews'
  'AppPerformanceCounters'
  'AppRequests'
  'AppSystemEvents'
  'AppTraces'
]

module bootstrap './workspace.bicep' = {
  name: 'workspace-bootstrap-${environmentName}'
  params: {
    workspaceName: workspaceName
    location: location
    tags: tags
    enableIngestion: false
  }
}

resource workspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' existing = {
  name: workspaceName
}

resource tables 'Microsoft.OperationalInsights/workspaces/tables@2023-09-01' = [for tableName in appTables: {
  parent: workspace
  name: tableName
  properties: {
    schema: {
      name: tableName
      columns: []
    }
    plan: 'Analytics'
    retentionInDays: 90
    totalRetentionInDays: 90
  }
  dependsOn: [bootstrap]
}]

resource transformation 'Microsoft.Insights/dataCollectionRules@2023-03-11' = {
  name: 'dcr-${suffix}'
  location: location
  tags: tags
  kind: 'WorkspaceTransforms'
  properties: {
    destinations: {
      logAnalytics: [{ name: 'telemetry', workspaceResourceId: workspace.id }]
    }
    dataFlows: [for tableName in appTables: {
      streams: ['Microsoft-Table-${tableName}']
      destinations: ['telemetry']
      transformKql: tableName == 'AppEvents' ? eventTransform : 'source | where false'
    }]
  }
  dependsOn: [tables]
}

module attachedWorkspace './workspace.bicep' = {
  name: 'workspace-attach-${environmentName}'
  params: {
    workspaceName: workspaceName
    location: location
    tags: tags
    transformationRuleId: transformation.id
    enableIngestion: enableIngestion
  }
}

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: 'appi-${suffix}'
  location: location
  kind: 'web'
  tags: tags
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: attachedWorkspace.outputs.id
    IngestionMode: 'LogAnalytics'
    DisableLocalAuth: false
    DisableIpMasking: false
    publicNetworkAccessForIngestion: enableIngestion ? 'Enabled' : 'Disabled'
    publicNetworkAccessForQuery: 'Enabled'
    RetentionInDays: 90
  }
}

resource failureAnomalies 'Microsoft.AlertsManagement/smartDetectorAlertRules@2021-04-01' = {
  name: 'Failure Anomalies - ${applicationInsights.name}'
  location: 'global'
  tags: tags
  properties: {
    state: 'Disabled'
    severity: 'Sev3'
    frequency: 'PT1M'
    detector: { id: 'FailureAnomaliesDetector' }
    scope: [applicationInsights.id]
    actionGroups: { groupIds: [actionGroupId] }
  }
}

var rules = [
  {
    name: 'ingestion'
    description: 'At least 80 MB billable retained ingestion in a rolling 24 hours; delayed, not a hard stop.'
    query: 'Usage | where TimeGenerated > ago(24h) | where IsBillable == true | summarize BillableMB = sum(Quantity)'
    window: 'P1D'
    measure: 'BillableMB'
    threshold: 80
    severity: 2
  }
  {
    name: 'errors'
    description: 'At least 10 unexpected-error records in an hour, not an error rate or a count of affected users.'
    query: 'AppEvents | where TimeGenerated > ago(1h) | where Name == "sysml.error" | summarize Errors = count()'
    window: 'PT1H'
    measure: 'Errors'
    threshold: 10
    severity: 2
  }
]

resource alerts 'Microsoft.Insights/scheduledQueryRules@2023-12-01' = [for rule in rules: {
  name: 'alert-${rule.name}-${suffix}'
  location: location
  tags: tags
  kind: 'LogAlert'
  properties: {
    displayName: '${environmentName}: telemetry ${rule.name}'
    description: rule.description
    enabled: true
    severity: rule.severity
    scopes: [attachedWorkspace.outputs.id]
    evaluationFrequency: 'PT1H'
    windowSize: rule.window
    autoMitigate: true
    checkWorkspaceAlertsStorageConfigured: false
    skipQueryValidation: false
    criteria: {
      allOf: [
        {
          query: rule.query
          timeAggregation: 'Maximum'
          metricMeasureColumn: rule.measure
          operator: 'GreaterThanOrEqual'
          threshold: rule.threshold
          failingPeriods: {
            minFailingPeriodsToAlert: 1
            numberOfEvaluationPeriods: 1
          }
        }
      ]
    }
    actions: {
      actionGroups: [actionGroupId]
    }
  }
}]

var workbookDefinition = loadJsonContent('../workbook-queries.json')
var queryScope = '${workbookDefinition.timeScope}${workbookDefinition.filterScope}'
var workbookLinks = [for section in workbookDefinition.sections: {
  cellValue: 'Page'
  linkTarget: 'parameter'
  linkLabel: section.label
  subTarget: section.id
  style: 'link'
}]
var workbookParameters = [for parameter in workbookDefinition.parameters: union(parameter,
  contains(parameter, 'query') ? {
    query: parameter.query
    queryType: 0
    resourceType: 'microsoft.operationalinsights/workspaces'
    crossComponentResources: [workspace.id]
  } : {})]
var workbookItems = [for query in workbookDefinition.queries: {
  type: 12
  name: query.id
  conditionalVisibility: {
    parameterName: 'Page'
    comparison: 'isEqualTo'
    value: query.section
  }
  content: {
    version: 'NotebookGroup/1.0'
    groupType: 'editable'
    loadType: 'lazy'
    title: query.title
    items: [
      {
        type: 1
        name: '${query.id}-notes'
        content: { json: '**What this means:** ${query.description}' }
      }
      {
        type: 3
        name: '${query.id}-query'
        content: {
          version: 'KqlItem/1.0'
          title: query.title
          query: '${queryScope}${query.query}'
          size: 0
          queryType: 0
          resourceType: 'microsoft.operationalinsights/workspaces'
          crossComponentResources: [workspace.id]
          timeContextFromParameter: 'TimeRange'
          visualization: query.visualization
          noDataMessage: 'No retained matching records. Check filters, consent, collection and ingestion limits.'
          showExportToExcel: false
        }
      }
    ]
  }
}]

resource workbook 'Microsoft.Insights/workbooks@2022-04-01' = {
  name: guid(resourceGroup().id, environmentName, 'sysml-telemetry')
  location: location
  kind: 'shared'
  tags: tags
  properties: {
    displayName: 'SysML telemetry (${environmentName})'
    category: 'workbook'
    sourceId: applicationInsights.id
    serializedData: string({
      version: 'Notebook/1.0'
      items: concat([
        {
          type: 1
          name: 'measurement-boundaries'
          content: { json: workbookDefinition.notice }
        }
        {
          type: 9
          name: 'filters'
          content: {
            version: 'KqlParameterItem/1.0'
            style: 'above'
            parameters: workbookParameters
          }
        }
        {
          type: 11
          name: 'sections'
          content: {
            version: 'LinkItem/1.0'
            style: 'tabs'
            links: workbookLinks
          }
        }
        {
          type: 9
          name: 'journey-session'
          conditionalVisibility: {
            parameterName: 'Page'
            comparison: 'isEqualTo'
            value: 'journeys'
          }
          content: {
            version: 'KqlParameterItem/1.0'
            style: 'above'
            parameters: [union(workbookDefinition.sessionParameter, {
              query: '${queryScope}${workbookDefinition.sessionParameter.query}'
              queryType: 0
              resourceType: 'microsoft.operationalinsights/workspaces'
              crossComponentResources: [workspace.id]
              timeContextFromParameter: 'TimeRange'
            })]
          }
        }
      ], workbookItems)
      isLocked: true
      fallbackResourceIds: [applicationInsights.id]
    })
  }
}

output resources object = {
  applicationInsightsId: applicationInsights.id
  workspaceId: attachedWorkspace.outputs.id
  workspaceName: workspaceName
  transformationRuleId: transformation.id
  workbookId: workbook.id
  ingestionEnabled: enableIngestion
}
