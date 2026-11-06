import Service from "../models/service.model.js";

export class ServicesDAO {

    async getAll(filters, skip, limit, sort)  {    
        const services = await Service.find(filters)
        .skip(skip)
        .limit(limit)
        .sort(sort);
        
        return services;
    }

    async count(filters){
        const count = await Service.countDocuments(filters)

        return count;
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
            { returnDocument: 'after', runValidators: true }
        );

        return service;
    }

    async delete(id) {
        const deleteService = await Service.findByIdAndDelete(id);
    
        return deleteService;
    }

}