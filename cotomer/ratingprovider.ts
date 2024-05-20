import bodyParser from "body-parser";
import { conn } from "../connection";
import express, { Response, Request } from "express";
import { error } from "console";
import { insertNotify } from "../func/send_notification";
const app = express();

// Parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const raiting_api = app.post('/raiting', async (req: Request, res: Response) => {
    const { reviewer_id, description, user_id, raiting_value } = req.body;

    // Validation: check if raiting_value is not undefined, null, or NaN
    if (raiting_value === undefined ||
         raiting_value === null ||
          isNaN(raiting_value)||
           raiting_value === '') {
        res.status(400).json("raiting_value is invalid or missing");
        return; // Exit the function early
    }

    const sql = 'INSERT INTO review (reviewer_id, description, user_id, raiting_value) VALUES (?,?,?,?)';
    try {
        const result = await conn.query(sql, [reviewer_id, description, user_id, raiting_value]);
        await conn.query(`UPDATE appointment
        SET status = 4 
        WHERE  provider_id =?
        and customer_id = ? 
        `,[user_id,reviewer_id]);
      insertNotify("تم تقييمك من قبل العميل","نود ابلاغك بانه قام احد العملاء بتقييمك يرجى الاطلاع على التقييم التاكد من رضا العميل", reviewer_id, user_id, 'raiting'+reviewer_id,"", "", '1')
        res.status(200).json('raiting successful');
    } catch (err) {
        console.error(error);
        res.status(500).json({ error: "error in server" });
    }
});

export default raiting_api;
