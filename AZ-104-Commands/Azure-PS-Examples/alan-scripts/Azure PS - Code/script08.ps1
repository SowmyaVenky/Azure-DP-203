# Defining a value for the resource group
$resourceGroup = (Get-AzResourceGroup).ResourceGroupName
$location =  (Get-AzResourceGroup).Location

$publicIPAddressName="app-public-ip"

New-AzPublicIpAddress -Name $publicIPAddressName -ResourceGroupName $resourceGroup -Location $location -AllocationMethod Dynamic