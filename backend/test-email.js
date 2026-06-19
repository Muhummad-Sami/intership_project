import { sendBookingEmail } from './utils/email.js';
import dotenv from 'dotenv';
dotenv.config();

const mockBooking = {
  user: {
    name: 'Test User',
    email: 'test@example.com'
  },
  car: {
    name: 'Ferrari F8',
    brand: 'Ferrari',
    category: 'Sports',
    price: 1200,
    image: 'https://example.com/ferrari.jpg'
  },
  carName: 'Ferrari F8',
  startDate: new Date(),
  endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
};

sendBookingEmail(mockBooking);