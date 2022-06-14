# Defining a value for the resource group
$resourceGroupName = (Get-AzResourceGroup).ResourceGroupName
$location =  (Get-AzResourceGroup).Location

Get-AzResourceGroup -Name $resourceGroupName -Location $location