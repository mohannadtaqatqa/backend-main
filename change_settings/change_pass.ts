// import express, { Request, Response } from 'express';
// import { conn } from '../connection';
// import bodyParser from 'body-parser';
// import bcrypt from 'bcrypt'

// const app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// const change_pass = app.post('/change_pass', async (req: Request, res: Response) => {
//   const { email, old_password, password } = req.body;
//   console.log(password + "   " + old_password)
//   const hash = await bcrypt.hash(password, 15);
//   if (!password || !old_password) {
//     return res.status(400).json({ error: "All data is required" });
//   }
//   const sql = 'SELECT email, pass FROM customer WHERE email = ?'; // Add pass column to the SELECT query
//   conn.query(sql, email, (error, results) => {
//     if (error) {
//       console.error('error SQL:', error);
//       return res.status(500).json({ error: "server error" }); // Handle server error
//     }

//     console.log(results);
//     if (results.length === 0) {
//       return res.status(400).json({ error: "User not found" }); // Handle user not found
//     }

//     const user = results[0]; // Extract user data
//     if (!bcrypt.compareSync(old_password, user.pass)) {
//       return res.status(400).json({ error: "Old password is wrong" });
//     }
//     if (bcrypt.compareSync(password, user.pass)) {
//       return res.status(400).json({ error: "New password is same as old password" });
//     }

//     conn.query('UPDATE customer SET pass = ? WHERE email = ?', [hash, email], (err, result) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ error: "Server error" });
//       }
//       res.status(200).json({ message: 'Update password successful' });
//     });
//   });
// });

// export default change_pass;

import express, { Request, Response } from 'express';
import { conn } from '../connection';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const change_pass = app.post('/change_pass', async (req: Request, res: Response) => {
  const { email, old_password, password, userType } = req.body;

  // التحقق من وجود كل البيانات المطلوبة
  if (!email || !old_password || !password || !userType) {
    return res.status(400).json({ error: "All data is required" });
  }

  // التحقق من كلمة المرور الجديدة
  if (old_password === password) {
    return res.status(400).json({ error: "New password cannot be the same as the old password" });
  }

  // التحقق من نوع المستخدم وتحديد الجدول المناسب
  let tableName: string;
  if (userType === '0') {
    tableName = 'customer';
  } else if (userType === '1') {
    tableName = 'provider';
  } else {
    return res.status(400).json({ error: "Invalid user type" });
  }

  // التحقق من البريد الإلكتروني
  const sql = `SELECT email, pass FROM ${tableName} WHERE email = ?`;
  conn.query(sql, [email], async (error, results) => {
    if (error) {
      console.error('SQL error:', error);
      return res.status(500).json({ error: "Server error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = results[0];
    
    // التحقق من كلمة المرور القديمة
    const isMatch = await bcrypt.compare(old_password, user.pass);
    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    // تشفير كلمة المرور الجديدة
    const hash = await bcrypt.hash(password, 15);

    // تحديث كلمة المرور في قاعدة البيانات
    const updateSql = `UPDATE ${tableName} SET pass = ? WHERE email = ?`;
    conn.query(updateSql, [hash, email], (err, result) => {
      if (err) {
        console.error('Update error:', err);
        return res.status(500).json({ error: "Server error" });
      }
      res.status(200).json({ message: 'Password updated successfully' });
    });
  });
});

export default change_pass;
