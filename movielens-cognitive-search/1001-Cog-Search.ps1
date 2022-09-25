######################################################################
##                PART I: Create a cognitive search index.
######################################################################

####Venky Notes
#1. Login in to cloud academy and create an azure sandbox. 
#2. Login to the portal with the username and password that is given
#3. Get the resource group name that has been provisioned. 

# DEFINE RESOURCE GROUP NAME AND LOCATION PARAMETERS
$resourceGroupName = (Get-AzResourceGroup).ResourceGroupName

#Login to Azure  - First pass uncomment to login to azure.
#Connect-AzAccount

#################################01 - Create a cognitive search  ########################
# Use ARM template to deploy resources
Write-Host "Creating cognitive search. This may take some time..."

New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
  -TemplateFile "arm-template/cogsearch/azuredeploy.json" `
  -Mode Incremental `
  -TemplateParameterFile "arm-template/cogsearch/azuredeploy.parameters.json" `
  -Force
 