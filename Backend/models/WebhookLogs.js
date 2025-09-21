const mongoose = require('mongoose');

const webhookLogsSchema = new mongoose.Schema({
    event_type: { type: String, required: true },
    payload: { type: mongoose.Schema.Types.Mixed, required: true },
    status: { 
        type: String, 
        enum: ['SUCCESS', 'FAILED', 'PROCESSING'],
        default: 'PROCESSING'
    },
    error_message: { type: String },
    processed_at: { type: Date, default: Date.now },
    collect_request_id: { type: String },
    order_id: { type: String }
}, { 
    timestamps: true,
    collection: 'webhook_logs' 
});

module.exports = mongoose.model('WebhookLogs', webhookLogsSchema);
