// // فحص هل يوجد موعد في هذا التاريخ
// import express, { Request, Response } from 'express';
// import { conn } from '../connection';

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const check_date = app.post('/check_date', (req: Request, res: Response) => {

//   if (!req.body || !req.body.date) {
//     return res.status(400).json({ error: 'Date is missing in the request body' });
//   }

//   const { date } = req.body;
//   const formattedDate = new Date(date).toISOString().split('T')[0];
//   const query = 'SELECT * FROyM service_request WHERE date_request = ?';

// })
// export default check_date;