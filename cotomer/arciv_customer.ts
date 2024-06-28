import express ,{Response,Request} from'express'
import { conn } from '../connection'

const app= express();

const get_arch_customer = app.get('/GETArchive/customer/:id',(req:Request,res:Response)=>{
    if (!req.params || !req.params.id) {
        return res.status(400).json({ error: 'User ID is missing in the URL' });
      }
    
      const providerId = req.params.id; 
      if (isNaN(Number(providerId))) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
const arci_cutsomer = `
SELECT t1.date,
       t1.description,
       t1.request_id,
       t2.provider_fname,
       t2.provider_lname,
       t2.city,
       t2.provider_phone,
       t2.address,
       t3.servcie_name 
FROM appointment t1 
JOIN service_provider t2 ON t1.provider_id = t2.provider_id 
JOIN service t3 ON t1.servcie_id = t3.servcie_id 
WHERE t1.status = 4 
  AND t1.customer_id = ?
  
UNION ALL

SELECT t5.date_request AS date,
       t5.description,
       t5.service_requestid,
       t2.provider_fname,
       t2.provider_lname,
       t2.city,
       t2.provider_phone,
       t2.address,
       t3.servcie_name 
FROM service_request t5 
JOIN service_provider t2 ON t5.provider_id = t2.provider_id 
JOIN service t3 ON t5.servcie_id = t3.servcie_id 
WHERE t5.status = 4 
  AND t5.customer_id = ?;

`
// `
// SELECT 
//       t1.appoi_id,
//       t1.date,
//       t1.description,
//       t1.request_id,
//       t2.provider_fname,
//       t2.provider_lname, 
//       t2.city,
//       t2.provider_phone,
//       t2.address,
//       t3.servcie_name 
// FROM 
//       appointment t1
// JOIN 
//       service_provider t2 ON t1.provider_id = t2.provider_id
// JOIN
//       service t3 ON t1.servcie_id = t3.servcie_id
// WHERE 
//       t1.status = 4 AND t1.customer_id = ?
// UNION ALL
// SELECT
//       NULL AS appoi_id,
//       t1.date_request AS date,
//       t1.description,
//       NULL AS request_id,
//       t2.provider_fname,
//       t2.provider_lname,
//       t2.city,
//       t2.provider_phone,
//       t2.address,
//       t3.servcie_name
// FROM 
//       service_request t1 
// JOIN
//       service_provider t2 ON t1.provider_id = t2.provider_id
// JOIN 
//       service t3 ON t1.servcie_id = t3.servcie_id
// WHERE 
//       t1.status = 4 AND t1.customer_id = ?;`

    conn.query(arci_cutsomer,[providerId,providerId],(err,result)=>{
        if(err){
            console.error(err)
            return res.status(500).json({ error: 'error in service' })

        }
        if(result.length==0){
          return  res.status(400).json({ message: "You don't have any appointments" })

        }
      return  res.json(result);
    })
})
export default get_arch_customer;