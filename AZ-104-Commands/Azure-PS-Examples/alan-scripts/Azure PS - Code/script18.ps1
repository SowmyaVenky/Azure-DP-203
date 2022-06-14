# Defining a value for the resource group
$resourceGroup = (Get-AzResourceGroup).ResourceGroupName
$location =  (Get-AzResourceGroup).Location

$scaleSetName="app-set"
$virtualNetworkName="new-network"
$subnetName="SubnetA"
$vmImage = "Win2019Datacenter"
$vmSize="Standard_DS1_v2"

New-AzVmss -ResourceGroupName $resourceGroup -Location $location -VMScaleSetName $scaleSetName `
  -VirtualNetworkName $virtualNetworkName -SubnetName $subnetName -PublicIpAddressName "myPublicIPAddress" `
  -ImageName $vmImage -UpgradePolicyMode "Automatic" -VmSize $vmSize -Credential (Get-Credential)