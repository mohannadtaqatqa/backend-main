import express, { Request, Response } from 'express';
import { conn } from '../connection'; 
const app = express();

const get_appointment = app.get('/Getreview/user/:id', (req: Request, res: Response) => {
  
  if (!req.params || !req.params.id) {
    return res.status(400).json({ error: 'User ID is missing in the URL' });
  }

  const userId = req.params.id; 

  if (isNaN(Number(userId))) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  const sql = `SELECT t1.description,t1.raiting_value  FROM review t1 WHERE t1.user_id =?`
  conn.query(sql, [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred' }); 
    }

    if (result.length === 0) {
      return res.status(200).json({ message: "You don't have any review" }); 
    }
    res.json(result); 
  });
});

export default get_appointment;