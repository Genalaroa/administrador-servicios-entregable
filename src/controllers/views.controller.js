import { ServicesService } from "../services/services.service.js";
import { BookingsService } from "../services/bookings.service.js";

const servicesService = new ServicesService();
const bookingsService = new BookingsService();

export const renderServices = async (_req, res) => {
    try {
        const result = await servicesService.getServices();

        const services = result.services.map(service =>
            service.toObject ? service.toObject() : service
        );
        res.render("services", { services });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar los servicios");
    }
};

export const renderBookings = async (req, res) => {
    try {
        const bookings = await bookingsService.getBookings();
        res.render("bookings", { bookings });
    } catch (error) {
        res.status(500).send("Error al cargar las reservas");
    }
};