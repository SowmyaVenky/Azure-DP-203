######################################################################
##                Setup 2 ubuntu VMs along with vnet and subnets.
## The 2 VMs are part of the availability set. This is a requirement for a basic LB.
## The LB exposes a public IP listening on port 80, and forwards to the python flask app on both vms.
## There are NAT rules to allow SSH via the LB on ports 42001 and 42002 to each of the VMs.
## NSGS HAVE TO ALLOW 22 and 5000 on the individual NICs to make this thing work. Need to investigate
## why this is really the case since there is a default rule to allow all from a load balancer.

### NEED TO FIGURE THIS OUT 
### I am not able to set the venky-lb-backend-pool correctly, need to manually set the VNET and 
### select the vms that are available to put that into the scope of the LB 
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
Write-Host "Creating 2 UBUNTU machines with a Basic LB in front. This may take some time..."

## This will deploy the H2 version of the app so that we can test basic stuff.
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
  -TemplateFile "arm-templates/basic-lb-with-vms/azuredeploy.json" `
  -Mode Complete `
  -Force

#Adter the VMs are provisioned, we need to run the flask scripts.
$Params = @{
  ResourceGroupName  = $resourceGroupName
  VMName             = "venkyvm1"
  Name               = 'CustomScript'
  Publisher          = 'Microsoft.Azure.Extensions'
  ExtensionType      = 'CustomScript'
  TypeHandlerVersion = '2.1'
  Settings          = @{fileUris = @('https://raw.githubusercontent.com/SowmyaVenky/Azure-DP-203/main/AZ-104-Commands/shell-scripts/install-flaskapp.sh'); commandToExecute = 'sh install-flaskapp.sh'}
}
Set-AzVMExtension @Params

$Params = @{
  ResourceGroupName  = $resourceGroupName
  VMName             = "venkyvm2"
  Name               = 'CustomScript'
  Publisher          = 'Microsoft.Azure.Extensions'
  ExtensionType      = 'CustomScript'
  TypeHandlerVersion = '2.1'
  Settings          = @{fileUris = @('https://raw.githubusercontent.com/SowmyaVenky/Azure-DP-203/main/AZ-104-Commands/shell-scripts/install-flaskapp.sh'); commandToExecute = 'sh install-flaskapp.sh'}
}
Set-AzVMExtension @Params
