######################################################################
##                PART 5: Create a ubuntu VM and install Maria DB on it.
######################################################################

####Venky Notes
#1. Login in to cloud academy and create an azure sandbox. 
#2. Login to the portal with the username and password that is given
#3. Get the resource group name that has been provisioned. 

# DEFINE RESOURCE GROUP NAME AND LOCATION PARAMETERS
$resourceGroupName = (Get-AzResourceGroup).ResourceGroupName
$location = (Get-AzResourceGroup).Location

$VMLocalAdminUser = "venkyuser"
$VMLocalAdminSecurePassword = ConvertTo-SecureString "Ganesh20022002" -AsPlainText -Force


Write-Host "RG = "  $resourceGroupName
Write-Host "Locaton = "  $location
Write-Host "User = "  $VMLocalAdminUser
Write-Host "password = "  $VMLocalAdminSecurePassword

#Login to Azure  - First pass uncomment to login to azure.
# Connect-AzAccount

$NetworkName = "maria-db-network"
$NICName = "mariadbnic"
$PublicIPAddressName = "mariadbPIP"
$SubnetName = "mariadbsn"
$SubnetAddressPrefix = "10.0.1.0/24"
$VnetAddressPrefix = "10.0.0.0/16"
$VMName = "mariadbvm"
$VMSize = "Standard_B2s"
$ComputerName = "venkymariadb101"

$sshrule = New-AzNetworkSecurityRuleConfig `
-Name ssh-rule `
-Description "Allow SSH" `
-Access Allow -Protocol Tcp -Direction Inbound -Priority 100 `
-SourceAddressPrefix Internet -SourcePortRange * `
-DestinationAddressPrefix * -DestinationPortRange 22

$networkSecurityGroup = New-AzNetworkSecurityGroup -ResourceGroupName $resourceGroupName `
  -Location $location `
  -Name "NSG-Maria-DB" `
  -SecurityRules $sshrule

$SingleSubnet = New-AzVirtualNetworkSubnetConfig -Name $SubnetName `
-AddressPrefix $SubnetAddressPrefix `
-NetworkSecurityGroup $networkSecurityGroup

$Vnet = New-AzVirtualNetwork -Name $NetworkName `
-ResourceGroupName $ResourceGroupName `
-Location $location `
-AddressPrefix $VnetAddressPrefix `
-Subnet $SingleSubnet

$PIP = New-AzPublicIpAddress -Name $PublicIPAddressName `
-DomainNameLabel $DNSNameLabel `
-ResourceGroupName $ResourceGroupName `
-Location $location `
-Sku "Standard" `
-IdleTimeoutInMinutes 4 `
-AllocationMethod "Static"

$NIC = New-AzNetworkInterface -Name $NICName `
-ResourceGroupName $ResourceGroupName `
-Location $location `
-SubnetId $Vnet.Subnets[0].Id -PublicIpAddressId $PIP.Id

$Credential = New-Object System.Management.Automation.PSCredential ($VMLocalAdminUser, $VMLocalAdminSecurePassword);

$VirtualMachine = New-AzVMConfig -VMName $VMName -VMSize $VMSize

$VirtualMachine = Set-AzVMOperatingSystem -VM $VirtualMachine `
-Linux `
-ComputerName $ComputerName `
-Credential $Credential 

$VirtualMachine = Add-AzVMNetworkInterface `
-VM $VirtualMachine `
-Id $NIC.Id

$VirtualMachine = Set-AzVMSourceImage -VM $VirtualMachine `
-PublisherName 'Canonical' `
-Offer 'UbuntuServer' `
-Skus '18.04-LTS' `
-Version latest

New-AzVM -ResourceGroupName $ResourceGroupName `
-Location $location `
-VM $VirtualMachine `
-Verbose