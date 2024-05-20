import express, { Request, Response } from 'express';
import { conn } from '../connection';
import bodyParser from 'body-parser';
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const verify_pass = app.post('/signup/user/verify_pass', async (req: Request, res: Response) => {
  const { email, verifycode } = req.body;
  if (!verifycode || !email) {
    return res.status(400).json({ error: "All data is required" });
  }
  const values = [email, verifycode];
  const sql = ('SELECT email,verifycode FROM customer WHERE email = ? AND verifycode = ?')
  conn.query(sql, values, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Server error' });
    } else {
      console.log(results);
      if (results.length == 0) {
        res.status(404).json({});
      }
      else if (results.length > 0) {
        res.status(200).json({ message: "code is true" });
      }
    }
  }
  );
});

export default verify_pass;