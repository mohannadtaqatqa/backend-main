import express from 'express';
import provider_api from './cotomer/provider';
import apisignup from './cotomer/signupApi'
 import service_api from './service';
 import booking_Api from './cotomer/booking';
 import requests from './cotomer/requset';
import approval from './provider/approved_api';
import get_apoointent from './cotomer/appoinget';
import raiting_api from './cotomer/ratingprovider';
import getappointment from './provider/getappointment';
import GetRquest_provider from './provider/Get_request_provider';

import new_date from './provider/SugestedNewDate';
import verify_otp from './func/OTP';
import loginall from './func/login_func';
import get_arch_provider from './provider/archiv_provider';
import signupProvider from './provider/signup_provider';
import { rejects } from 'assert';
import reject from './provider/reject_api';
import getNotification from './func/notifications';
import verify_pass from './forget_pass/verifyed_code_pass';
import ResetPass from './forget_pass/reset_password';
import verify_email from './forget_pass/verified_code_email';
import check_email from './forget_pass/check_email';
import get_arch_customer from './cotomer/arciv_customer';
import change_pass from './change_settings/change_pass';
import update_info from './change_settings/mysettings'
import getAppointmentsForToday from './cotomer/appintment_tody';
import get_rating from './provider/get_reviwe';
import logingoogle from './func/login_google';
import active_status from './provider/active_status_1';
import status_0 from './provider/active_staus'

// import Service from './moduls/serive';

const app = express();
app.use(service_api);
app.use(provider_api)
app.use(apisignup);
 app.use(booking_Api);
 app.use(requests);
 app.use(approval)
 app.use(reject)
 app.use(get_apoointent)
 app.use(raiting_api)
 app.use(getappointment)
 app.use(GetRquest_provider)
app.use(new_date)
app.use(verify_otp)
app.use(change_pass)
 app.use(loginall)
 app.use(get_arch_provider)
 app.use(signupProvider)
 app.use(loginall)
 app.use(getNotification)
 app.use(verify_pass)
 app.use(ResetPass)
 app.use(verify_email)
 app.use(check_email)
 app.use(get_arch_customer)
 app.use(update_info)
 app.use(getAppointmentsForToday)
 app.use(get_rating)
 app.use(logingoogle)
 app.use(active_status)
 app.use(status_0);
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
