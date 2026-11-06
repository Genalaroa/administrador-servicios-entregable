import { Router } from "express";
import { createBooking, addServiceToBooking, getBookingById } from "../controllers/bookings.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {createBookingSchema, addServiceToBookingSchema} from "../validators/booking.validator.js";

const router = Router();

router.post("/", validate(createBookingSchema),createBooking);
router.get("/:bid", getBookingById);
router.post("/:bid/services/:sid", validate(addServiceToBookingSchema), addServiceToBooking);

export default router;  