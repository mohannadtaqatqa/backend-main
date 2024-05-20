import express, { Response, Request } from "express";
import { conn } from "../connection";

const app = express();

const updateStatustoNO = app.post('/updateStatusById/:id', async (req: Request, res: Response) => {
    const userId  = req.params.id;

    if (isNaN(Number(userId))) {
        return res.status(400).json("Invalid user ID");
    }

    try {
        const sql = `UPDATE service_provider SET status = 0 WHERE provider_id = ?`;
        conn.query(sql, [userId]);
        
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default updateStatustoNO;