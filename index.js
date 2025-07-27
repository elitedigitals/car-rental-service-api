import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import userRoute from './src/routes/user.route.js';
import carRoute from './src/routes/car.routes.js';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 4500;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing form data

app.get('/', (req, res) => {
  res.send('Hello, World!');
});
app.use('/api/user',userRoute);
app.use('/api/car',carRoute);



app.listen(PORT, () => {
    try {
        connectDB();
        console.log(`Server is running on http://localhost:${PORT}`);
    } catch (error) {
        console.error('Database connection failed:', error);
    }
});