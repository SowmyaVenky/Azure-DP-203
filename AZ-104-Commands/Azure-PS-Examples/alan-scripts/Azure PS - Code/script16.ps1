# Defining a value for the resource group
$resourceGroup = (Get-AzResourceGroup).ResourceGroupName
$location =  (Get-AzResourceGroup).Location

$appName="webapp788788"
$githubURL="https://github.com/SowmyaVenky/TestAzureWebApp.git"

$PropertiesObject = @{
    repoUrl = $githubURL;
    branch = "main";
    isManualIntegration = "true";
}

Set-AzResource -Properties $PropertiesObject -ResourceGroupName $resourceGroup `
-ResourceType Microsoft.Web/sites/sourcecontrols -ResourceName $appname/web -ApiVersion 2015-08-01 -Force