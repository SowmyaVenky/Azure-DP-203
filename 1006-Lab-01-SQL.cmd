@rem ######################################################################
@rem ##                PART 6: Lab 01 #
@rem ## This creates a set of star schema tables and adds date inside the dedicated pool endpoint.
@rem ######################################################################

@rem ##### Install the sqlcmd utility to get access to synapse from the local computer.
sqlcmd -S "venkysynapseworkspace101.sql.azuresynapse.net" -U venkyuser -P Ganesh20022002 -d venkysqlpool -I -i synapse-tutorial\01\setup.sql

@rem # Load data
bcp dbo.DimCurrency in synapse-tutorial\01\data\DimCurrency.txt -S "venkysynapseworkspace101.sql.azuresynapse.net" -U venkyuser -P Ganesh20022002 -d venkysqlpool -f synapse-tutorial\01\data\DimCurrency.fmt -q -k -E -b 5000
bcp dbo.DimCustomer in synapse-tutorial\01\data\DimCustomer.txt -S "venkysynapseworkspace101.sql.azuresynapse.net" -U venkyuser -P Ganesh20022002 -d venkysqlpool -f synapse-tutorial\01\data\DimCustomer.fmt -q -k -E -b 5000
bcp dbo.DimDate in synapse-tutorial\01\data\DimDate.txt -S "venkysynapseworkspace101.sql.azuresynapse.net" -U venkyuser -P Ganesh20022002 -d venkysqlpool -f synapse-tutorial\01\data\DimDate.fmt -q -k -E -b 5000
bcp dbo.DimGeography in synapse-tutorial\01\data\DimGeography.txt -S "venkysynapseworkspace101.sql.azuresynapse.net" -U venkyuser -P Ganesh20022002 -d venkysqlpool -f synapse-tutorial\01\data\DimGeography.fmt -q -k -E -b 5000
bcp dbo.DimProduct in synapse-tutorial\01\data\DimProduct.txt -S "venkysynapseworkspace101.sql.azuresynapse.net" -U venkyuser -P Ganesh20022002 -d venkysqlpool -f synapse-tutorial\01\data\DimProduct.fmt -q -k -E -b 5000
bcp dbo.DimProductCategory in synapse-tutorial\01\data\DimProductCategory.txt -S "venkysynapseworkspace101.sql.azuresynapse.net" -U venkyuser -P Ganesh20022002 -d venkysqlpool -f synapse-tutorial\01\data\DimProductCategory.fmt -q -k -E -b 5000
bcp dbo.DimProductSubCategory in synapse-tutorial\01\data\DimProductSubCategory.txt -S "venkysynapseworkspace101.sql.azuresynapse.net" -U venkyuser -P Ganesh20022002 -d venkysqlpool -f synapse-tutorial\01\data\DimProductSubCategory.fmt -q -k -E -b 5000
bcp dbo.DimPromotion in synapse-tutorial\01\data\DimPromotion.txt -S "venkysynapseworkspace101.sql.azuresynapse.net" -U venkyuser -P Ganesh20022002 -d venkysqlpool -f synapse-tutorial\01\data\DimPromotion.fmt -q -k -E -b 5000
bcp dbo.DimSalesTerritory in synapse-tutorial\01\data\DimSalesTerritory.txt -S "venkysynapseworkspace101.sql.azuresynapse.net" -U venkyuser -P Ganesh20022002 -d venkysqlpool -f synapse-tutorial\01\data\DimSalesTerritory.fmt -q -k -E -b 5000
bcp dbo.FactInternetSales in synapse-tutorial\01\data\FactInternetSales.txt -S "venkysynapseworkspace101.sql.azuresynapse.net" -U venkyuser -P Ganesh20022002 -d venkysqlpool -f synapse-tutorial\01\data\FactInternetSales.fmt -q -k -E -b 5000
bcp dbo.FactResellerSales in synapse-tutorial\01\data\FactResellerSales.txt -S "venkysynapseworkspace101.sql.azuresynapse.net" -U venkyuser -P Ganesh20022002 -d venkysqlpool -f synapse-tutorial\01\data\FactResellerSales.fmt -q -k -E -b 5000

