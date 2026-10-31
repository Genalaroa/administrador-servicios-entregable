import Booking from "../models/booking.model.js"

export class BookingsDAO {

    async create(booking) {
        const newBooking = await Booking.create(booking)

        return newBooking
    }

    async getAll() {
        const bookings = await Booking.find();
        
        return bookings;
    }

    async getById(id) {
        const booking = await Booking.findById(id);

        return booking || null;
    }


    async update(id, updatedBooking) {
        const booking = await Booking.findByIdAndUpdate(
            id,
            updatedBooking,
            { new:true, runValidators: true }
        );

        return booking;
    }
}

