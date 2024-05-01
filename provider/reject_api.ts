import express, { Request, Response } from 'express';
import { conn } from '../connection'; 
import { insertNotify } from '../sendNotification';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const approval = app.post('/rejectrequest/:id', (req: Request, res: Response) => {
  console.log(res.statusCode)
 
  if (!req.params || !req.params.id) {
    return res.status(400).json({ error: 'Request ID is missing in the URL' });
  }

  const requestId = req.params.id; 

  const fetchRequestQuery = 'SELECT * FROM service_request WHERE service_requestid = ?';
  conn.query(fetchRequestQuery, [requestId], (error, results, fields) => {
    if (error) {
      console.error('Error fetching request data:', error);
      return res.status(500).json({ error: 'An error occurred' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
   

    

      const updateRequestQuery = 'UPDATE service_request SET status = 2 WHERE service_requestid = ?';
      conn.query(updateRequestQuery, [requestId], (error, result, fields) => {
        if (error) {
          console.error('Error updating request status:', error);
          return res.status(500).json({ error: 'An error occurred' });
        }
        insertNotify('رفض طلب' , 'تمت رفض الخدمة ', results[0].provider_id, results[0].customer_id,"reject"+results[0].customer_id,'','',"0")
        console.log(results[0])
        res.json({ message: 'Request approved successfully' });  
      });
    });
  });

export default approval;
