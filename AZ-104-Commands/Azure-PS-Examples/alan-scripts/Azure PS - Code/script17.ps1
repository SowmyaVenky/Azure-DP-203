# Defining a value for the resource group
$resourceGroup = (Get-AzResourceGroup).ResourceGroupName
$location =  (Get-AzResourceGroup).Location

$appServicePlanName="app-plan"
$appName="webapp788788"
$githubURL="https://github.com/SowmyaVenky/TestAzureWebApp.git"

# First we need to upgrade our App Service Plan
# Set-AzAppServicePlan -Name $appServicePlanName -ResourceGroupName $resourceGroup -Tier Standard

# Then we create a new deployment slot
# New-AzWebAppSlot -Name $appname -ResourceGroupName $resourceGroup -Slot staging

# Then we deploy a newer version of the app to the slot
#$PropertiesObject = @{
#    repoUrl = $githubURL;
#    branch = "main";
#    isManualIntegration = "true";
#}

#Set-AzResource -Properties $PropertiesObject -ResourceGroupName $resourceGroup `
#-ResourceType Microsoft.Web/sites/slots/sourcecontrols -ResourceName $appname/staging/web -ApiVersion 2015-08-01 -Force

# And then we swap the slots
Switch-AzWebAppSlot -Name $appname -ResourceGroupName $resourceGroup -SourceSlotName staging -DestinationSlotName production