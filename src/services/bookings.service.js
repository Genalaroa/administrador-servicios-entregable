import { BookingsRepository } from "../repositories/bookings.repository.js";
import { ServicesService } from "./services.service.js";

const repository = new BookingsRepository();
const servicesService = new ServicesService();

export class BookingsService {

    async getBookingById(id) {
        return await repository.getById(id);
    }

    async getBookings(){
        const bookings = await repository.getAll();
        const plainBookings = bookings.map((booking) => booking.toObject());

        return plainBookings;
    }

    async createBooking(bookingData){
        const requiredFields = [ 
            "clientName", 
            "clientEmail", 
            "date", 
            "time", 
            "status" 
        ];

        const missingFields = requiredFields.filter( 
            field => bookingData[field] === undefined || 
            bookingData[field] === null 
        ); 
 
        if (missingFields.length > 0) { 
            throw new Error( 
                `Faltan campos obligatorios: ${missingFields.join(", ")}`
            );
        }        
        return await repository.create(bookingData);
    }

    async addServiceToBooking(bookingId, serviceId) {

        const service = await servicesService.getServiceById(serviceId);  

        if (!service) {
            return null;
        }
        
        const booking = await this.getBookingById(bookingId);

        if (!booking) {
            return null;
        }     

        const existingService = booking.services.find(
            item => item.service.toString() === service._id.toString()
        );

        if (existingService) {
            existingService.quantity = existingService.quantity + 1;
        } else {
            booking.services.push({
                service: serviceId,
                quantity: 1
            })}

        return await repository.update(bookingId, booking);
    }
}