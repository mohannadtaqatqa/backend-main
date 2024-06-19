import express, { Request, Response } from 'express';
import { conn } from '../connection';
import { insertNotify } from '../func/send_notification';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const approval = app.post('/approverequest/:id', (req: Request, res: Response) => {

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

    const responseData = results[0];
    // ننشيك هل التاريخ متاح للمقدم
    // نواجه مشكلة عند العميل لان الباث مشترك للعميل ومقدم الخدمة المشكلة => هي ان يتم حذف الطلب من الطلبات
    const checkDateQuery = 'SELECT * FROM appointment WHERE date = ? AND provider_id = ? AND status = 1';
    conn.query(checkDateQuery, [responseData.date_request, responseData.provider_id], (error, results, fields) => {
      if (error) {
        console.error('Error checking date availability:', error);
        return res.status(500).json({ error: 'An error occurred' });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: 'Date not available' });
      }
      else {

        console.log(responseData)
        const insertAppointmentQuery = 'INSERT INTO appointment (servcie_id, provider_id, customer_id, date, description, status,request_id) VALUES (?, ?, ?, ?, ?,?,?)';
        conn.query(insertAppointmentQuery, [
          responseData.servcie_id,
          responseData.provider_id,
          responseData.customer_id,
          responseData.date_request,
          responseData.description,
          1,
          responseData.service_requestid

        ], (error, results, fields) => {
          if (error) {
            console.error('Error inserting data into appointment table:', error);
            return res.status(500).json({ error: 'An error occurred' });
          }

          const updateRequestQuery = 'UPDATE service_request SET status = 1 WHERE service_requestid = ?';
          conn.query(updateRequestQuery, [requestId], (error, results, fields) => {
            if (error) {
              console.error('Error updating request status:', error);
              return res.status(500).json({ error: 'An error occurred' });
            }
            insertNotify('تمت الموافقة على طلبك', 'نود أن نعلمك بأنه تمت الموافقة على طلبك يرجى فحص صفحة مواعيدي', responseData.provider_id, responseData.customer_id, 'ok' + responseData.customer_id, "", "", '0')
            res.json({ message: 'Request approved successfully' });
          });
        });
      }
    });
  });
});

export default approval;
