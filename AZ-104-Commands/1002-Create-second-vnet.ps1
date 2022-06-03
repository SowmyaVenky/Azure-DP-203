######################################################################
##                PART 2: This creates the second vnet to host our middle tier.
## We want to create 2 separate vnets to get an idea how to peer them, and see 
## how addresses should not overlap 
######################################################################

####Venky Notes
#1. Login in to cloud academy and create an azure sandbox. 
#2. Login to the portal with the username and password that is given
#3. Get the resource group name that has been provisioned. 

# DEFINE RESOURCE GROUP NAME AND LOCATION PARAMETERS
$resourceGroupName = "1-2fbacb54-playground-sandbox"

#Login to Azure  - First pass uncomment to login to azure.
# Connect-AzAccount

#################################01 - Create a second vnet ########################
# Use ARM template to deploy resources
Write-Host "Creating second vnet and its subnet. This may take some time..."

New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
  -TemplateFile "arm-templates/venky-vnet-2/azuredeploy.json" `
  -Mode Incremental `
  -TemplateParameterFile "arm-templates/venky-vnet-2/azuredeploy.parameters.json" `
  -Force