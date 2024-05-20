import express, { Response, Request } from "express";
import { conn } from '../connection';

const app = express();

const requests = app.get('/request/user/:id', (req: Request, res: Response) => {
    const userid = req.params.id;
    
    if (isNaN(Number(userid))) {
        return res.status(400).json("Invalid user ID");
    }
   
    const sql =  `SELECT 
    t1.service_requestid,
  
    t1.date_request, 
    t1.description,
    t1.status,
    
    t1.newdate ,
    t2.provider_fname, 
    t2.provider_lname, 
    t2.city, 
    t2.provider_phone, 
    t2.address, 
    t3.servcie_name,
    t4.disblaystats
FROM 
    service_request t1 
JOIN 
    service_provider t2 ON t1.provider_id = t2.provider_id 
JOIN 
    service t3 ON t1.servcie_id = t3.servcie_id 
    JOIN status t4 on t1.status =t4.id_status
WHERE 
    t1.customer_id = ?
    AND t1.status IN (0, 3);`
    
    conn.query(sql, [userid], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json("Error with service");
        }
        if (result.length == 0) {
            return res.status(200).json("You don't have any requests");
        }
        res.json(result);
    });
});

export default requests;
