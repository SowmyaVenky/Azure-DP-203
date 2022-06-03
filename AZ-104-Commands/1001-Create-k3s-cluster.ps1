######################################################################
##                PART I: This creates 4 VMs. 1 windows and 3 ubuntu.
## The win machine is for RDP and acts like a bastion. 
## The 3 ubuntu servers need to be configured into a k3s cluster. 
## Instructions to do that are given in the install-k3s-master.sh.
##
######################################################################

####Venky Notes
#1. Login in to cloud academy and create an azure sandbox. 
#2. Login to the portal with the username and password that is given
#3. Get the resource group name that has been provisioned. 

# DEFINE RESOURCE GROUP NAME AND LOCATION PARAMETERS
$resourceGroupName = (Get-AzResourceGroup).ResourceGroupName

#Login to Azure  - First pass uncomment to login to azure.
# Connect-AzAccount

Write-Host "Here are your subscriptions..."
Get-AzSubscription

#################################01 - Create a storage account ########################
# Use ARM template to deploy resources
Write-Host "Creating windows + 3 ubuntu servers inside subnet. This may take some time..."

New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
  -TemplateFile "arm-templates/k3s-cluster/azuredeploy.json" `
  -Mode Incremental `
  -TemplateParameterFile "arm-templates/k3s-cluster/azuredeploy.parameters.json" `
  -Force