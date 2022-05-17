select 
A.order_id,
A.customer_id,
A.order_status,
A.order_date,
A.required_date,
A.shipped_date,
A.store_id,
A.staff_id,
B.item_id,
B.product_id,
B.quantity,
B.list_price,
B.discount,
C.first_name,
C.last_name,
C.phone,
C.email,
C.street,
C.[state],
C.zip_code,
D.store_name,
D.phone as store_phone,
D.email as store_email,
D.street as store_street,
D.[state] as store_state,
D.city as store_city,
D.zip_code as store_zip_code,
E.first_name as staff_first_name,
E.last_name as staff_last_name,
E.phone as staff_phone,
E.email as staff_email,
E.active as staff_active
FROM
sales.orders A
join 
sales.order_items B
on A.order_id = b.order_id
join
sales.customers C
on c.customer_id = A.customer_id
join sales.stores D
on A.store_id = D.store_id
join sales.staffs E
on A.staff_id = E.staff_id