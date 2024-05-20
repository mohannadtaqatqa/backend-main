// import express, { Response, Request } from "express";
// import { conn } from "./connection";
// import bcrypt from 'bcrypt'
// import bodyParser = require("body-parser");
// import jwt from 'jsonwebtoken'

// const app = express();

// // Parse JSON bodies
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// const generateSecretKey = () => {
//     return crypto.randomBytes(32).toString('hex'); // 32 bytes (256 bits) converted to hexadecimal string
//   };
  
//   // Example usage
//   const secretKey = generateSecretKey();
//   console.log('Generated secret key:', secretKey);


// const login_api = app.post('/login/jwt', async (req: Request, res: Response) => {
//     const { email, password } = req.body;

//     try {
//         conn.query('SELECT * FROM customer WHERE email = ?', [email], async (err, result) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).json({ error: "service error?!!!" });
//             }
//             if (result.length === 0) {
//                 return res.status(401).json("email or password wrong ");
//             }
//             const user = result[0];
//             const match = await bcrypt.compare(password, user.pass);
//             if (!match) {
//                 return res.status(401).json("email or password wrong");
//             }

//             // Generate JWT token
//             const token = jwt.sign({ userId: user.customer_id, email: user.email }, secretKey);

//             res.status(200).json({ 
//                 message: 'Login successful', 
//                 token: token, 
//                 user: { email: user.email,FnameId:user.customer_fname }
//             });
//         });
//     } catch (err) {
//         console.error('error:', err);
//         res.status(500).json({ error: 'server error' });
//     }
// });

// export default login_api;
// import express, { Response, Request } from "express";
// import { conn } from "./connection";
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import bodyParser from 'body-parser';

// const app = express();

// // Parse JSON bodies
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// const secretKey = 'd64061567b7ba1b414fc2b44959d5cfc6b54c0b1bd0f26b9de2d4d1f41eedb3e'; // Replace with your actual secret key

// const login_api = app.post('/login', async (req: Request, res: Response) => {
//     const { email, password } = req.body;
//     console.log(req.body);

//     if (!email || !password) {
//         return res.status(400).json({ error: 'Email and password are required' });
//     }

//     try {
//         conn.query('SELECT * FROM customer WHERE email = ?', [email], async (err, result) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).json({ error: "service error" });
//             }

//             if (result.length === 0) {
//                 return res.status(401).json({ error: "Email or password is incorrect" });
//             }

//             const user = result[0];
//             const match = await bcrypt.compare(password, user.pass);
//             if (!match) {
//                 return res.status(401).json({ error: "Email or password is incorrect" });
//             }

//             // Generate JWT token with user data
//             const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });

//             res.status(200).json({ message: 'Login successful', token });
//         });
//     } catch (err) {
//         console.error('Error:', err);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// export default login_api;
