
import test from "node:test";
import assert from "node:assert/strict";
import { ServicesService } from "../src/services/services.service.js";

const mockServices = [];

const mockRepository = {
    getAll: async (filters) => {
        return mockServices.filter(service =>
            (!filters.category || service.category === filters.category) &&
            (filters.available === undefined || service.available === filters.available)
        );
    },

    count: async (filters) => {
        return mockServices.filter(service =>
            (!filters.category || service.category === filters.category) &&
            (filters.available === undefined || service.available === filters.available)
        ).length;
    },

    getById: async (id) =>
        mockServices.find(service => service._id === id) ?? null,

    create: async (data) => {
        const newService = { _id: "1", ...data };
        mockServices.push(newService);
        return newService;
    },

    update: async (id, data) => {
        const index = mockServices.findIndex(service => service._id === id);

        if (index === -1) return null;

        mockServices[index] = { ...mockServices[index], ...data };

        return mockServices[index];
    },

    delete: async () => true
};

const service = new ServicesService(mockRepository);

await service.createService({
    name: "Servicio de prueba",
    description: "Descripción del servicio de prueba",
    duration: 30,
    price: 20,
    category: "Pruebas",
    available: true
});

await service.createService({
    name: "Corte de pelo",
    description: "Servicio de peluquería",
    duration: 45,
    price: 15,
    category: "Peluquería",
    available: false
});

const existingServiceId = "1";
const invalidServiceId = "999";

test("getServices devuelve un array", async () => {
    const result = await service.getServices(
        undefined, undefined, 1, 10, "name", "asc"
    );

    assert.ok(Array.isArray(result.services));
});

test("getServiceById devuelve un servicio existente", async () => {
    const serviceFound = await service.getServiceById(existingServiceId);

    assert.ok(serviceFound);
    assert.strictEqual(serviceFound._id, existingServiceId);
});

test("getServiceById devuelve null si el servicio no existe", async () => {
    const serviceFound = await service.getServiceById(invalidServiceId);

    assert.strictEqual(serviceFound, null);
});

test("getServices devuelve al menos un servicio", async () => {
    const result = await service.getServices(
        undefined, undefined, 1, 10, "name", "asc"
    );

    assert.ok(result.services.length > 0);
});

test("getServices filtra por categoría", async () => {
    const result = await service.getServices(
        "Peluquería", undefined, 1, 10, "name", "asc"
    );

    assert.ok(result.services.every(item => item.category === "Peluquería"));
});

test("getServices filtra por disponibilidad", async () => {
    const result = await service.getServices(
        undefined, "true", 1, 10, "name", "asc"
    );

    assert.ok(result.services.every(item => item.available === true));
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
