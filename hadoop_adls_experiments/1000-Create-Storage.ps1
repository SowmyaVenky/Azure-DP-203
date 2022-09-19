######################################################################
##                PART 0: Create storage accounts.
######################################################################

####Venky Notes
#1. Login in to cloud academy and create an azure sandbox. 
#2. Login to the portal with the username and password that is given
#3. Get the resource group name that has been provisioned. 

# DEFINE RESOURCE GROUP NAME AND LOCATION PARAMETERS
$resourceGroupName = (Get-AzResourceGroup).ResourceGroupName

#Login to Azure  - First pass uncomment to login to azure.
# Connect-AzAccount

#################################01 - Create a storage account ########################
# Use ARM template to deploy resources
Write-Host "Storage accounts for scripts. This may take some time..."

New-AzStorageAccount `
-ResourceGroupName $resourceGroupName `
-Name venkystorageaccount0427 `
-Location westus `
-SkuName Standard_GRS


New-AzRmStorageContainer `
-ResourceGroupName $resourceGroupName `
-AccountName "venkystorageaccount0427" `
-ContainerName "venkycontainer" 

Get-AzRmStorageContainer `
-ResourceGroupName $resourceGroupName `
-AccountName "venkystorageaccount0427" `
-ContainerName "venkycontainer"


## Copy the people.csv in the temp folder to the container we created.
SET HADOOP_CLASSPATH=%HADOOP_CLASSPATH%;%HADOOP_HOME%\share\hadoop\tools\lib\*
C:\Venky\DP-203\Azure-DP-203\hadoop_adls_experiments>hadoop fs -ls wasbs://venkycontainer@venkystorageaccount0427.blob.core.windows.net/
2022-09-17 20:39:37,438 INFO impl.MetricsConfig: Loaded properties from hadoop-metrics2.properties
2022-09-17 20:39:37,582 INFO impl.MetricsSystemImpl: Scheduled Metric snapshot period at 10 second(s).
2022-09-17 20:39:37,582 INFO impl.MetricsSystemImpl: azure-file-system metrics system started
Found 1 items
-rwxrwxrwx   1         49 2022-09-17 20:22 wasbs://venkycontainer@venkystorageaccount0427.blob.core.windows.net/people.csv
2022-09-17 20:39:38,745 INFO impl.MetricsSystemImpl: Stopping azure-file-system metrics system...
2022-09-17 20:39:38,745 INFO impl.MetricsSystemImpl: azure-file-system metrics system stopped.
2022-09-17 20:39:38,745 INFO impl.MetricsSystemImpl: azure-file-system metrics system shutdown complete.

