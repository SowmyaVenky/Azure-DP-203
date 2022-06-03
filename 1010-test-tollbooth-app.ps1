######################################################################
##                PART 10: Test tollbooth app for azure streaming analytics #
## This uses a COMPLETE deployment, so this can't be used with other tests.
######################################################################

####Venky Notes
#1. Login in to cloud academy and create an azure sandbox. 
#2. Login to the portal with the username and password that is given
#3. Get the resource group name that has been provisioned. 
  
# DEFINE RESOURCE GROUP NAME AND LOCATION PARAMETERS
$resourceGroupName = "1-2b9199e3-playground-sandbox"

#Login to Azure  - First pass uncomment to login to azure.
Connect-AzAccount

#################################01 - Create ADF ########################
# Use ARM template to deploy resources
Write-Host "Creating tollbooth app. This may take some time..."

New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
  -TemplateFile "arm-templates/tollbooth-app/azuredeploy.json" `
  -TemplateParameterFile "arm-templates/tollbooth-app/azuredeploy.parameters.json" `
  -Mode Complete `
  -Force  