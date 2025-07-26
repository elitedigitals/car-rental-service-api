import Car from "../models/car.schema";
import User from "../models/user.schema";

export const rentCar = async (req, res) => {
    const { carId } = req.params;
    const { startDate, endDate, totalPrice } = req.body;
    const userId = req.user.id;

    try {
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        if (car.isRented|| !car.isAvailable) {
            return res.status(400).json({ message: "Car is not available for rent" });
        }
        car.isRented = true;
        car.startDate = startDate;
        car.endDate = endDate;
        car.totalPrice = totalPrice;
        car.isAvailable = false;
        car.rentedBy = userId;
        car.status = 'pending';
        
        await car.save();

        res.status(200).json({ message: "Car rented successfully", car });
    } catch (error) {
        res.status(500).json({ message: "Error renting car", error });
    }
}