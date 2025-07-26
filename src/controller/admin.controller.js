import Car from "../models/car.schema";
import User from "../models/user.schema";

export const getAllCars = async (req, res) => {
    try {
        const cars = await Car.find();
        res.status(200).json({message:" car added successfully",cars});
    } catch (error) {
        res.status(500).json({ message: "Error fetching cars", error });
    }
};

//add car controller
export const addCar = async (req, res) => {
    const { make, model, year, price, description, color, brand } = req.body;
    const id = req.user.id;
    if (!make || !model || !year || !price) {
        return res.status(400).json({ message: "Make, model, year, and price are required" });
    }
    try {
        const user = await User.findById(id);
        if(user.isadmin === false) {
            return res.status(403).json({ message: "Only Admin can add car" });
        }
        const newCar = new Car(
            {
                make,
                model,
                year,
                price,
                description,
                color,
                brand,
            }
        );
        await newCar.save();
        
        res.status(201).json({message: "Car added successfully", newCar });
    } catch (error) {
        res.status(500).json({ message: "Error adding car", error });
    }
};

export const editCar = async (req, res) =>{
    const { carId } = req.params;
    const { make, model, year, price, description, color, brand } = req.body;
    const id = req.user.id;

    try {
        const user = await User.findById(id);
        if(user.isadmin === false) {
            return res.status(403).json({ message: "Only Admin can edit car" });
        }
        
        const car = await Car.findByIdAndUpdate(carId);
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }
        car.make = make || car.make;
        car.model = model || car.model;
        car.year = year || car.year;
        car.price = price || car.price;
        car.description = description || car.description;
        car.color = color || car.color;
        car.brand = brand || car.brand;
        await car.save();
        res.status(200).json({ message: "Car updated successfully", car });
        
    } catch (error) {
        res.status(500).json({ message: "Error updating car", error });
    }
}

export const deleteCar = async (req, res) => {
    const { carId } = req.params;
    const id = req.user.id;

    try {
        const user = await User.findById(id);
        if(user.isadmin === false) {
            return res.status(403).json({ message: "Only Admin can delete car" });
        }
        
        const car = await Car.findByIdAndDelete(carId);
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }
        res.status(200).json({ message: "Car deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting car", error });
    }
};

export const searchCars = async (req, res) => {
    const {make} = req.query;
    try {
        const car = await car.find({make: make});
        if (!car) {
            return res.status(404).json({ message: "No cars found" });  
        }
        res.status(200).json({ message: "Cars found", car });
    }catch (error) {
        res.status(500).json({ message: "Error searching cars", error });
    }
};