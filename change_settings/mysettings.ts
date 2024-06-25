import express, { Request, Response } from 'express';
import { conn } from '../connection'; 
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const updateinfo = async (userid: string, fname: string, lname: string, city: string, address: string, userType: string, phone: string) => {
 
    if (userType === "0") {
        
        const sql = `UPDATE customer
                     SET customer.customer_fname = ?,
                         customer.customer_lname = ?,
                         customer.city = ?,
                         customer.address = ?,
                         customer.phone_num = ${phone}
                     WHERE customer.customer_id = ?`;
        await conn.query(sql, [fname, lname, city, address, userid], (err, result) => {
            if (err) {
                console.error(err);
            }
        });
    } else {
        const sqlprov = `UPDATE service_provider
                         SET service_provider.provider_fname = ?,
                             service_provider.provider_lname = ?,
                             service_provider.city = ?,
                             service_provider.address = ?,
                             service_provider.provider_phone = ${phone}
                         WHERE service_provider.provider_id = ?`;
        await conn.query(sqlprov, [fname, lname, city, address, userid]);
    }
};

const update_info = app.post('/updateinfo', async (req: Request, res: Response) => {
    const { userID, fname, lname, city, address,phone, usertype } = req.body || {};
    console.log(req.body);
   
    await updateinfo(userID, fname, lname, city, address,phone, usertype);
    return res.status(200).json({ message: 'تم التحديث بنجاح' }).end();
});

export default update_info;