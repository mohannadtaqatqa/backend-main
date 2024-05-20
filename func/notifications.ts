import express, { Response, Request } from 'express';
import { conn } from '../connection';

const app = express();

app.get('/notification/:id/:usertype', (req: Request, res: Response) => {
  const { id, usertype } = req.params;

  // Check if both id and usertype are present
  if (!id || !usertype) {
    console.log("400 error");
    console.log(id);
    console.log(usertype);
    return res.status(400).json({ error: 'User ID or user type is missing in the URL' });
  }

  if (isNaN(Number(id))) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  // Sanitize inputs and use parameterized queries to prevent SQL injection
  const sql = `SELECT * FROM notification WHERE ${usertype === "0" ? "notification_userid" : "provider_id"} = ? AND userType = ?`;
  const values = [id, usertype];

  conn.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error in service' });
    }
    if (result.length === 0) {
      return res.status(400).json({ message: "You don't have any notifications" });
    }
    res.json(result);
    console.log(result);
  });
});

// Add a default error handler middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
