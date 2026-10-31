import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    clientEmail: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true,   
    },
    time: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        trim: true   
    },
    services: [
    {
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }
    ]
}, {
    timestamps: true
});

export default mongoose.model('Booking', bookingSchema);
