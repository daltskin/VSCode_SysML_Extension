targetScope = 'subscription'

@description('A NEW dedicated group. Never target an existing/shared group on first deployment.')
@minLength(1)
@maxLength(90)
param resourceGroupName string

@allowed(['westeurope'])
param location string = 'westeurope'

@secure()
@description('Approved operator email; provide at runtime, never commit its value.')
param notificationEmail string

@description('First day of the current month, YYYY-MM-01T00:00:00Z. Keep stable on updates.')
param budgetStartDate string

@description('Separate enablement approval is required after the closed deployment and privacy checks.')
param enableProdIngestion bool = false

resource telemetryGroup 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: resourceGroupName
  location: location
  tags: {
    workload: 'sysml-extension-telemetry'
    managedBy: 'bicep'
  }
}

module telemetry './modules/telemetry.bicep' = {
  name: 'sysml-telemetry'
  scope: telemetryGroup
  params: {
    location: location
    notificationEmail: notificationEmail
    budgetStartDate: budgetStartDate
    enableProdIngestion: enableProdIngestion
  }
}

output resourceGroupId string = telemetryGroup.id
output environments array = telemetry.outputs.environments
