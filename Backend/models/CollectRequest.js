const mongoose = require('mongoose');

const collectRequestSchema = new mongoose.Schema({
    school_id: { type: String, required: true, index: true },
    trustee_id: { type: String, required: true },
    student_info: {
        name: { type: String, required: true },
        id: { type: String, required: true },
        email: { type: String, required: true }
    },
    gateway_name: { type: String, required: true },
    order_amount: { type: Number, required: true },
    custom_order_id: { type: String, required: true, unique: true, index: true },
    collect_request_id: { type: String }, // From payment gateway response
    collect_request_url: { type: String } // From payment gateway response
}, { 
    timestamps: true,
    collection: 'orders' 
});

module.exports = mongoose.model('CollectRequest', collectRequestSchema);