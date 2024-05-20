 import express, { Response, Request } from "express";
import { conn } from "../connection";
const app = express();

    function calculateAndSetRatio() {
        
        const calculateRatioQuery = `
        UPDATE service_provider AS p
         JOIN ( SELECT r.user_id, SUM(r.raiting_value) AS total_rating_value 
         FROM review AS r 
         GROUP BY r.user_id ) 
         AS temp ON p.provider_id = temp.user_id
          SET p.rating = temp.total_rating_value / 5;
        `;
      
        conn.query(calculateRatioQuery, (error, results, fields) => {
          if (error) {
            console.error('Error calculating ratio and updating provider table:', error);
            return;
          }
      
          console.log('Ratio calculated and set in the provider table successfully');
        });
}
export default calculateAndSetRatio;