######################################################################
# Create 3 vnets
# One acts as a fake onpremise network with a windows server VM with routing/VPN installed.
# One acts as a app subnet that has ubuntu & flask app installed.
# One acts as a secondary app subnet that has ubuntu & flask app installed.
# Each vnet will have a subnet, and peering will be established as required by the test case.

# VNET 1 = 10.0.0.0/16
#   fakeonpremsubnet = 10.0.0.0/24
# VNET 2 = 10.1.0.0/16
#   app-subnet-1 = 10.1.0.0/24
# VNET 3 = 10.2.0.0/16
#   app-subnet-2 = 10.2.0.0/24
######################################################################
$resourceGroupName = (Get-AzResourceGroup).ResourceGroupName
$location = (Get-AzResourceGroup).Location

#Login to Azure  - First pass uncomment to login to azure.
# Connect-AzAccount

$vnet1 = @{
  Name = 'fake-onprem-vnet'
  ResourceGroupName = $resourceGroupName
  Location = $location
  AddressPrefix = '10.0.0.0/16'    
}
$vnet2 = @{
  Name = 'app-vnet-1'
  ResourceGroupName = $resourceGroupName
  Location = $location
  AddressPrefix = '10.1.0.0/16'    
}
$vnet3 = @{
  Name = 'app-vnet-2'
  ResourceGroupName = $resourceGroupName
  Location = $location
  AddressPrefix = '10.2.0.0/16'    
}


$fakeonpremvnet = New-AzVirtualNetwork @vnet1
$appvnet1 = New-AzVirtualNetwork @vnet2
$appvnet2 = New-AzVirtualNetwork @vnet3

$fakeonpremsubnetconf = @{
  Name = 'fakeonpremsn'
  VirtualNetwork = $fakeonpremvnet
  AddressPrefix = '10.0.0.0/24'
}
$fakeonpremsubnet = Add-AzVirtualNetworkSubnetConfig @fakeonpremsubnetconf

$appsubnet1conf = @{
  Name = 'app-subnet-1'
  VirtualNetwork = $appvnet1
  AddressPrefix = '10.1.0.0/24'
}
$appsubnet1 = Add-AzVirtualNetworkSubnetConfig @appsubnet1conf

$appsubnet2conf = @{
  Name = 'app-subnet-2'
  VirtualNetwork = $appvnet2
  AddressPrefix = '10.2.0.0/24'
}
$appsubnet2 = Add-AzVirtualNetworkSubnetConfig @appsubnet2conf

## materialize the vnets now
$fakeonpremvnet | Set-AzVirtualNetwork
$appvnet1 | Set-AzVirtualNetwork
$appvnet2 | Set-AzVirtualNetwork

# now launch a windows vm on fakeonpremsubnet, and in both the app vnets a ubuntu machine
# run the flask app on both the ubuntu machines to test
$VMLocalAdminUser = "venkyuser"
$VMLocalAdminSecurePassword = ConvertTo-SecureString "Ganesh20022002" -AsPlainText -Force
$VMSize = "Standard_B2s"

$Credential = New-Object System.Management.Automation.PSCredential ($VMLocalAdminUser, $VMLocalAdminSecurePassword);

## We need to refetch the object to get its Id after it was created. 
## otherwise the ID will be null. 
$appvnet1 = Get-AzVirtualNetwork -Name 'app-vnet-1'

$venkyappvm1nic = New-AzNetworkInterface -Name 'venkyappvm1nic' `
-ResourceGroupName $ResourceGroupName `
-Location $location `
-SubnetId $appvnet1.Subnets[0].Id

# Create a VM, following this set various aspects by calling proper methods on the object.
$venkyappvm1 = New-AzVMConfig -VMName 'venky-app-vm1' -VMSize $VMSize

$venkyappvm1 = Set-AzVMOperatingSystem -VM $venkyappvm1 `
-Linux `
-ComputerName 'venky-app-vm1' `
-Credential $Credential 

$venkyappvm1 = Add-AzVMNetworkInterface `
-VM $venkyappvm1 `
-Id $venkyappvm1nic.Id

$venkyappvm1 = Set-AzVMSourceImage -VM $venkyappvm1 `
-PublisherName 'Canonical' `
-Offer 'UbuntuServer' `
-Skus '18.04-LTS' `
-Version latest

#Disable boot diagnostics 
$venkyappvm1 = Set-AzVMBootDiagnostic `
-VM $venkyappvm1 `
-Disable

New-AzVM -ResourceGroupName $ResourceGroupName `
-Location $location `
-VM $venkyappvm1 `
-Verbose

## We need to refetch the object to get its Id after it was created. 
## otherwise the ID will be null. 
$appvnet2 = Get-AzVirtualNetwork -Name 'app-vnet-2'

$venkyappvm2nic = New-AzNetworkInterface -Name 'venkyappvm2nic' `
-ResourceGroupName $ResourceGroupName `
-Location $location `
-SubnetId $appvnet2.Subnets[0].Id

# Create a VM, following this set various aspects by calling proper methods on the object.
$venkyappvm2 = New-AzVMConfig -VMName 'venky-app-vm2' -VMSize $VMSize

$venkyappvm2 = Set-AzVMOperatingSystem -VM $venkyappvm2 `
-Linux `
-ComputerName 'venky-app-vm2' `
-Credential $Credential 

$venkyappvm2 = Add-AzVMNetworkInterface `
-VM $venkyappvm2 `
-Id $venkyappvm2nic.Id

$venkyappvm2 = Set-AzVMSourceImage -VM $venkyappvm2 `
-PublisherName 'Canonical' `
-Offer 'UbuntuServer' `
-Skus '18.04-LTS' `
-Version latest

#Disable boot diagnostics 
$venkyappvm2 = Set-AzVMBootDiagnostic `
-VM $venkyappvm2 `
-Disable

New-AzVM -ResourceGroupName $ResourceGroupName `
-Location $location `
-VM $venkyappvm2 `
-Verbose

## This part will get the VM back into a new var and execute setup scripts
## Both the scripts are pulled from storage account.
$Params = @{
  ResourceGroupName  = $resourceGroupName
  VMName             = 'venky-app-vm1'
  Name               = 'CustomScript'
  Publisher          = 'Microsoft.Azure.Extensions'
  ExtensionType      = 'CustomScript'
  TypeHandlerVersion = '2.1'
  Settings          = @{fileUris = @('https://raw.githubusercontent.com/SowmyaVenky/Azure-DP-203/main/AZ-104-Commands/shell-scripts/install-flaskapp.sh'); commandToExecute = 'sh install-flaskapp.sh'}
}
Set-AzVMExtension @Params

#install maria db for testing 
$Params = @{
  ResourceGroupName  = $resourceGroupName
  VMName             = "venky-app-vm2"
  Name               = 'CustomScript'
  Publisher          = 'Microsoft.Azure.Extensions'
  ExtensionType      = 'CustomScript'
  TypeHandlerVersion = '2.1'
  Settings          = @{fileUris = @('https://raw.githubusercontent.com/SowmyaVenky/Azure-DP-203/main/AZ-104-Commands/shell-scripts/install-flaskapp.sh'); commandToExecute = 'sh install-flaskapp.sh'}
}
Set-AzVMExtension @Params

# Create a VM, following this set various aspects by calling proper methods on the object.
New-AzVm `
    -ResourceGroupName $resourceGroupName `
    -Name 'routervm' `
    -Location $location `
    -VirtualNetworkName 'fake-onprem-vnet' `
    -SubnetName 'fakeonpremsn' `
    -SecurityGroupName 'routervmnsg' `
    -PublicIpAddressName 'routervmpip' `
    -Credential $Credential `
    -Size 'Standard_D2s_V3' -OpenPorts 80,3389