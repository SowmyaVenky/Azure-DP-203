######################################################################
##                Private DNS example
# 1. Create a private DNS zone gssystems.com
# 2. Create a VNET and 2 VMs inside a subnet. 
# 3. Enable auto registration for the private zone, allowing VMs spawned to register directly.
# 4. ping using venky-vm-1.gssystems.com, venky-vm-2.gssystems.com, db.gssystems.com
# 5. See pics in arm template directory to see what command to exeute for allowing a ping using 
# powershell 
######################################################################

# DEFINE RESOURCE GROUP NAME AND LOCATION PARAMETERS
$resourceGroupName = (Get-AzResourceGroup).ResourceGroupName

#Login to Azure  - First pass uncomment to login to azure.
# Connect-AzAccount

# Use ARM template to deploy resources
Write-Host "Creating private DNS zone. This may take some time..."

## This will deploy the H2 version of the app so that we can test basic stuff.
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
  -TemplateFile "arm-templates/private-dns/azuredeploy.json" `
  -Mode Complete `
  -Force

# These commands are needed on both the vms to allow the ping 
$Params = @{
  ResourceGroupName  = $resourceGroupName
  VMName             = "venky-vm-1"
  Name               = 'AllowPing'
  Publisher          = 'Microsoft.Compute'
  ExtensionType      = 'CustomScriptExtension'
  TypeHandlerVersion = '1.10'
  Settings          = @{fileUris = @('https://raw.githubusercontent.com/SowmyaVenky/Azure-DP-203/main/AZ-104-Commands/shell-scripts/allow-ping-in-windows.ps1'); commandToExecute = 'powershell -ExecutionPolicy Unrestricted -File allow-ping-in-windows.ps1'}
}
Set-AzVMExtension @Params