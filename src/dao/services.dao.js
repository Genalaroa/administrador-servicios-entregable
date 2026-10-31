import Service from "../models/service.model.js";

export class ServicesDAO {

    async getAll()  {    
        const services = await Service.find();
        
        return services;
    }

    async getById(id) {
        const service = await Service.findById(id);

        return service;
    }
    

    async create(service) {    
        const newService = await Service.create(service);

        return newService;
    }

    async update(id, updatedService) {
        const service = await Service.findByIdAndUpdate(
            id,
            updatedService,
            { new: true, runValidators: true }
        );

        return service;
    }

    async delete(id) {
        const deleteService = await Service.findByIdAndDelete(id);
    
        return deleteService;
    }

}