# Defining a value for the resource group
$resourceGroup = (Get-AzResourceGroup).ResourceGroupName
$location =  (Get-AzResourceGroup).Location
$vmName="appvm"
$vmSize="Standard_DS1_v2"
$vmImage = "Win2019Datacenter"
$nsgName="app-nsg"
$vmPublicIP="app-public-ip"
$virtualNetworkName="exam-network"
$subnetName="SubnetA"
$availabilitySetName="app-set"

Remove-AzVM -ResourceGroupName $resourceGroup `
-Name $vmName `


# Get-AzVMSize -Location "North Europe"

New-AzVM -ResourceGroupName $resourceGroup -Location $location -Name $vmName -VirtualNetworkName $virtualNetworkName `
-SubnetName $subnetName -Size $vmSize -Image $vmImage -SecurityGroupName $nsgName -PublicIpAddressName $vmPublicIP `
-Credential (Get-Credential) -AvailabilitySetName $availabilitySetName

