######################################################################
##                PART 8: Create databricks workspaces #
## This is not working because linux academy will not allow for this priviledge
######################################################################

####Venky Notes
#1. Login in to cloud academy and create an azure sandbox. 
#2. Login to the portal with the username and password that is given
#3. Get the resource group name that has been provisioned. 
  
# DEFINE RESOURCE GROUP NAME AND LOCATION PARAMETERS
$resourceGroupName = (Get-AzResourceGroup).ResourceGroupName

#Login to Azure  - First pass uncomment to login to azure.
# Connect-AzAccount

#################################01 - Create ADF ########################
# Use ARM template to deploy resources
Write-Host "Creating cosmos db. This may take some time..."

New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
  -TemplateFile "arm-templates/cosmos-db/azuredeploy.json" `
  -TemplateParameterFile "arm-templates/cosmos-db/azuredeploy.parameters.json" `
  -Mode Incremental `
  -Force  