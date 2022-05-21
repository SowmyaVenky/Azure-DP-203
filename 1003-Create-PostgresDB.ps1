######################################################################
##                PART 3: Create a postgres paas DB instance #
######################################################################

####Venky Notes
#1. Login in to cloud academy and create an azure sandbox. 
#2. Login to the portal with the username and password that is given
#3. Get the resource group name that has been provisioned. 
  
# DEFINE RESOURCE GROUP NAME AND LOCATION PARAMETERS
$resourceGroupName = "1-b4d662d1-playground-sandbox"

#Login to Azure  - First pass uncomment to login to azure.
# Connect-AzAccount

#################################01 - Create SQL Server DB ########################
# Use ARM template to deploy resources
Write-Host "Creating Postgres database. This may take some time..."

New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
  -TemplateFile "arm-templates/postgres-db/azuredeploy.json" `
  -TemplateParameterFile "arm-templates/postgres-db/azuredeploy.parameters.json" `
  -Mode Incremental `
  -Force

  ## Connect to server venkypg101.postgres.database.azure.com
  ## Username : venkypg101@venkypg101
  ## Password : Ganesh20022002
  
# Go to portal after this and enable "allow azure services to connect to database", 
# and add your IP to the range of IPs allowed to connect to the  DB