import { ServicesRepository } from "../repositories/services.repository.js";

export class ServicesService {

    constructor(repository = new ServicesRepository()) {
        this.repository = repository;
    }

    async getServices(category, available, page, limit, sortBy, order) {
                
        const skip = (page - 1) * limit;
        const sort = {[sortBy]: order === "asc" ? 1: -1};

        const filters = {};

        if (category) {
            filters.category = category;
        }

        if (available !== undefined) {
            filters.available = available === "true";
        }
        
        const [services, total] = await Promise.all([
        this.repository.getAll(filters, skip, limit, sort),
        this.repository.count(filters)
        ]);
        
        const totalPages = Math.ceil(total / limit);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;

        return {
        services,
        pagination: {
            total,
            page,
            limit,
            totalPages,
            hasPrevPage,
            hasNextPage
        } }
    }
  
    async getServiceById(id) {
        return await this.repository.getById(id);
    }

    async createService(serviceData) {
        const requiredFields = [
         "name",
         "description",
         "duration",
         "price",
         "category",
         "available"
        ]; 

        const missingFields = requiredFields.filter(
         field => serviceData[field] === undefined ||
         serviceData[field] === null
        );

        if (missingFields.length > 0) {
        throw new Error(
        `Faltan campos obligatorios: ${missingFields.join(", ")}`
        )}

        if (!Number.isFinite(serviceData.price) || serviceData.price <= 0) {
        throw new Error("El precio debe ser un número mayor que 0");
        }

        if (!Number.isFinite(serviceData.duration) || serviceData.duration<= 0) {
        throw new Error("La duración debe ser un número mayor que 0");
        }

       return await this.repository.create(serviceData);
    }

    async updateService(id, updatedData) {

        const service = await this.getServiceById(id);

        if (!service) {
            return null;
        }

        const { _id: ignoredId, ...safeData } = updatedData;


        if (safeData.duration !== undefined &&
            (!Number.isFinite(safeData.duration) || safeData.duration <= 0)) {
            throw new Error("La duración debe ser un número mayor que 0");
        }

        if (safeData.price !== undefined &&
            (!Number.isFinite(safeData.price) || safeData.price <= 0)) {
            throw new Error("El precio debe ser un número mayor que 0");
        }       

        return await this.repository.update(id, safeData);
    }

    async deleteService (id) {
        return await this.repository.delete(id);
    }

}