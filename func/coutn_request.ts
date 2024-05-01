import express, { Response, Request } from "express";
import { conn } from "../connection";
const app = express();

    function calculateAndSetcout() {
        
        const count_request = `
        UPDATE service_provider AS p
JOIN (
    SELECT r.provider_id, COUNT(r.service_requestid) AS total_request 
    FROM service_request AS r 
    WHERE r.status = 0
    GROUP BY r.provider_id
) AS temp ON p.provider_id = temp.provider_id
SET p.count_request = temp.total_request;

        `;
      
        conn.query(count_request, (error, results, fields) => {
          if (error) {
            console.error('Error calculating ratio and updating provider table:', error);
            return;
          }
      
          console.log('Ratio calculated and set in the provider table successfully');
        });
}
export default calculateAndSetcout;