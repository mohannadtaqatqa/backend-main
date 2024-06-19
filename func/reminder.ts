import { conn } from "../connection";
import cron from 'node-cron'
import { insertNotify } from "./send_notification";
const scheduleReminders = () => {
  cron.schedule('0 9 * * *', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0];

    try {
      const [rows]: any = await conn.query(
        'SELECT * FROM appointments WHERE date = ?',
        [formattedDate]
      );

      const appointments: any[] = rows as any[];
      appointments.forEach((appointment) => {
        //appointment  من هاي بتقدر تجيب الايميل 
        // هون بدك ترسل اشعار للمفدم و الكسمتر انه عندكم بكرا شغل 
        insertNotify('تذكير بموعد',
          `عزيزي ${appointment.customer_fname}  هذا تذكير لك بموعد عمل في ${appointment.date} تاريخ`
          , appointment.provider_id, appointment.customer_id, "remider" + appointment.customer_id, '', '', '0')
        insertNotify('تذكير بموعد',
          `عزيزي ${appointment.provider_fname}  هذا تذكير لك بموعد عمل في ${appointment.date} تاريخ شكرا لك`
          , appointment.provider_id, appointment.customer_id, "remider" + appointment.provider_id, '', '', '1')
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  });
};

export default scheduleReminders;