import express from 'express';
import { getAllCars,
     searchCars, 
     addCar, 
     editCar, 
     git deleteCar } from '../controller/admin.controller.js';
const router = express.Router();


router.get('/get-cars', getAllCars);
router.get('/search-cars', searchCars);
router.post('/add-car',isAuthenticated, addCar);
router.put('/edit-car/:carId',isAuthenticated, editCar);
router.delete('/delete-car/:carId',isAuthenticated, deleteCar);
