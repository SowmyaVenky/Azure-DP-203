# Defining a value for the resource group
$resourceGroup = (Get-AzResourceGroup).ResourceGroupName
$location =  (Get-AzResourceGroup).Location

$appServicePlanName="app-plan"
$appName="webapp788788"

# First we need to create the App Service Plan

New-AzAppServicePlan -Name $appServicePlanName -ResourceGroupName $resourceGroup -Location $location -Tier Free

# Then we create the Azure Web App
New-AzWebApp -Name $appName -ResourceGroupName $resourceGroup -Location $location -AppServicePlan $appServicePlanName