import express, { Response, Request } from 'express';
import { conn } from '../connection';
import { insertNotify } from '../sendNotification';

const app = express();

app.use(express.json()); // Middleware to parse JSON request body

const new_date =app.post('/SugestNewDate/:id', async (req: Request, res: Response) => {
    try {
      console.log(res.statusCode)
        const requestId = req.params.id;

        // Check if requestId is a valid number
        if (!requestId || isNaN(Number(requestId))) {
            return res.status(400).json({ error: 'Invalid or missing request ID' });
        }

        const { newdate, desc } = req.body;

        // Check if newdate and desc are provided in the request body
        if (!newdate || !desc) {
            return res.status(400).json({ error: 'Missing new date or description in request body' });
        }

        // Insert new date into service_request table
        const insertQuery = 'INSERT INTO service_request ( newdate, newdes) VALUES ( ?, ?) WHERE service_requestid = ?';
        await conn.query(insertQuery, [ newdate, desc,requestId]);

        // Update status of the service_request
        const updateQuery = 'UPDATE service_request SET status = 3 WHERE service_requestid = ?';
        await conn.query(updateQuery, [requestId],);
console.log(res.statusCode)
        insertNotify('اقتراح موعد', 'تم اقتراح موعد جديد', '', '',"sugest",'','',"0")
        return res.status(200).json({ message: 'New date added and status updated successfully' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

export default new_date;
