import { ServicesService } from "../services/services.service.js";

const service = new ServicesService();

export const getServices = async (req, res) => {

    try {
        const category = req.query.category;  
        const available = req.query.available;  
        let services = await service.getServices(category, available);

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