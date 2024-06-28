import express, { Request, Response } from 'express';
import { conn } from '../connection';
import sendEmail from '../func/sendemail';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var verifycode = Math.floor(1000 + Math.random() * 9000);

const check_email = app.post('/check_email', async (req: Request, res: Response) => {
  const { email } = req.body;

  conn.query('SELECT email FROM customer WHERE email = ?', email, (error, results) => {
    if (error) {
      console.error('error SQL:', error);
      return res.status(500).json({ error: "server error" });
    }
    
    if (results.length > 0) {
      // Email found in customer table
      conn.query('UPDATE customer SET verifycode = ? WHERE email = ?', [verifycode, email], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "server error" });
        } else {
          res.status(200).json({ message: 'update password successful' });
          sendEmail(email, 'Verifying your email', 'This is a code ' + verifycode + ' to verify your email')
            .then(() => console.log('Email sent successfully'))
            .catch((error) => console.error('Error sending email:', error));
        }
      });
    } else {
      // Email not found in customer table, check provider table
      conn.query('SELECT email FROM service_provider WHERE email = ?', email, (error, results) => {
        if (error) {
          console.error('error SQL:', error);
          return res.status(500).json({ error: "server error" });
        }

        if (results.length > 0) {
          // Email found in provider table
          conn.query('UPDATE service_provider SET verifycode = ? WHERE email = ?', [verifycode, email], (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: "server error" });
            } else {
              res.status(200).json({ message: 'update password successful' });
              sendEmail(email, 'Verifying your email', 'This is a code ' + verifycode + ' to verify your email')
                .then(() => console.log('Email sent successfully'))
                .catch((error) => console.error('Error sending email:', error));
            }
          });
        } else {
          // Email not found in both tables
          res.status(404).json({ error: "email is not found" });
        }
      });
    }
  });
});

//   if (!email) {
//     return res.status(400).json({ error: "All data is required" });
//   }
//   const sql = ('SELECT * FROM customer WHERE email = ?')
//   conn.query(sql, [email], (error, results) => {
  

//     if (error) {
//       res.status(404).json({ error: 'Server error' });
//       // return email + " is not found";
//       return res.status(404).json({ error: 'Server error' });
//     } else {
//       if (results== 0) {
//         return res.status(404).json({ error: "email is not found" });
//         console.log(results+res.statusCode);
//         }


//       // console.log(email + "is not found");
//       //   console.log(res.statusCode);
//       else {
        
//         conn.query('UPDATE customer SET verifycode = ? WHERE email = ?', [verifycode, email], (err, result) => {

//           if (err) {
//             console.error(err);  
//             return res.status(500).json({ error: 'Server error' });
//           }
//           if (result>0&&results>0) {
          
//           // sendEmail(email, 'Veryfying your email', 'This is a code ' + verifycode + '  to verify your email')
//           //   .then(() => console.log('Email sent successfully'))
//           //   .catch((error) => console.error('Error sending email:', error));
//         }
//         });
        
//         console.log("email is found"+ res.statusCode);
//         return email + " is found";
//       }
//     }
//   });
//   res.send('تم استلام البيانات بنجاح');


export default check_email;