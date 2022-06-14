# Defining a value for the resource group
$resourceGroup = (Get-AzResourceGroup).ResourceGroupName
$location =  (Get-AzResourceGroup).Location

$network="exam-network"
$AddressPrefix="10.1.0.0/16"

New-AzVirtualNetwork -Name $network -ResourceGroupName $resourceGroup `
-Location $location -AddressPrefix $AddressPrefix