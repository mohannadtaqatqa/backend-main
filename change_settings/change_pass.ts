import express, { Request, Response } from 'express';
import { conn } from '../connection';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt'

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const change_pass = app.post('/change_pass', async (req: Request, res: Response) => {
  const { email, old_password, password } = req.body;
  console.log(password + "   " + old_password)
  const hash = await bcrypt.hash(password, 15);
  if (!password || !old_password) {
    return res.status(400).json({ error: "All data is required" });
  }
  const sql = 'SELECT email, pass FROM customer WHERE email = ?'; // Add pass column to the SELECT query
  conn.query(sql, email, (error, results) => {
    if (error) {
      console.error('error SQL:', error);
      return res.status(500).json({ error: "server error" }); // Handle server error
    }

    console.log(results);
    if (results.length === 0) {
      return res.status(400).json({ error: "User not found" }); // Handle user not found
    }

    const user = results[0]; // Extract user data
    if (!bcrypt.compareSync(old_password, user.pass)) {
      return res.status(400).json({ error: "Old password is wrong" });
    }
    if (bcrypt.compareSync(password, user.pass)) {
      return res.status(400).json({ error: "New password is same as old password" });
    }

    conn.query('UPDATE customer SET pass = ? WHERE email = ?', [hash, email], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
      }
      res.status(200).json({ message: 'Update password successful' });
    });
  });
});

export default change_pass;
