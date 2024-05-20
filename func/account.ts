import express, { Response, Request } from "express";
import { conn } from "../connection";
const app = express();

const account = app.post("/account", (req: Request, res: Response) => {
  const { firstName, lastName, address, city, phone, email } = req.body;
  if (!req.body || !req.body.email || !req.body.password) {
    return res.status(400).json({ error: "All data is required" });
  }


  const sql = "SELECT * FROM customer WHERE email = ?";

  conn.query(sql, [email], (error, results) => {
    if (error) {
      console.error('error SQL:', error);
      return res.status(500).json({ error: 'Server error' });
    } else {
      if (results.length > 0) {
        return res.status(400).json({ error: "email already exists" });
      } else {

});