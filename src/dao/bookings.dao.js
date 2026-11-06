import Booking from "../models/booking.model.js"

export class BookingsDAO {

    async create(booking) {
        const newBooking = await Booking.create(booking)

        return newBooking
    }

    async getAll() {
        const bookings = await Booking.find().populate("services.service");
        
        return bookings;
    }

    async getById(id) {
        const booking = await Booking.findById(id).populate("services.service");

        return booking || null;
    }


    async update(id, updatedBooking) {
        const booking = await Booking.findByIdAndUpdate(
            id,
            updatedBooking,
            { returnDocument: 'after', runValidators: true }
        ).populate("services.service");

    return booking;
}
}

