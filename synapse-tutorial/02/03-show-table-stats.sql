SELECT
    r.command,
    s.request_id,
    r.status,
    count(distinct input_name) as nbr_files,
    sum(s.bytes_processed)/1024/1024/1024 as gb_processed
FROM
    sys.dm_pdw_exec_requests r
    INNER JOIN sys.dm_pdw_dms_external_work s
    ON r.request_id = s.request_id
WHERE
    r.[label] = 'CTAS : Load [wwi].[dimension_City]' OR
    r.[label] = 'CTAS : Load [wwi].[dimension_Customer]' OR
    r.[label] = 'CTAS : Load [wwi].[dimension_Employee]' OR
    r.[label] = 'CTAS : Load [wwi].[dimension_PaymentMethod]' OR
    r.[label] = 'CTAS : Load [wwi].[dimension_StockItem]' OR
    r.[label] = 'CTAS : Load [wwi].[dimension_Supplier]' OR
    r.[label] = 'CTAS : Load [wwi].[dimension_TransactionType]' OR
    r.[label] = 'CTAS : Load [wwi].[fact_Movement]' OR
    r.[label] = 'CTAS : Load [wwi].[fact_Order]' OR
    r.[label] = 'CTAS : Load [wwi].[fact_Purchase]' OR
    r.[label] = 'CTAS : Load [wwi].[fact_StockHolding]' OR
    r.[label] = 'CTAS : Load [wwi].[fact_Transaction]'
GROUP BY
    r.command,
    s.request_id,
    r.status
ORDER BY
    nbr_files desc,
    gb_processed desc;
    