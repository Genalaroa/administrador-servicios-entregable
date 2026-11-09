
import test from "node:test";
import assert from "node:assert/strict";

import { ServicesService } from "../src/services/services.service.js";
import {
    createService,
    deleteService
} from "../src/controllers/services.controller.js";

test("createService emite el evento serviceCreated", async (t) => {

    const newService = {
        _id: "123",
        name: "Servicio de prueba",
        price: 20
    };

    t.mock.method(
        ServicesService.prototype,
        "createService",
        async () => newService
    );

    let emittedEvent;

    const req = {
        body: newService,
        app: {
            get: () => ({
                emit: (event, data) => {
                    emittedEvent = { event, data };
                }
            })
        }
    };

    const res = {
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(data) {
            this.body = data;
            return this;
        }
    };

    await createService(req, res);

    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(emittedEvent.event, "serviceCreated");
    assert.deepStrictEqual(emittedEvent.data, newService);
});

test("deleteService emite el evento serviceDeleted", async (t) => {

    const deletedService = {
        _id: "123",
        name: "Servicio de prueba",
        price: 20
    };

    t.mock.method(
        ServicesService.prototype,
        "deleteService",
        async () => deletedService
    );

    let emittedEvent;

    const req = {
        params: { sid: "123" },
        app: {
            get: () => ({
                emit: (event, data) => {
                    emittedEvent = { event, data };
                }
            })
        }
    };

    const res = {
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(data) {
            this.body = data;
            return this;
        }
    };

    await deleteService(req, res);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(emittedEvent.event, "serviceDeleted");
    assert.deepStrictEqual(emittedEvent.data, deletedService);
});
