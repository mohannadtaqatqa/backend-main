// import express, { Response, Request } from "express";
// import { conn } from "../connection";
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// const app = express();

// import bodyParser from 'body-parser';
// app.use(bodyParser.json());
// const loginUser = async (email: string, password: string) => {
//     try {
//         const [customer]  = await new Promise<any[]>((resolve, reject) => {
//             conn.query(`SELECT * FROM customer WHERE email = ?`, [email],(err,results)=>{
//                 if (err) {
//                     console.log("ahahah4566778ahahahahah")
//                     reject(err);
//                     console.log('error1')
//                 } else {
//                     resolve(results);
//                 }
//             });
//         })
//         let match
       
//              match = await bcrypt.compare(password, customer.pass)
            
//             if (match) {
//                 console.log(match)
//                 return { user: customer, userType: 0 };
//             }
          

//         const [provider]  = await await new Promise<any[]>((resolve, reject) => {
//             conn.query(`SELECT * FROM service_provider WHERE email = ?`, [email],(err,results)=>{
//                 console.log(provider.pass)
//                 if (err) {
                 
//                 reject(err);
//             } else {
//                 resolve(results);
//             } 
//         });
//         })
       
//              match = await bcrypt.compare(password, provider.pass);

//             if (match) {
//                 return { user: provider[0], userType: 1 };
//             }
        

//         return null; 
//     } catch (error) {
//         console.error('Error:', error);
//         throw error;
//     }
// }
// const crypto = require('crypto');


// const secretKey = crypto.randomBytes(32).toString('hex');

   
//     const generateToken = (userData: any) => {
//         let userId;
//         let fname ;
//         let lname;
//         let additionalData = {};
//         if (userData.userType === 0) {
//             userId = userData.user.customer_id;
//             fname= userData.user.customer_fname;
//             lname = userData.user.customer_lname
//         } else if (userData.userType === 1) {
//             userId = userData.user.provider_id;
//             fname=userData.user.provider_fname,
//             lname=userData.user.provider_lname,


//             additionalData = {
//                 rating: userData.user.rating,
//                 count: userData.user.count_requset,
               
                
//             };
//         }
       
//             console.log(userId,fname)
//         const token = jwt.sign({ userId, email: userData.user.email,
//                  fname,lname,userType: userData.userType,...additionalData }, secretKey, { expiresIn: '500h' });
//         return token
       
//     }

// const loginall = app.post('/login', async (req: Request, res: Response) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ error: "Email and password are required" });
//     }

//     try {
//         const user = await loginUser(email, password);
        
//         if (!user) {
//             console.log('why>>>??')
//             return res.status(401).json({ error: "Invalid email or password" });
//         }

//         const token = generateToken(user);
//         console.log('heelow ')
//         return res.status(200).json({ message: "Login successful", token, userType: user.userType });
//     } catch (error) {
//         console.error('Error:', error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// });

// export default loginall;


// const loginUser = async (email: string, password: string) => {
//     try {
//         const [customer] = await new Promise<any[]>((resolve, reject) => {
//             conn.query(`SELECT * FROM customer WHERE email = ?`, [email], (err, results) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(results);
//                 }
//             });
//         });

//         const matchCustomer = await bcrypt.compare(password, customer.pass);
//         if (matchCustomer) {
//             return { user: customer, userType: 'customer' };
//         }

//         const [provider] = await new Promise<any[]>((resolve, reject) => {
//             conn.query(`SELECT * FROM service_provider WHERE email = ?`, [email], (err, results) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(results);
//                 }
//             });
//         });

//         if (provider && provider.length > 0) {
//             const matchProvider = await bcrypt.compare(password, provider.pass);
//             if (matchProvider) {
//                 return { user: provider[0], userType: 'service_provider' };
//             }
//         }

//         return null;
//     } catch (error) {
//         console.error('Error:', error);
//         throw error;
//     }
// }

// const loginall = app.post('/login', async (req: Request, res: Response) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ error: "Email and password are required" });
//     }

//     try {
//         const user = await loginUser(email, password);

//         if (!user) {
//             return res.status(401).json({ error: "Invalid email or password" });
//         }

//         let responseData: any = { message: "Login successful", userType: user.userType };

//         if (user.userType === 'service_provider') {
//             responseData = { ...responseData, registrationDate: user.user.registration_date }; // Assuming registration date is stored in the user object
//         } else if (user.userType === 'customer') {
//             responseData = { ...responseData, registrationDate: user.user.registration_date }; // Assuming registration date is stored in the user object
//         }
//         console.log(responseData)
//         return res.status(200).json(responseData);
       
//     } catch (error) {
//         console.error('Error:', error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// });

// export default loginall;
import express, { Response, Request } from "express";
import { conn } from "../connection";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();

import bodyParser from 'body-parser';
import calculateAndSetcout from "./coutn_request";
import calculateAndSetRatio from "./sumrating";
import cancelOldRequest from "./cancel_request";
app.use(bodyParser.json());

const loginUser = async (email: string, password: string) => {
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
        const saltRounds = 15;
        const matchCustomer = await bcrypt.compare(password, customer?.pass || '');
        if (matchCustomer) {
            
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
       
       if(password==provider?.pass){
        calculateAndSetRatio();
        calculateAndSetcout();
        cancelOldRequest;
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
    let status
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
            status = user.status
    
    }
    const crypto = require('crypto');


 const secretKey = crypto.randomBytes(32).toString('hex');

    const token = jwt.sign({ userId, email: user.email,address: address,city: city,phone: phone, fname, lname, userType,isvalid,rating,count: user.count_request,status: user.status }, secretKey, { expiresIn: '500h' });
    return token;
}

    const loginall = app.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

 
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        
        const user = await loginUser(email, password);
        
     
        if (!user) {
            console.log('Invalid email or password');
            return res.status(401).json({ error: "Invalid email or password" });
        }

    
        const token = generateToken(user);
        
      
        return res.status(200).json({ message: "Login successful", token, userType: user.userType });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default loginall;
