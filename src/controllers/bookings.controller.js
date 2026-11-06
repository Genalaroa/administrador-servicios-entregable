import {BookingsService} from "../services/bookings.service.js";

const bookingsService = new BookingsService();

export const createBooking = async (req, res) => { 
  
    try {   
        const bookingData = req.body;     
        const newBooking = await bookingsService.createBooking(bookingData);   
           
        const io = req.app.get("io");
        io.emit("bookingCreated", newBooking);
        
        return res.status(201).json(newBooking); 

    } catch (error) {   
        if (error.name === "ValidationError" || error.name === "Error") {
            return res.status(400).json({
            error: error.message
        })} 
        else {
            return res.status(500).json({
            error: error.message
        })}
    } 
};

 export const getBookingById = async (req, res) => {

    try {
        const id = req.params.bid;
        const booking = await bookingsService.getBookingById(id);

        if (!booking) {
        return res.status(404).json({
            "error": "Reserva no encontrada"
        })}

        res.status(200).json(booking);

    } catch (error) {
        if (error.name === "CastError") {
        return res.status(400).json({
                error: error.message
        })} 
        else {
            return res.status(500).json({
            error: error.message
        })}
    }
};

export const addServiceToBooking = async (req, res) => {

    try {
        const bookingId = req.params.bid;
        const serviceId = req.params.sid;
        const quantity = req.body.quantity;

        const updatedBooking = await bookingsService.addServiceToBooking(bookingId, serviceId, quantity);
        
        if (!updatedBooking) {
        return res.status(404).json({
            "error": "Reserva o servicio no encontrado"
        })}

        const io = req.app.get("io");
        io.emit("bookingUpdated", updatedBooking);

        res.status(200).json(updatedBooking);

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
            error: error.message
        })} 
        else {
            return res.status(500).json({
            error: error.message
        })}
    }
};