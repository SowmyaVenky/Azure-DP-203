######################################################################
##                PART 5: Create Synapse workspaces #
######################################################################

####Venky Notes
#1. Login in to cloud academy and create an azure sandbox. 
#2. Login to the portal with the username and password that is given
#3. Get the resource group name that has been provisioned. 
  
# DEFINE RESOURCE GROUP NAME AND LOCATION PARAMETERS
$resourceGroupName = "1-366b7d95-playground-sandbox"

#Login to Azure  - First pass uncomment to login to azure.
# Connect-AzAccount

#################################01 - Create ADF ########################
# Use ARM template to deploy resources
Write-Host "Creating Synapse Workspace. This may take some time..."

New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
  -TemplateFile "arm-templates/synapse/azuredeploy.json" `
  -TemplateParameterFile "arm-templates/synapse/azuredeploy.parameters.json" `
  -Mode Incremental `
  -Force

  ##### Install the sqlcmd utility to get access to synapse from the local computer.
  Write-Host "After this step, please install sqlcmd utility from the microsoft website, then run the 1006-Lab-01-SQL.cmd - Note that this is a cmd, and you will need a regular dos prompt for this, not a PS shell"
  