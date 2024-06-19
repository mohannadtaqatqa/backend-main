import express, { Request, Response } from 'express';
import { conn } from '../connection';
import sendEmail from '../func/sendemail';
const app = express();

import bodyParser from 'body-parser';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const check_email = app.post('/change_email', async (req: Request, res: Response) => {
  const { email , new_email } = req.body;

  console.log( conn.query('SELECT email FROM customer WHERE email = ?'))
  conn.query('SELECT email FROM customer WHERE email = ?', email, (error, results) => {
    if (error) {
      console.error('error SQL:', error);}
      else {
      console.log(results);
      if (results.length == 0) { 
        res.status(404).json({ error: "email is not found" });
      }
      else if (results.length > 0){
        conn.query('UPDATE customer SET email = ? WHERE email = ?', [new_email, email], (err) => {
         if (err) {
            console.error(err);
            return res.status(500).json({ error: "server error" });
          }
          else{ 
          res.status(200).json({ message: 'update password successful' });
        }});
      }
    }
  });
});