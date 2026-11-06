import {z} from "zod";

export const createBookingSchema = z.object({
    clientName: z.string().min(3, "Mínimo 3 caracteres"),
    clientEmail: z.email(),
    date: z.coerce.date(),
    time: z.string().min(1),
    status: z.string().min(1),
    services: z.array(
    z.object({
        service: z.string().regex(/^[0-9a-fA-F]{24}$/),
        quantity: z.number().int().positive()
    })
).optional()
});


export const addServiceToBookingSchema = z.object({
    quantity: z.number().int().positive()
});