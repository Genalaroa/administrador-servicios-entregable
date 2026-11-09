import { ServicesService } from "../services/services.service.js";

const service = new ServicesService();

export const getServices = async (req, res) => {

    try {
        const category = req.query.category;  
        const available = req.query.available;  
        const page = req.query.page === undefined ? 1 : Number(req.query.page);
        const limit = req.query.limit === undefined ? 10 : Number(req.query.limit);
        const sortBy = req.query.sortBy || "price";
        const order = req.query.order || "asc";

        if (
            !Number.isInteger(page) ||
            page < 1
        ) {
            return res.status(400).json({
                error: "La página debe ser un número entero, mayor o igual a 1."
            });
        }

        if (
            !Number.isInteger(limit) ||
            limit < 1 ||
            limit > 100
        ) {
            return res.status(400).json({
                error: "El límite está entre 1 y 100."
            });
        }

        if (
            order !== "asc" &&
            order !== "desc"
        ) {
            return res.status(400).json({
                error: "El orden debe ser ascendente o descendente."
            });
        }

        const allowedSortFields = ["price", "name", "duration"];

        if (!allowedSortFields.includes(sortBy)) {
            return res.status(400).json({
                error: "Campo de ordenamiento no válido"
            });
        }

        if (available !== undefined && available !== "true" && available !== "false") {
            return res.status(400).json({
                error: "El parámetro available debe ser true o false."
            });
        }

        let services = await service.getServices(category, available, page, limit, sortBy, order);

        res.status(200).json(services);
    }catch(error){
        return res.status(500).json({
            error: error.message
    })}
};

export const getServiceById = async (req, res) => {   

    try {
        const id = req.params.sid;
        const foundService = await service.getServiceById(id);
        
        if (!foundService) {
        return res.status(404).json({
            error: "Servicio no encontrado"
        })}

        res.status(200).json(foundService);
        
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

export const createService = async (req, res) => {  
    
    try {
        const serviceData = req.body;
        const newService = await service.createService(serviceData);
        
        const io = req.app.get("io");
        io?.emit("serviceCreated", newService);

        res.status(201).json(newService);

    }catch (error) {
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

export const updateService = async (req, res) => {
    
    try {
        const id = req.params.sid;
        const updateData = req.body;
        const updatedService = await service.updateService(id, updateData);

        if (!updatedService) {
        return res.status(404).json({
            error: "Servicio no encontrado"
        })}

        res.status(200).json(updatedService);  

    }catch (error) {
        if (error.name === "CastError" || error.name === "ValidationError" || error.name === "Error") {
            return res.status(400).json({
            error: error.message
        })} 
        else {
            return res.status(500).json({
            error: error.message
        })}
    }  
};

export const deleteService = async (req, res) => {
    

    try {        
        const id = req.params.sid;
        const deletedService = await service.deleteService(id);  
        
        if (!deletedService) {
        return res.status(404).json({
            error: "Servicio no encontrado"
        })}

        const io = req.app.get("io");
        io?.emit("serviceDeleted", deletedService);

        res.status(200).json(deletedService);
        
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