@description('Name of the dedicated telemetry workspace.')
param workspaceName string

@description('Approved telemetry region.')
param location string

@description('Non-personal resource ownership and environment tags.')
param tags object

@description('Workspace transformation rule; empty only during closed bootstrap.')
param transformationRuleId string = ''

@description('Enable only after privacy validation and explicit risk acknowledgement.')
param enableIngestion bool = false

resource workspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: workspaceName
  location: location
  tags: tags
  properties: {
    defaultDataCollectionRuleResourceId: empty(transformationRuleId) ? null : transformationRuleId
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 90
    workspaceCapping: {
      dailyQuotaGb: json('0.1')
    }
    features: {
      disableLocalAuth: true
      enableLogAccessUsingOnlyResourcePermissions: false
      immediatePurgeDataOn30Days: false
      enableDataExport: false
    }
    publicNetworkAccessForIngestion: enableIngestion ? 'Enabled' : 'Disabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

output id string = workspace.id
output name string = workspace.name
