import express, { Request, Response } from 'express';
import { conn } from '../connection';
const app = express();

import bodyParser from 'body-parser';

// ...

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const verify_email = app.post('/signup/user/verify', async (req: Request, res: Response) => {
  const { email, verifycode } = req.body;

  if (!verifycode || !email) {
    return res.status(400).json({ error: "All data is required" });
  }

  const values = [email, verifycode];
  conn.query('SELECT email,verifycode FROM customer WHERE email = ? AND verifycode = ?', values, (error, results) => {
    if (error) {
      console.error(error);
    } else {
      console.log(results);
      if (results.length == 0) {
        res.status(400).json({ error: "code is false" });
      }
      else {
        conn.query("SELECT t1.appoi_id,  t1.date,t1.description,t2.customer_fname,t2.customer_lname,t2.city,t2.phone_num,t2.address,t3.servcie_name FROM appointment t1JOIN customer t2 ON t1.customer_id = t2.customer_id JOINservice t3 ON t1.servcie_id = t3.servcie_idWHERE t1.status = 1 AND t1.provider_id = 11UNION ALL SELECT t1.status,t1.date_request,t1.description,t2.customer_fname,t2.customer_lname,t2.city,t2.phone_num,t2.address,t3.servcie_name FROM service_request t1 JOINcustomer t2 ON t1.customer_id = t2.customer_id JOIN service t3 ON t1.servcie_id = t3.servcie_idWHERE t1.status = 4 AND t1.provider_id = 11; ", [email], (err, result) => {
        console.log("status = 1");
      });
} 
 
    }
  });
conn.query('SELECT email,verifycode FROM service_provider WHERE email = ? AND verifycode = ?', values, (error, results) => {
  if (error) {
    console.error(error);
  } else {
    console.log(results);
    if (results.length == 0) {
      res.status(400).json({ error: "code is false" });
    }
    else if (results.length > 0) {
      res.status(200).json({ message: "code is true" })
      conn.query('UPDATE service_provider SET status_verifycode = 1 WHERE email = ?', [email], (err, result) => {
        console.log("status = 1");
      });
    }

  }
});
  
});

export default verify_email;