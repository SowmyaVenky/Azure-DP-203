# Defining a value for the resource group
$resourceGroup = (Get-AzResourceGroup).ResourceGroupName
$location =  (Get-AzResourceGroup).Location

$availabilitySetName="app-set"

New-AzAvailabilitySet -ResourceGroupName $resourceGroup -Location $location -Name $availabilitySetName -Sku Aligned `
-PlatformFaultDomainCount 3 -PlatformUpdateDomainCount 5