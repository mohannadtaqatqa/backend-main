

import express, { Request, Response } from 'express';
import { conn } from '../connection';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt'

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const ResetPass = app.post('/signup/user/resetpass', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const hash =await bcrypt.hash(password, 15);
  if (!password) {
    return res.status(400).json({ error: "All data is required" });
  }
  const sql = ('SELECT email FROM customer WHERE email = ?')
  conn.query(sql, email, (error, results) => {
    if (error) {
      console.error('error SQL:', error);

    } else {

      console.log(results);
      if (results.length == 0) {
        // res.status(400).json({ error: "code is false" });
        // console.log('email db:', results[0].email);
      }
      else if (results.length > 0){
        conn.query('UPDATE customer SET pass = ? WHERE email = ?', [hash,email], (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "server error" });
          }
          res.status(200).json({ message: 'update password successful' });
        });
      }
    }
  });
});

export default ResetPass;