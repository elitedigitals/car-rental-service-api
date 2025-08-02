import axios from 'axios';
// import PaystackPop from '@paystack/inline-js'
import Car from "../models/car.schema.js";
import Https from 'https';
import dotenv from 'dotenv';
dotenv.config();

export const rentCar = async (req, res) => {
    const { carId } = req.params;
    const userId = req.user.id;
    const { startDate, endDate, totalPrice } = req.body;

  try {
    // Find the car by ID
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Check if the car is already rented
    if (car.isRented) {
      return res.status(400).json({ message: "Car is already rented" });
    }

    // Initialize payment with Paystack
    const params = JSON.stringify({ 
        amount: totalPrice * 100, // Paystack uses kobo
        email: req.user.email,
        currency: "NGN",
        metadata: {
            carId,
            userId,
            startDate,
            endDate
        },

    });
    const options = {
        hostname: 'api.paystack.co',
        path: '/transaction/initialize',
        port: 443,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
        }
    };

    const paystackreq =Https.request (options, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on('end', () => {
            const paystackResponse = JSON.parse(data);
            if (paystackResponse.status) {
                // Mark car as pending
                car.isRented = true;
                car.startDate = startDate;
                car.endDate = endDate;
                car.totalPrice = totalPrice;
                car.isAvailable = false;
                car.rentedBy = userId;
                car.status = 'pending'

                car.save();

                return res.status(200).json({
                    message: "Payment initialized successfully",
                    authorization_url: paystackResponse.data.authorization_url // Send this to frontend to redirect user
                });
            } else {
                return res.status(400).json({ message: "Payment initialization failed", error: paystackResponse.message });
            }
        });

    });
  }catch (error) {
    console.error("Error renting car:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const verifyPayment = async (req, res) => {
    const { reference } = req.query;

    try {
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const paymentData = response.data.data;

        if (paymentData.status === "success") {
            // Update car status to rented
            const car = await Car.findOneAndUpdate(
                { _id: paymentData.metadata.carId, isRented: true },
                { status: 'rented', isAvailable: false },
                { new: true }
            );

            if (!car) {
                return res.status(404).json({ message: "Car not found or already rented" });
            }

            return res.status(200).json({
                message: "Payment verified successfully",
                car
            });
        } else {
            return res.status(400).json({ message: "Payment verification failed", paymentData });
        }

    } catch (error) {
        console.error("Verification Error:", error?.response?.data || error.message);
        return res.status(500).json({
            message: "Error verifying payment",
            error: error?.response?.data || error.message
        });
    }
}