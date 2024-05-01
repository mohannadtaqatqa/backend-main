import express, { Response, Request } from "express";
import { conn } from "../connection";
const app =express();

import bodyParser from 'body-parser';
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// async function verifyCodeAndUpdateTable(tableName:string,email:string,verifycode:string):Promise<boolean> {
//     try {
//         const [rows]: any = await conn.query(`SELECT email, verifycode FROM ${tableName} WHERE email = ? AND verifycode = ?`, [email, verifycode]);

//         if (!rows || rows.length === 0) {
//           return false; // Code is false
//         } else {
//           await conn.query(`UPDATE ${tableName} SET status_verifycode = 1 WHERE email = ?`, [email]);
//           return true; 
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         throw error; 
//     }
//     }
//     const verifucode_api = app.post('/signup/verify/email', async (req: Request, res: Response) => {
//         const { email, verifycode } = req.body;
      
//         if (!verifycode || !email) {
//           return res.status(400).json({ error: "All data is required" });
//         }
      
//         try {
//           const isCustomerVerified = await verifyCodeAndUpdateTable('customer', email, verifycode);
//           const isServiceProviderVerified = await verifyCodeAndUpdateTable('service_provider', email, verifycode);
//           if (isCustomerVerified || isServiceProviderVerified) {
//             return res.status(200).json({ message: "Code is true" });
//           } else {
//             return res.status(400).json({ error: "Code is false" });
//           }
//         } catch (error) {
//           return res.status(500).json({ error: "Internal server error" });
//         }
//       });
//       //this code for login but need some edit
//         //   if (isCustomerVerified) {
           
//         //     return res.status(200).json({ message: "Code is true", userType: "customer" });
//         //   } else if (isServiceProviderVerified) {
           
//         //     return res.status(200).json({ message: "Code is true", userType: "service_provider" });
//         //   } else {
//         //     return res.status(400).json({ error: "Code is false" });
//         //   }
//         // } catch (error) {
//         //   return res.status(500).json({ error: "Internal server error" });
//         // }
     
    
// export default verifucode_api;

const verifyCodeAndUpdateTable = async (tableName: string, email: string, verifycode: string) => {
    try {
        const sql = `SELECT email, verifycode FROM ${tableName} WHERE email = ? AND verifycode = ?`;
        const rows = await new Promise<any[]>((resolve, reject) => {
            conn.query(sql, [email, verifycode], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        if (rows && rows.length > 0) {
          await conn.query(`UPDATE ${tableName} SET status_verifycode = 1 WHERE email = ?`, [email]);
            return true;
            
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


  
  const verify_otp= app.post('/signup/verify/email', async (req: Request, res: Response) => {
    const { email, verifycode } = req.body;
  
    if (!verifycode || !email) {
      return res.status(400).json({ error: "All data is required" });
    }
  
    try {
      const isCustomerVerified = await verifyCodeAndUpdateTable('customer', email, verifycode);
      const isServiceProviderVerified = await verifyCodeAndUpdateTable('service_provider', email, verifycode);
  
      // if (isCustomerVerified ) {
      //   return res.status(200).json({ message: "Code is true", userType: "customer" });
      // } else if (isServiceProviderVerified ) {
      //   return res.status(200).json({ message: "Code is true", userType: "service_provider" });
      // } else {
      //   return res.status(401).json({ error: "Invalid verification code" }); 
      // }
      if (isCustomerVerified||isServiceProviderVerified){
        return res.status(200).json({message:'code true'})
      }
      else {
        return res.status(400).json({message:"Invalid verification code"})
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  
  export default verify_otp;
  
