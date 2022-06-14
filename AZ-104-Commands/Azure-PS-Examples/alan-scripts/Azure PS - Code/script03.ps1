# Defining a value for the resource group
$resourceGroup = (Get-AzResourceGroup).ResourceGroupName
$location =  (Get-AzResourceGroup).Location
$network="exam-network"

$virtualNetwork=Get-AzVirtualNetwork -Name $network -ResourceGroupName $resourceGroup

Write-Host $virtualNetwork.Location

Write-Host $virtualNetwork.AddressSpace.AddressPrefixes