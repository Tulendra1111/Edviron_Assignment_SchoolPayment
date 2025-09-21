const mongoose = require('mongoose');

const collectRequestStatusSchema = new mongoose.Schema({
    collect_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CollectRequest', required: true, index: true },
    order_amount: { type: Number, required: true },
    transaction_amount: { type: Number },
    payment_mode: { type: String },
    payment_details: { type: String },
    bank_reference: { type: String },
    payment_message: { type: String },
    status: { 
        type: String, 
        enum: ['SUCCESS', 'PENDING', 'FAILED'],
        default: 'PENDING',
        index: true
    },
    error_message: { type: String },
    payment_time: { type: Date }
}, { 
    timestamps: true,
    collection: 'order_status' 
});

module.exports = mongoose.model('CollectRequestStatus', collectRequestStatusSchema);
