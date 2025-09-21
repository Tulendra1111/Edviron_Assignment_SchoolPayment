const transactionService = require('../services/transactionService');

const handleWebhook = async (req, res) => {
    try {
        const webhookData = req.body;
        
        if (!webhookData.status || !webhookData.order_info) {
            return res.status(400).json({
                success: false,
                message: 'Invalid webhook payload'
            });
        }

        const result = await transactionService.handleWebhook(webhookData);
        
        res.status(200).json({
            success: true,
            message: 'Webhook processed successfully',
            data: result
        });
    } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error processing webhook'
        });
    }
};


const updateTransactionStatus = async (req, res) => {
    try {
        const { 
            transactionId, 
            status, 
            payment_method, 
            bank_refrence  
        } = req.body;

        if (!transactionId || !status) {
            return res.status(400).json({
                success: false,
                message: 'Transaction ID and status are required'
            });
        }

        const validStatuses = ['SUCCESS', 'PENDING', 'FAILED'];
        if (!validStatuses.includes(status.toUpperCase())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be SUCCESS, PENDING, or FAILED'
            });
        }

        const result = await transactionService.updateTransactionStatus({
            transactionId,
            status,
            payment_method,
            bank_refrence
        });

        res.status(200).json({
            success: true,
            message: 'Transaction status updated successfully',
            data: result
        });
    } catch (error) {
        console.error('Status update error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating transaction status'
        });
    }
};

module.exports = {
    handleWebhook,
    updateTransactionStatus
};