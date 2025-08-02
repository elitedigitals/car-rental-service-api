import crypto from 'crypto';
import mongoose from 'mongoose';
import Car from '../models/car.schema.js';
import logger from '../../utility/logger.js';
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.PAYSTACK_SECRET_KEY;
const PaystackWebhookHandler = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        logger.info('Received Paystack webhook', { body: req.body });

        const signature = req.headers['x-paystack-signature'];
        const hash = crypto
            .createHmac('sha512', secret)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (!signature || signature !== hash) {
            logger.warn('Invalid Paystack signature');
            await session.abortTransaction();
            return res.status(400).json({ message: 'Invalid signature' });
        }

        const event = req.body;

        if (!event || !event.data || event.event !== 'charge.success' || event.data.status !== 'success') {
            logger.info('Event is not a successful charge');
            await session.abortTransaction();
            return res.status(400).json({ message: 'Event is not charge.success' });
        }

        logger.info('Processing successful payment event', { event });

        const carId = event.data.metadata?.carId;

        if (!carId) {
            logger.warn('No carId in metadata');
            await session.abortTransaction();
            return res.status(400).json({ message: 'Missing carId in metadata' });
        }

        const car = await Car.findOneAndUpdate(
            { _id: carId, isRented: true },
            { status: 'rented', isAvailable: false },
            { new: true, session }
        );

        if (!car) {
            logger.info('Car not found or already rented');
            await session.abortTransaction();
            return res.status(404).json({ message: 'Car not found or already rented' });
        }

        await session.commitTransaction();
        logger.info('Car rental updated successfully', { car });

        return res.status(200).json({
            message: 'Payment verified successfully',
            car,
        });

    } catch (error) {
        logger.error('Error processing Paystack webhook', {
            error: error.message,
            stack: error.stack,
        });
        await session.abortTransaction();
        return res.status(500).json({ message: 'Internal Server Error' });

    } finally {
        session.endSession();
    }
};
export { PaystackWebhookHandler };
