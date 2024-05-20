import express, { Response, Request } from "express";
import { conn } from '../connection';

const app = express()

const GetRquest_provider = app.get('/GetRequestProvider/:id', (req: Request, res: Response) => {
    const providerID = req.params.id;
    if (isNaN(Number(providerID))) {
        return res.status(400).json("Invalid user ID");
    }

    const queryGetRequest = `SELECT t1.service_requestid, t1.status, t1.date_request, t1.description,
        t2.customer_fname, t2.customer_lname, t2.city, t2.phone_num, t2.address,
        t3.servcie_name ,t4.disblaystats FROM service_request t1 
        JOIN customer t2 ON t1.customer_id = t2.customer_id 
        JOIN service t3 ON t1.servcie_id = t3.servcie_id
        JOIN status t4 on t1.status =t4.id_status
        WHERE t1.provider_id = ? AND t1.status in(0,3) ;`;

    conn.query(queryGetRequest, [providerID], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json("Error with service");
        }
        if (result.length === 0) {
            return res.status(200).json("You don't have any requests");
        }
        res.json(result);
    });
});

export default GetRquest_provider;
