######################################################################
##                PART 0: Create storage accounts.
######################################################################

####Venky Notes
#1. Login in to cloud academy and create an azure sandbox. 
#2. Login to the portal with the username and password that is given
#3. Get the resource group name that has been provisioned. 

# DEFINE RESOURCE GROUP NAME AND LOCATION PARAMETERS
$resourceGroupName = "1-2b9199e3-playground-sandbox"

#Login to Azure  - First pass uncomment to login to azure.
# Connect-AzAccount

#################################01 - Create a storage account ########################
# Use ARM template to deploy resources
Write-Host "Storage accounts for scripts. This may take some time..."

New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
  -TemplateFile "arm-templates/blob-storage/azuredeploy.json" `
  -Mode Incremental `
  -Force

  ..\azcopy login
  ..\azcopy copy ".\shell-scripts" "https://venkyinitscr101.blob.core.windows.net/initsh101/" --recursive=true