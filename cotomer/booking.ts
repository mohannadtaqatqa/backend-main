import express, { Response, Request } from "express";
import { conn } from '../connection';
import bodyParser from 'body-parser';
import { insertNotify } from "../func/send_notification";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const booking_Api = app.post('/booking', async (req: Request, res: Response) => {
    const { date, serviceid, customerid, providerid, description } = req.body;
    
    // Validation: Check if any required field is missing
    if (!date || !serviceid || !customerid || !providerid || !description) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const checkifbooking = 'SELECT * FROM service_request WHERE customer_id = ? AND provider_id = ? AND date_request = ?';
    
    // Check if there is an existing booking
    conn.query(checkifbooking, [customerid, providerid, date], async (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Service error" });
        }
        if (result.length > 0) {
            return res.status(400).json({ error: 'You already have a booking for this date' });
        }
        // If no existing booking, proceed with insertion
        const sql = 'INSERT INTO service_request (servcie_id, provider_id, customer_id, date_request, description) VALUES (?, ?, ?, ?, ?)';
        try {
            const insertionResult = await conn.query(sql, [serviceid, providerid, customerid, date, description]);
            insertNotify("حجز جديد", "يوجد لديك طلب حجز جديد", providerid, customerid, "booking"+providerid, "", "", "1")
            res.status(200).json({ message: "Booking successful" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    });
});

export default booking_Api;
