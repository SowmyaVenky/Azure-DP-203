######################################################################
##                Setup Spring petclinic on a ACI container group.
######################################################################

####Venky Notes
#1. Login in to cloud academy and create an azure sandbox. 
#2. Login to the portal with the username and password that is given
#3. Get the resource group name that has been provisioned. 

# DEFINE RESOURCE GROUP NAME AND LOCATION PARAMETERS
$resourceGroupName = (Get-AzResourceGroup).ResourceGroupName

#Login to Azure  - First pass uncomment to login to azure.
# Connect-AzAccount

#################################01 - Create a second vnet ########################
# Use ARM template to deploy resources
Write-Host "Creating ACI container group for spring pet-clinic H2. This may take some time..."

## This will deploy the H2 version of the app so that we can test basic stuff.
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
  -TemplateFile "arm-templates/aci-petclinic/azuredeploy.json" `
  -Mode Incremental `
  -Force