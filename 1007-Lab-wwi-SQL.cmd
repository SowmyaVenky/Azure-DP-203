@rem ######################################################################
@rem ##                PART 7: Lab for the wwi schema part of DP-203 tutorial #
@rem ######################################################################

@rem ##### Install the sqlcmd utility to get access to synapse from the local computer.
sqlcmd -S "venkysynapseworkspace101.sql.azuresynapse.net" -U venkyuser -P Ganesh20022002 -d venkysqlpool -I -i synapse-tutorial\02\01-create-tables.sql
sqlcmd -S "venkysynapseworkspace101.sql.azuresynapse.net" -U venkyuser -P Ganesh20022002 -d venkysqlpool -I -i synapse-tutorial\02\02-create-wwi-tables-and-data.sql
sqlcmd -S "venkysynapseworkspace101.sql.azuresynapse.net" -U venkyuser -P Ganesh20022002 -d venkysqlpool -I -i synapse-tutorial\02\03-show-table-stats.sql