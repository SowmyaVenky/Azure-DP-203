######################################################################
##                PART I: Creating storage accounts, containers and upload files #
######################################################################

####Venky Notes
#1. Login in to cloud academy and create an azure sandbox. 
#2. Login to the portal with the username and password that is given
#3. Get the resource group name that has been provisioned. 
  
##Here we are creating the containers needed to make a data lake.
#1. Create a storage account under the resource group. Make sure Hierarchical namespaces are enabled.
#2. Create a rawzone container under the storage account.
#3. Create a staging container under the storage.

$random_suffix = Get-Random
$StorageAccountName = "vksa" + $random_suffix
$RawStorageContainerName = "raw" + $random_suffix
$StagingStorageContainerName = "stage" + $random_suffix

# DEFINE RESOURCE GROUP NAME AND LOCATION PARAMETERS
$resourceGroupName = "1-49772ee6-playground-sandbox"

#Login to Azure  - First pass uncomment to login to azure.
# Connect-AzAccount

Write-Host "Here are your subscriptions..."
Get-AzSubscription

#################################01 - Create a storage account ########################
# Use ARM template to deploy resources
Write-Host "Creating Azure resources. This may take some time..."

New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
  -TemplateFile "arm-templates/storage-account-containers/azuredeploy.json" `
  -Mode Complete `
  -storageAccountName $StorageAccountName `
  -rawContainerName $RawStorageContainerName `
  -stagingContainerName $StagingStorageContainerName `
  -Force

## Now copy the entire wwi-02 to the raw container. These will enable us to follow MS tutorial.
# The azcopy login will give you a code a URL. Need to open that URL with a browser, and then enter the code. 
# Once logged in, the copy will happen.
.\azcopy login
.\azcopy copy ".\wwi-02" "https://$StorageAccountName.blob.core.windows.net/$RawStorageContainerName/" --recursive=true