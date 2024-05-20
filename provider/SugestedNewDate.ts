import express, { Response, Request } from 'express';
import { conn } from '../connection';
import { insertNotify } from '../func/send_notification';

const app = express();

app.use(express.json()); // Middleware to parse JSON request body

const new_date =app.post('/SugestNewDate/:id', async (req: Request, res: Response) => {
    try {
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
        await conn.query(insertQuery, [ newdate, desc,requestId],(error, results, fields) => {
                  // Update status of the service_request
        const updateQuery = 'UPDATE service_request SET status = 3 WHERE service_requestid = ?';
        conn.query(updateQuery, [requestId]);
        console.log(results)
        insertNotify('تم اقتراح موعد جديد', 'لقد قام مقدم الخدمة بإقتراح موعد جديد يرجى التحقق من صفحة طلباتي', results[0].provider_id, results[0].customer_id, "suggest"+results[0].customer_id, "", "", '0')
        return res.status(200).json({ message: 'New date added and status updated successfully' });

        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

export default new_date;
