// import express, { Response, Request } from "express";
// import { conn } from "../connection";
// import bcrypt from 'bcrypt'
// import bodyParser = require("body-parser");

// const app = express()
// app.use(bodyParser.json()) 
// app.use(bodyParser.urlencoded({ extended: true }))
// const apisignup_P = app.post('/signup/provider', async (req: Request, res: Response) => {
//     const { fname, lastname, phone, city, address, pass, email,serviceid } = req.body;
//     console.log(req.body);
//     // if(!fname|| !lastname|| !phone|| !city|| !address|| !pass|| !email||!serviceid){
//     //     res.status(500).json({error:"all data is requesrd"})
//     // }
//     // if(!email.includes("@")){
//     //     res.status(400).json('the emil should be containt @')
//     // }
//     if(!fname|| !lastname|| !phone|| !city|| !address|| !pass|| !email||!serviceid){
//         return res.status(500).json({error:"all data is requesrd"})
//     }
//     if(!email.includes("@")){
//         return res.status(400).json('the emil should be containt @')
//     }
    
//     try {
        
//         conn.query('SELECT * FROM service_provider WHERE email = ?', [email], (err, result) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).send({ error: 'server error' });
//             }
//             if (result.length > 0) {
//                 return res.status(400).json({ error: 'email already exists' });
//             }

            
//             conn.query('SELECT * FROM service_provider WHERE provider_phone = ?', [phone], async (err, result) => {
//                 if (err) {
//                     console.error(err);
//                     return res.status(500).send({ error: 'server error' });
//                 }
//                 if (result.length > 0) {
//                     return res.status(400).json({ error: 'phone already exists' });
//                 }

                
//                 const saltRounds = 15;
//     if (pass.length < 6) {
//       return res.status(400).json({ error: 'The password should be greater than 6 characters' });
//     }
//     const hash = await bcrypt.hash(pass,saltRounds);
//                   const sql_create=`INSERT INTO service_provider (provider_fname, provider_lname, provider_phone, city, address, pass, email,service_id) VALUES (?, ?, ?, ?, ?, ?, ?,?)`  
//                     conn.query(sql_create, [fname, lastname, phone, city, address, hash, email,serviceid], (err, results) => {
//                         if (err) {
//                             console.error(err);
//                             return res.status(500).json({ error: "server error" });
//                         }
//                         res.status(201).json({ message: "signup successful" });
//                     });
//                 });
            
//         });
//     } catch (err) {
//         console.error('error:', err)
//         res.status(500).json({ error: 'server error' });
//     }
// });

// export default apisignup_P;

