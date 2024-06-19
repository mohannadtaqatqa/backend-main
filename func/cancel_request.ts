import express, { Response, Request } from "express";
import { conn } from "../connection";
import { insertNotify } from "./send_notification";
const app = express();

function cancelOldRequest() {
  const currentDate = new Date();
  const threeDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 3));
  const formattedDate = threeDaysAgo.toISOString().split('T')[0];

  const selectQuery = `
    SELECT t2.servcie_name,	t1.service_requestid , t1.customer_id, t1.provider_id , t3.customer_fname
    FROM service_request t1
    JOIN customer t3 on t3.customer_id=t1.customer_id
    JOIN service t2 on t2.servcie_id=t1.servcie_id
    WHERE create_date <= ? AND status = 0
    `;

  conn.query(selectQuery, [formattedDate], (error, results) => {
    if (error) {
      console.error('Error fetching old requests:', error);
    }

    if (results.length > 0) {
      results.forEach((request: { service_requestid: any; customer_id: any; servcie_name: any, provider_id: any, customer_fname: any }) => {
        const updateQuery = `
                    UPDATE service_request
                    SET status = 7
                    WHERE service_requestid = ?
                `;

        conn.query(updateQuery, [request.service_requestid], (updateError) => {
          if (updateError) {
            console.error('Error updating request status:', updateError);
          }
          else {
            //هون بدك ترسل اشعارالى العميل و المقدم انه تم الغاء الطلب بسبب عدم الاستجابة 
            insertNotify('الغاء طلب الخدمة', 'نود أن نعلمك بأنه تم الغاء طلب تقديم خدمة بسبب عدم الاستجابة', request.provider_id, request.customer_id, 'cancel' + request.provider_id, "", "", '1')
            insertNotify('الغاء طلب الخدمة', `عزيزي ${request.customer_fname} نود أن نعلمك بأنه تم الغاء طلبك  لخدمة ${request.servcie_name}`, request.provider_id, request.customer_id, 'cancel' + request.customer_id, "", "", '0')
          }
        });
      });
    }


    const twoDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 2));
    const formattedDate2 = threeDaysAgo.toISOString().split('T')[0];
    const selectQuerytow = `
    SELECT t2.servcie_name,	t1.service_requestid , t1.customer_id,t1.provider_id
    FROM service_request t1
    JOIN service t2 on t2.servcie_id=t1.servcie_id
    WHERE create_date <= ? AND status = 0
    `;
    conn.query(selectQuerytow, [formattedDate2], (error, results) => {
      if (error) {
        console.error('Error fetching old requests:', error);
      }
      if (results.length > 0) {
        results.forEach((request: { service_requestid: any; customer_id: any; servcie_name: any, provider_id: any }) => {
          //هون بدك ترسل اشعار للمقدم انه عندك طلبات لازم توافق عليهم 
          insertNotify('تنبيه', `يوجد لديك طلبات يرجى الاطلاع عليها وشكرا`, request.provider_id, request.customer_id, 'cancel' + request.provider_id, "", "", '1');
        })
      }

    })




  });


}
export default cancelOldRequest;