import express,{ Request, Response } from 'express';
import {conn} from '../connection';
const app =express();

const provider_api =app.get('/serviceprovider/details/:id',(req:Request,res:Response)=>{
    const serviceid =req.params.id;
  
    conn.query('SELECT service_provider.provider_id,.service_provider.provider_fname,service_provider.provider_lname,service_provider.provider_phone,service_provider.city,service_provider.address,service.servcie_name,service_provider.status, service_provider.service_id  FROM service_provider INNER JOIN service ON service_provider.service_id = service.servcie_id WHERE service_provider.service_id=? AND service_provider.status=1 ' ,[serviceid],(err,result)=>{
        if(err){
            console.error(err);
            res.status(500).json({ error: 'Error fetching provider ' })
        }
        if (result.length == 0) {
            res.status(404).send('worker not found');
            return;
        }
        res.json(result);
    })
  })
  export default provider_api