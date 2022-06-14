# Defining a value for the resource group
$resourceGroup = (Get-AzResourceGroup).ResourceGroupName
$location =  (Get-AzResourceGroup).Location

$storageAccountName="appstore466566"

New-AzStorageAccount -ResourceGroupName $resourceGroup -Name $storageAccountName -Location $location `
-SkuName Standard_GRS -Kind StorageV2