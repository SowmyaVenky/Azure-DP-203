######################################################################
##                Setup Spring container on a AKS.
######################################################################

# DEFINE RESOURCE GROUP NAME AND LOCATION PARAMETERS
$resourceGroupName = (Get-AzResourceGroup).ResourceGroupName

#Login to Azure  - First pass uncomment to login to azure.
# Connect-AzAccount

# Use ARM template to deploy resources
Write-Host "Creating AKS cluster. This may take some time..."

## This will deploy the H2 version of the app so that we can test basic stuff.
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
  -TemplateFile "arm-templates/aks-cluster/azuredeploy.json" `
  -Mode Incremental `
  -Force

  Import-AzAksCredential -ResourceGroupName $resourceGroupName -Name venky-aks-cluster