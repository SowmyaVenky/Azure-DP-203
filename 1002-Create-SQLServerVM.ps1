######################################################################
##                PART 2: Create an SQL Server VM instance #
######################################################################

####Venky Notes
#1. Login in to cloud academy and create an azure sandbox. 
#2. Login to the portal with the username and password that is given
#3. Get the resource group name that has been provisioned. 
  
# DEFINE RESOURCE GROUP NAME AND LOCATION PARAMETERS
$resourceGroupName = "1-366b7d95-playground-sandbox"

#Login to Azure  - First pass uncomment to login to azure.
# Connect-AzAccount

#################################01 - Create SQL Server DB ########################
# Use ARM template to deploy resources
Write-Host "Creating SQL Server database. This may take some time..."

New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
  -TemplateFile "arm-templates/sql-server/azuredeploy.json" `
  -TemplateParameterFile "arm-templates/sql-server/azuredeploy.parameters.json" `
  -Mode Incremental `
  -Force