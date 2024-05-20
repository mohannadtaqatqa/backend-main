import express, { Request, Response } from 'express';
import { conn } from '../connection'; 
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const approval = app.post('/rework/:id', (req: Request, res: Response) => {
 
    if (!req.params || !req.params.id) {
      return res.status(400).json({ error: 'Request ID is missing in the URL' });
    }
  
    const requestId = req.params.id;
    const updateRequestQuery = 'UPDATE service_request SET status = 5 WHERE service_requestid = ?';
      conn.query(updateRequestQuery, [requestId], (error, results, fields) => {
        if (error) {
          console.error('Error updating request status:', error);
          return res.status(500).json({ error: 'An error occurred' });
        }
    

        res.json({ message: 'Request approved successfully' });})


}) 