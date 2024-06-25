import axios from 'axios';
import { conn } from '../connection';

async function sendGCM(title: string, message: string, topic: string, pageid: string, pagename: string): Promise<string> {
    const url: string = 'https://fcm.googleapis.com/fcm/send';

    const data = {
        to: `/topics/${topic}`,
        priority: 'high',
        content_available: true,
        notification: {
            body: message,
            title: title,
            click_action: 'FLUTTER_NOTIFICATION_CLICK',
            sound: 'default'
        },
        data: {
            pageid: pageid,
            pagename: pagename
        }
    };

    const headers = {
        'Authorization': 'key=AAAA4xGgVIM:APA91bEpo55GBU4mz6SrNrqbsDfWUT6xpTYJklLXck5rO8J9wgrcVkygBzXGSJY5t339SxEXKc6HwrguFGHnfa0FBbb0FS5Jwp7RYQRcAvqW6dmSIHv3WP3A9p_neYH-TOC57ULADmBq',
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post(url, data, { headers });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to send notification: ${error}`);
    }
}

//تخزين الاشعارات في قاعدة البيانات
function insertNotify(title: string , message: string ,providerid: string, userid: string,topic:string,pageid:string,pagename:string, userType: string) {
  const store = 'INSERT INTO notification (notification_title, notification_body, notification_userid,provider_id,userType) VALUES (?,?,?,?,?)';
  conn.query(store, [title, message, userid, providerid,userType], (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(result);
    sendGCM(title, message, topic, pageid, pagename)
    console.log('Notification inserted successfully');

  });
}
export { insertNotify };
export default sendGCM;
