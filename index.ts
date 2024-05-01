import express from 'express';
import provider_api from './cotomer/provider';
import apisignup from './cotomer/signupApi'
 import login_api from './cotomer/login_api';
 import service_api from './service';
 import booking_Api from './cotomer/booking';
 import requests from './cotomer/requset';
import approval from './provider/approved_api';
import get_apoointent from './cotomer/appoinget';
import raiting_api from './cotomer/ratingprovider';
import getappointment from './provider/getappointment';
import GetRquest_provider from './provider/Get_request_provider';
import { verify } from 'crypto';
import verifyapi from './cotomer/verfyotp';
import new_date from './provider/SugestedNewDate';
import apisignup_P from './provider/signuppro';
import login_provider from './provider/login_povider';
import verify_otp from './func/OTP';
import login from './func/login_func'
import loginall from './func/login_func';
import get_arch_provider from './provider/archiv_provider';
import check_email from './forget password/check_email';
import ResetPass from './forget password/reset_password';
import apiCode from './forget password/verified_code_email';
import verifypass from './forget password/verifyed_code_pass';
import getNotification from './notification';
import reject from './provider/reject_api';


// import Service from './moduls/serive';

const app = express();
app.use(service_api);
app.use(provider_api)
app.use(apisignup);
  // app.use(login_api);
 app.use(booking_Api);
 app.use(reject)
 app.use(requests);
 app.use(approval)
 app.use(get_apoointent)
 app.use(raiting_api)
 app.use(getappointment)
 app.use(GetRquest_provider)
//  app.use(verifyapi)
app.use(new_date)
app.use(apisignup_P)
// app.use(login_provider)
app.use(verify_otp)
 app.use(loginall)
 app.use(get_arch_provider)
 app.use(check_email)
 app.use(ResetPass)
 app.use(apiCode)
 app.use(verifypass)
 app.use(getNotification)
const port = process.env.port||5000;
app.listen(port, () => {
  console.log(`Server is running on port `);
});


// app.get('/serviceprovider/:id',(req:Request,res:Response)=>{
//   const serviceid =req.params.id;
 
//   conn.query('SELECT provider_fname,provider_lname, provider_phone FROM service_provider WHERE service_provider.service_id=? ' ,[serviceid],(err,result)=>{
//       if(err){
//           console.error(err);
//           res.status(500).json({ error: 'Error fetching provider' })
//       }
//       if (result.length == 0) {
//           res.status(404).send('worker not found');
//           return;
//       }
//       res.json(result);
//   })
// })
