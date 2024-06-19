import express, { Response, Request } from "express";
import { conn } from "../connection";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();

import bodyParser from 'body-parser';
import calculateAndSetcout from "./coutn_request";
import calculateAndSetRatio from "./sumrating";
app.use(bodyParser.json());

const loginUser = async (email: string) => {
    try {
        const [customer] = await new Promise<any[]>((resolve, reject) => {
            conn.query(`SELECT * FROM customer WHERE email = ?`, [email], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
        // const saltRounds = 15;
        // const matchCustomer = await bcrypt.compare(password, customer?.pass || '');
        if (customer) {
            
            return { user: customer, userType: 0 };
        }
        

        const [provider] = await new Promise<any[]>((resolve, reject) => {
            conn.query(`SELECT * FROM service_provider WHERE email = ?`, [email], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
       
       if(true){
        calculateAndSetRatio();
        calculateAndSetcout();
        return { user: provider, userType: 1 };

       }
        // console.log( await bcrypt.hash(password,20))
        // console.log(password)
        // console.log(provider.pass)
        // console.log(matchProvider)
        // if (matchProvider) {
        //     return { user: provider[0], userType: 1 };
        // }

        return null;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


const generateToken = (userData: any) => {
  console.log(userData)
    const { user, userType } = userData;
    let userId;
    let fname;
    let lname;
    let address;
    let city;
    let phone;
    let isvalid;
    let rating;
    let count;
    // let additionalData = {};

    if (userType === 0) {
        userId = user.customer_id;
        fname = user.customer_fname;
        lname = user.customer_lname;
        address = user.address;
        city = user.city;
        phone = user.phone_num;
        isvalid=user.status_verifycode
    } else if (userType === 1) {
        userId = user.provider_id;
        fname = user.provider_fname;
        lname = user.provider_lname;
        address = user.address;
        city = user.city;
        phone = user.provider_phone;
        isvalid=user.status_verifycode,

        // additionalData = {
            rating= user.rating,
            count= user.count_requset
    
    }
    const crypto = require('crypto');


 const secretKey = crypto.randomBytes(32).toString('hex');

    const token = jwt.sign({ userId, email: user.email,address: address,city: city,phone: phone, fname, lname, userType,isvalid,rating,count: user.count_request  }, secretKey, { expiresIn: '500h' });
    return token;
}

    const logingoogle = app.post('/logingoogle', async (req: Request, res: Response) => {
    const { email } = req.body;
console.log(email)
 
    if (!email) {
      // ==>
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        
        const user = await loginUser(email);
        
     
        if (!user) {
            console.log('Invalid email');
            return res.status(401).json({ error: "Invalid email" });
        }

    
        const token = generateToken(user);
        
      
        return res.status(200).json({ message: "Login successful", token, userType: user.userType });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default logingoogle;
