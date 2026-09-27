param location string

@secure()
param notificationEmail string

param budgetStartDate string
param enableProdIngestion bool = false

var tags = {
  workload: 'sysml-extension-telemetry'
  managedBy: 'bicep'
}
var environmentSettings = [
  { name: 'prod', enabled: enableProdIngestion }
]

resource notifications 'Microsoft.Insights/actionGroups@2023-01-01' = {
  name: 'ag-sysml-telemetry'
  location: 'global'
  tags: tags
  properties: {
    groupShortName: 'sysml-ops'
    enabled: true
    emailReceivers: [
      {
        name: 'telemetry-operator'
        emailAddress: notificationEmail
        useCommonAlertSchema: true
      }
    ]
  }
}

resource budget 'Microsoft.Consumption/budgets@2023-05-01' = {
  name: 'budget-sysml-telemetry'
  properties: {
    category: 'Cost'
    amount: 20
    timeGrain: 'Monthly'
    timePeriod: {
      startDate: budgetStartDate
    }
    notifications: {
      actual80: {
        enabled: true
        operator: 'GreaterThanOrEqualTo'
        threshold: 80
        thresholdType: 'Actual'
        contactEmails: [notificationEmail]
        locale: 'en-gb'
      }
      actual100: {
        enabled: true
        operator: 'GreaterThanOrEqualTo'
        threshold: 100
        thresholdType: 'Actual'
        contactEmails: [notificationEmail]
        locale: 'en-gb'
      }
    }
  }
}

module environments './environment.bicep' = [for environment in environmentSettings: {
  name: 'telemetry-${environment.name}'
  params: {
    environmentName: environment.name
    location: location
    actionGroupId: notifications.id
    enableIngestion: environment.enabled
  }
}]

output environments array = [for (environment, index) in environmentSettings: {
  environment: environment.name
  resources: environments[index].outputs.resources
}]
