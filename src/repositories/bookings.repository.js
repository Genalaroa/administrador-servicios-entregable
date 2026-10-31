import { BookingsDAO } from "../dao/bookings.dao.js";

const dao = new BookingsDAO();

export class BookingsRepository {

    async create(booking){
        return await dao.create(booking);
    }

    async getAll(){
        return await dao.getAll();
    }

    async getById(id) {
        return await dao.getById(id);
    }

    async update(id, updatedBooking){
        return await dao.update(id, updatedBooking);
    }
}