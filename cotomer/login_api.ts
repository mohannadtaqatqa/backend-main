import express, { Response, Request } from "express";
import { conn } from "../connection";
import bcrypt from 'bcrypt'
import bodyParser from 'body-parser';

const app = express();

// Parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const login_api = app.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log(req.body);

              if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
               }
    try {
        conn.query('SELECT * FROM customer WHERE email = ?', [email], async (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "service error?!!!" });
            }
            
            if (result.length === 0) {
                return res.status(400).json("email or password wrong ");
            }

            const user = result[0];
            const match = await bcrypt.compare(password, user.pass);
            if (!match) {
                console.log("error")
                return res.status(400).json("email or password wrong");
                
            }
            res.status(200).json({ message: 'Login successful', user: { email: user.email,fname:user.customer_fname,id:user.customer_id ,isvaled:user.status_verifycode} });
        });
        
    } catch (err) {
        console.error('error:', err);
        res.status(500).json({ error: 'server error' });
      }
});
export default login_api;
