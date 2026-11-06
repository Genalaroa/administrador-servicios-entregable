import test, { after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import "dotenv/config";

import { connectDB } from "../src/config/db.config.js";
import { ServicesService } from "../src/services/services.service.js";

const service = new ServicesService();

await connectDB();

const testService = await service.createService({
    name: "Servicio de prueba",
    description: "Descripción del servicio de prueba",
    duration: 30,
    price: 20,
    category: "Pruebas",
    available: true
});

const existingServiceId = testService._id.toString();
const invalidServiceId = new mongoose.Types.ObjectId().toString();

after(async () => {
    await mongoose.connection.close();
});

test("getServices devuelve un array", async () => {
    const services = await service.getServices();

    assert.ok(Array.isArray(services.services));
});

test("getServiceById devuelve un servicio existente", async () => {
    const serviceFound = await service.getServiceById(existingServiceId);

    assert.ok(serviceFound);
    assert.strictEqual(serviceFound._id.toString(), existingServiceId);
});

test("getServiceById devuelve null si el servicio no existe", async () => {
    const serviceFound = await service.getServiceById(invalidServiceId);

    assert.strictEqual(serviceFound, null);
});

test("getServices devuelve al menos un servicio", async () => {
    const services = await service.getServices();

    assert.ok(services.services.length > 0);
});

test("createService rechaza un precio negativo", async () => {
    await assert.rejects(
        service.createService({
            name: "Prueba",
            description: "Servicio de prueba",
            duration: 30,
            price: -10,
            category: "Pruebas",
            available: true
        }),
        /El precio debe ser un número mayor que 0/
    );
});

test("createService rechaza una duración negativa", async () => {
    await assert.rejects(
        service.createService({
            name: "Prueba",
            description: "Servicio de prueba",
            duration: -30,
            price: 10,
            category: "Pruebas",
            available: true
        }),
        /La duración debe ser un número mayor que 0/
    );
});

test("updateService rechaza un precio negativo", async () => {
    await assert.rejects(
        service.updateService(existingServiceId, { price: -10 }),
        /El precio debe ser un número mayor que 0/
    );
});