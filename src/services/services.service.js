import { ServicesRepository } from "../repositories/services.repository.js";

const repository = new ServicesRepository();

export class ServicesService {

    async getServices(category, available) {
        let services = await repository.getAll();
        
        if (category) {
        services = services.filter((service) => {
        return service.category.toLowerCase() === category.toLowerCase();
        })}
    
        if (available !== undefined) {
        const availableBoolean = available === "true";
        services = services.filter((service) => {
        return service.available === availableBoolean;
        })}

        return services;
    }
  
    async getServiceById(id) {
        return await repository.getById(id);
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

       return await repository.create(serviceData);
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

        return await repository.update(id, safeData);
    }

    async deleteService (id) {
        return await repository.delete(id);
    }

}