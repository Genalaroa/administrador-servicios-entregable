import {z} from "zod";

export const createServiceSchema =  z.object({

        name: z.string().min(3, "Mínimo 3 caracteres"),
        description: z.string().min(10, "Mínimo 10 caracteres"),
        duration: z.number().positive(),
        price: z.number().positive(),
        category: z.string(),
        available: z.boolean()
})

export const updateServiceSchema =  z.object({

        name: z.string().min(3).optional(),
        description: z.string().min(10).optional(),
        duration: z.number().positive().optional(),
        price: z.number().positive().optional(),
        category: z.string().optional(),
        available: z.boolean().optional()
})
