import mysql from 'mysql';
import calculateAndSetRatio from './func/sumrating';
import calculateAndSetcout from './func/coutn_request';
const conn = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'home_services'

});
conn.connect((err) => {
   if (err) {
      console.error(err);
      console.log('cant connect to data baase ')
         ;
   }
   console.log('connected to database 4');
   calculateAndSetRatio();
   calculateAndSetcout();
})

export {conn};

