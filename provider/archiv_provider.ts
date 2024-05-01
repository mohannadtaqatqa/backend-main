import express ,{Response,Request} from'express'
import { conn } from '../connection'

const app= express();

const get_arch_provider = app.get('/GETArchive/provider/:id',(req:Request,res:Response)=>{
    if (!req.params || !req.params.id) {
        return res.status(400).json({ error: 'User ID is missing in the URL' });
      }
    
      const providerId = req.params.id; 
      if (isNaN(Number(providerId))) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
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
    conn.query(arci_providr,[providerId,providerId],(err,result)=>{
        if(err){
            console.error(err)
            return res.status(500).json({ error: 'error in service' })

        }
        if(result.length==0){
            res.status(400).json({ message: "You don't have any appointments" })

        }
        res.json(result);
    })
})
export default get_arch_provider;