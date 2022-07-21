######################################################################
##                Create MSSQL DB
######################################################################

# DEFINE RESOURCE GROUP NAME AND LOCATION PARAMETERS
$resourceGroupName = (Get-AzResourceGroup).ResourceGroupName

#Login to Azure  - First pass uncomment to login to azure.
#Connect-AzAccount

#################################01 - Create a storage account ########################
# Use ARM template to deploy resources
Write-Host "Creating MSSQL managed instance. This may take some time..."

New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
  -TemplateFile "arm-templates/mssql-deploy.json" `
  -TemplateParameterFile "arm-templates/mssqldeploy.parameters.json" `
  -Mode Incremental `
  -Force