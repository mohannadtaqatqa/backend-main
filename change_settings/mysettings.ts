import express, { Request, Response } from 'express';
import { conn } from '../connection'; // Assuming 'connection' provides database connection

const app = express();
const updateinfo = async (userid:String,fname:string,lname:string,city:string ,phone: string,address:string,userType:string)=>{
    if (userType==="0"){
        const sql = `UPDATE customer
        SET customer.customer_fname = ?,
        customer.customer_lname=?,
        customer.city=?,
        customer.address = ?,
        customer.phone_num = ?
        WHERE customer.customer_id = ?
        `
        await conn.query(sql,[fname,lname,city,address,phone ],(err,result)=>{
            if(err){
                console.error(err);
          
            }
        });
    }
    else{
        const sqlprov = `UPDATE service_provider
        SET service_provider.provider_fname = ?,
        service_provider.provider_lname=?,
        service_provider.city=?,
       service_provider.address  = ?,
        service_provider.provider_phone = ?
        WHERE service_provider.provider_id = ?
        `
        await conn.query(sqlprov,[fname,lname,city,address,phone ])
    }

};

const update_info = app.post('/updateinfo',(res:Response,req:Request)=>{
    const {userID,fname,lname,city,phone,address,userType }=req.body;
    if (!fname || !lname || !phone || !city || !address || !userType || !userID) {
              return res.status(400).json({ error: "All data is required" });
          }
    console.log(req.body)
   updateinfo(userID,fname,lname,city,phone,address,userType);
    
   return res.status(200).json({message:'تم التحديث بنجاح '})
        

})
export default update_info;