import express, { Response, Request } from "express";
import { conn } from "../connection";
import bcrypt from 'bcrypt';
import bodyParser from "body-parser";
import sendEmail from "../func/sendemail";

const app = express();
const verifycode = Math.floor(1000 + Math.random() * 9000);
console.log(verifycode);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const signupProvider = app.post('/signup/provider', async (req: Request, res: Response) => {
    const { fname, lastname, phone, city, address, pass, email, serviceid } = req.body;
    if (!fname || !lastname || !phone || !city || !address || !pass || !email) {
        return res.status(400).json({ error: "All data is required" });
    }
    if (!email.includes("@")) {
        return res.status(400).json({ error: 'The email should contain @' });
    }
    if (address == null) {
        return res.status(404).json({ error: 'Address is empty' });
    }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ error: 'Phone number must be 10 digits' });
    }
    try {
        const emailExists = await new Promise((resolve, reject) => {
            conn.query('SELECT * FROM service_provider WHERE email = ?', [email], (err, result) => {
                if (err) {
                    console.error(err);
                    reject('server error');
                } else if (result.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
        if (emailExists) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const phoneExists = await new Promise((resolve, reject) => {
            conn.query('SELECT * FROM service_provider WHERE provider_phone = ?', [phone], (err, result) => {
                if (err) {
                    console.error(err);
                    reject('server error');
                } else if (result.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
        if (phoneExists) {
            return res.status(400).json({ error: 'Phone number already exists' });
        }

        
        if (pass.length < 6) {
            return res.status(400).json({ error: 'The password should be greater than 6 characters' });
        }
        //const hashpass = await bcrypt.hash(pass,15);

        const sql = 'INSERT INTO service_provider (provider_fname, provider_lname, provider_phone, city, address, pass, email, service_id, verifycode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        conn.query(sql, [fname, lastname, phone, city, address, pass, email, serviceid, verifycode], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Server error' });
            }
            sendEmail(email, 'Verifying your email', 'This is a code ' + verifycode + ' to verify your email')
                .then(() => console.log('Email sent successfully'))
                .catch((error) => console.error('Error sending email:', error));
            res.status(201).json({ message: "Signup successful" });
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default signupProvider;
