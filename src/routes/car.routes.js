import express from 'express';
import { getAllCars,
     searchCars, 
     addCar, 
     editCar, 
      deleteCar } from '../controller/admin.controller.js';
      import { isAuthenticated } from '../middleware/auth.middleware.js';
import { rentCar } from '../controller/rent.controller.js';
const router = express.Router();


router.get('/get-cars', getAllCars);
router.get('/search-cars', searchCars);
router.post('/add-car',isAuthenticated, addCar);
router.put('/edit-car/:carId',isAuthenticated, editCar);
router.delete('/delete-car/:carId',isAuthenticated, deleteCar);

//rent car
router.post('/rent-car/:carId', isAuthenticated, rentCar)

export default router;