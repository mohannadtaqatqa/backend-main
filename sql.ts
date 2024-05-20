// const getservice=`SELECT * FROM service`;
// const create_acount_Provider=`INSERT INTO service_provider (provider_fname, provider_lname, provider_phone, city, address, pass, email,service_id) VALUES (?, ?, ?, ?, ?, ?, ?,?)`






const arci_customer =`SELECT 
t1.appoi_id,
t1.date,
t1.description,
t2.provider_fname,
t2.provider_lname, 
t2.city,
t2.city,
t2.address,
t3.servcie_name 
FROM 
appointment t1
JOIN 
service_provider t2 ON t1.provider_id = t2.provider_id
JOIN
service t3 ON t1.servcie_id = t3.servcie_id
WHERE 
t1.status = 1 AND t1.customer_id = 11
UNION ALL 
SELECT 

t1.status,
t1.date_request,
t1.description,
t2.provider_fname,
t2.provider_lname,
t2.city,
t2.phone_num,
t2.address,
t3.servcie_name
FROM 
service_request t1 
JOIN
service_provider t2 ON t1.provider_id = t2.provider_id
JOIN 
service t3 ON t1.servcie_id = t3.servcie_id
WHERE 
t1.status = 4 AND t1.customer_id = 11;`;

const arci_providr =`SELECT 
t1.appoi_id,
t1.date,
t1.description,
t2.customer_fname,
t2.customer_lname, 
t2.city,
t2.phone_num,
t2.address,
t3.servcie_name 
FROM 
appointment t1
JOIN 
customer t2 ON t1.customer_id = t2.customer_id 
JOIN
service t3 ON t1.servcie_id = t3.servcie_id
WHERE 
t1.status = 1 AND t1.provider_id = ? 
UNION ALL 
SELECT 

t1.status,
t1.date_request,
t1.description,
t2.customer_fname,
t2.customer_lname,
t2.city,
t2.phone_num,
t2.address,
t3.servcie_name
FROM 
service_request t1 
JOIN
customer t2 ON t1.customer_id = t2.customer_id 
JOIN 
service t3 ON t1.servcie_id = t3.servcie_id
WHERE 
t1.status = 4 AND t1.provider_id = ?;`
