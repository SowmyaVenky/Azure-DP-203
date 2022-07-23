######################################################################
##                Create AKS
######################################################################

# DEFINE RESOURCE GROUP NAME AND LOCATION PARAMETERS
$resourceGroupName = (Get-AzResourceGroup).ResourceGroupName

#Login to Azure  - First pass uncomment to login to azure.
#Connect-AzAccount

#################################01 - Create a storage account ########################
# Use ARM template to deploy resources
Write-Host "Creating AKS cluster. This may take some time..."

New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
  -TemplateFile "arm-templates/aks-deploy.json" `
  -Mode Incremental `
  -Force

  #import credential so that we can execute kubectl commands.
  Import-AzAksCredential -ResourceGroupName $resourceGroupName -Name venky-aks-cluster