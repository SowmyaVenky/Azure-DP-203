######################################################################
##                PART I: Creating an Azure Data Factory            ##
######################################################################

####Venky Notes
#1. Login in to cloud academy and create an azure sandbox. 
#2. Login to the portal with the username and password that is given
#3. Get the resource group name that has been provisioned. 
#4. Get the region that has been used to create the RG. Use those also below.
  
$random_suffix = Get-Random
$AzureDataFactoryName = "VenkyAzureDataFactory" + $random_suffix
$StorageAccountName = "VenkyStorageAccount" + $random_suffix
$StorageContainerName = "VenkyContainer" + $random_suffix

# DEFINE RESOURCE GROUP NAME AND LOCATION PARAMETERS
$resourceGroupName = "1-08e3c4fe-playground-sandbox"
$rglocation = "West US"

#Login to Azure
Connect-AzAccount

Write-Host "Here are your subscriptions..."
Get-AzSubscription

#################################01 - Create a storage account ########################

Write-Host "Creating Storage Account with name - " $StorageAccountName

New-AzStorageAccount -ResourceGroupName $resourceGroupName `
  -Name $StorageAccountName `
  -Location $rglocation `
  -SkuName Standard_RAGRS `
  -Kind StorageV2

Write-Host "Creating container With name - " $StorageContainerName

New-AzureStorageContainer -Name $StorageContainerName -Permission Off

Write-Host "Creating Azure Data Factory With name - " $AzureDataFactoryName

New-AzDataFactoryV2 -ResourceGroupName $resourceGroupName `
  -Name $AzureDataFactoryName `
  -Location $rglocation

Get-AzDataFactoryV2 -ResourceGroupName $resourceGroupName