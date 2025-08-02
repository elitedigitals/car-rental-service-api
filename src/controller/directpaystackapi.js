// import axios from 'axios';
// import Car from "../models/car.schema.js";

// export const rentCar = async (req, res) => {
//     const { carId } = req.params;
//     const { startDate, endDate, totalPrice } = req.body;
//     const userId = req.user.id;
//     const userEmail = req.user.email;

//     try {
//         const car = await Car.findById(carId);
//         if (!car) {
//             return res.status(404).json({ message: "Car not found" });
//         }

//         if (car.isRented || !car.isAvailable) {
//             return res.status(400).json({ message: "Car is not available for rent" });
//         }

//         // Initialize payment with Paystack
//         const paystackResponse = await axios.post(
//             `https://api.paystack.co/transaction/initialize`,
//             {
//                 amount: totalPrice * 100, // Paystack uses kobo
//                 email: userEmail,
//                 currency: "NGN",
//                 metadata: {
//                     carId,
//                     userId,
//                     startDate,
//                     endDate
//                 },
//                 callback_url: "http://localhost:4500/api/user/verify-payment" // Optional if using webhook only
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//                     "Content-Type": "application/json"
//                 }
//             }
//         );

//         const { authorization_url } = paystackResponse.data.data;

//         // Mark car as pending
//         car.isRented = true;
//         car.startDate = startDate;
//         car.endDate = endDate;
//         car.totalPrice = totalPrice;
//         car.isAvailable = false;
//         car.rentedBy = userId;
//         car.status = 'pending';

//         await car.save();

//         return res.status(200).json({
//             message: "Payment initialized successfully",
//             authorization_url // Send this to frontend to redirect user
//         });

//     } catch (error) {
//         console.error("Paystack Error:", error?.response?.data || error.message);
//         return res.status(500).json({
//             message: "Error initializing payment",
//             error: error?.response?.data || error.message
//         });
//     }
// };


// export const verifyPayment = async (req, res) => {
//     const { reference } = req.query;

//     try {
//         const response = await axios.get(
//             `https://api.paystack.co/transaction/verify/${reference}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//                     "Content-Type": "application/json"
//                 }
//             }
//         );

//         const paymentData = response.data.data;

//         if (paymentData.status === "success") {
//             // Update car status to rented
//             const car = await Car.findOneAndUpdate(
//                 { _id: paymentData.metadata.carId, isRented: true },
//                 { status: 'rented', isAvailable: false },
//                 { new: true }
//             );

//             if (!car) {
//                 return res.status(404).json({ message: "Car not found or already rented" });
//             }

//             return res.status(200).json({
//                 message: "Payment verified successfully",
//                 car
//             });
//         } else {
//             return res.status(400).json({ message: "Payment verification failed", paymentData });
//         }

//     } catch (error) {
//         console.error("Verification Error:", error?.response?.data || error.message);
//         return res.status(500).json({
//             message: "Error verifying payment",
//             error: error?.response?.data || error.message
//         });
//     }
// }