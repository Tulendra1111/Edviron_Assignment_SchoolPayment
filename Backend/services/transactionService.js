const CollectRequest = require('../models/CollectRequest');
const CollectRequestStatus = require('../models/CollectRequestStatus');
const axios = require('axios'); 
require('dotenv').config();

const getAllTransactions = async (filters = {}) => {
    const {
        page = 1,
        limit = 10,
        status,
        school_id,
        gateway,
        startDate,
        endDate,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = filters;

    // Build query for CollectRequest
    const requestQuery = {};
    if (school_id) requestQuery.school_id = school_id;
    if (gateway) requestQuery.gateway_name = gateway;
    if (startDate || endDate) {
        requestQuery.createdAt = {};
        if (startDate) requestQuery.createdAt.$gte = new Date(startDate);
        if (endDate) requestQuery.createdAt.$lte = new Date(endDate);
    }

    // Build query for CollectRequestStatus
    const statusQuery = {};
    if (status) statusQuery.status = status;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalRequests = await CollectRequest.countDocuments(requestQuery);
    const totalPages = Math.ceil(totalRequests / limit);

    // Get collect requests with pagination and sorting
    const collectRequests = await CollectRequest.find(requestQuery)
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(parseInt(limit));

    // Get status for each request
    const transactions = await Promise.all(
        collectRequests.map(async (request) => {
            const status = await CollectRequestStatus.findOne({ 
                collect_id: request._id, 
                ...statusQuery 
            });
            return status ? mergeTransactionData(request, status) : mergeTransactionData(request, null);
        })
    );

    return {
        transactions: transactions.filter(Boolean),
        pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalItems: totalRequests,
            itemsPerPage: parseInt(limit),
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    };
}; 

const getCollectTransactions = async (collectId) => {
    const status = await CollectRequestStatus.findOne({ collect_id: collectId });
    if (!status) throw new Error('Transaction not found');

    const request = await CollectRequest.findById(collectId);
    if (!request) throw new Error('CollectRequest not found');

    return mergeTransactionData(request, status);
};

const getGatewayTransactions = async (gateway) => {
    const requests = await CollectRequest.find({ gateway });
    return Promise.all(
        requests.map(async (request) => {
            const status = await CollectRequestStatus.findOne({ gateway: request.gateway});
            return mergeTransactionData(request, status);
        })
    );
}; 

const getOrderAmountTransactions = async (orderAmount) => {
    const requests = await CollectRequest.find({ order_amount: orderAmount });
    return Promise.all(
        requests.map(async (request) => {
            const status = await CollectRequestStatus.findOne({ order_amount: request.order_amount});
            return mergeTransactionData(request, status);
        })
    );
}; 

const getTransationAmountTransactions = async (transactionAmount) => {
    const data = await CollectRequestStatus.find({ transaction_amount: transactionAmount }); 
    if (!data.length) return []; 
    
    return data

    
};

const getStatusTransactions = async (status) => {
    const statusRecords = await CollectRequestStatus.find({ status });
    if (!statusRecords.length) return []; 

    const collectIds = statusRecords.map((record) => record.collect_id);

    const collectRequests = await CollectRequest.find({ _id: { $in: collectIds } });

    return collectRequests.map((request) => {
        const status = statusRecords.find((s) => s.collect_id === request._id.toString());
        return mergeTransactionData(request, status);
    });
};

const getCustomeOrdrIdTransactions = async (customOrderId) => {
    const requests = await CollectRequest.find({ custom_order_id: customOrderId });
    return Promise.all(
        requests.map(async (request) => {
            const status = await CollectRequestStatus.findOne({ collect_id: request._id.toString() });
            return mergeTransactionData(request, status);
        })
    );
};

const getSchoolTransactions = async (schoolId) => {
    const collectRequests = await CollectRequest.find({ school_id: schoolId });
    return Promise.all(
        collectRequests.map(async (request) => {
            const status = await CollectRequestStatus.findOne({ collect_id: request._id.toString() });
            return mergeTransactionData(request, status);
        })
    );
}; 

const checkTransactionStatus = async (customOrderId) => {
    const request = await CollectRequest.findOne({ custom_order_id: customOrderId });
    if (!request) throw new Error('Transaction not found');

    const status = await CollectRequestStatus.findOne({ collect_id: request._id });
    return mergeTransactionData(request, status);
};

const checkPaymentGatewayStatus = async (collectRequestId, schoolId) => {
    const jwt = require('jsonwebtoken');
    
    // Generate JWT signature for status check
    const jwtPayload = {
        school_id: schoolId,
        collect_request_id: collectRequestId
    };
    
    const sign = jwt.sign(jwtPayload, process.env.PG_KEY);

    try {
        const response = await axios.get(
            `https://dev-vanilla.edviron.com/erp/collect-request/${collectRequestId}?school_id=${schoolId}&sign=${sign}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        throw new Error(`Payment gateway status check error: ${error.response?.data?.message || error.message}`);
    }
};

const createPaymentRequest = async (data) => {
    const jwt = require('jsonwebtoken');
    
    // Create order in database first
    const collectRequest = await CollectRequest.create({
        school_id: data.school_id,
        trustee_id: data.trustee_id,
        student_info: data.student_info,
        gateway_name: 'CASHFREE',
        order_amount: data.amount,
        custom_order_id: `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }); 

    // Generate JWT signature for payment gateway
    const jwtPayload = {
        school_id: data.school_id,
        amount: data.amount.toString(),
        callback_url: data.callback_url || `${process.env.FRONTEND_URL}/payment-callback`
    };
    
    const sign = jwt.sign(jwtPayload, process.env.PG_KEY);

    const payload = {
        school_id: data.school_id, 
        amount: data.amount.toString(),
        callback_url: data.callback_url || `${process.env.FRONTEND_URL}/payment-callback`,
        sign: sign
    };

    try {
    const response = await axios.post(
        'https://dev-vanilla.edviron.com/erp/create-collect-request',
        payload,
        {
            headers: {
                Authorization: `Bearer ${process.env.API_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    ); 

        // Update order with payment gateway response
        await CollectRequest.findByIdAndUpdate(collectRequest._id, {
            collect_request_id: response.data.collect_request_id,
            collect_request_url: response.data.Collect_request_url
        });

        // Create initial status record
    await CollectRequestStatus.create({
        collect_id: collectRequest._id,
            order_amount: data.amount,
        status: 'PENDING', 
            payment_time: null
        });

        return {
            success: true,
            collect_id: collectRequest._id,
            collect_request_id: response.data.collect_request_id,
            payment_url: response.data.Collect_request_url,
            custom_order_id: collectRequest.custom_order_id
        };
    } catch (error) {
        // Clean up the created order if payment gateway call fails
        await CollectRequest.findByIdAndDelete(collectRequest._id);
        throw new Error(`Payment gateway error: ${error.response?.data?.message || error.message}`);
    }
};

const simulatePaymentRequest = async (data) => {
    // Create order in database for simulation
    const collectRequest = await CollectRequest.create({
        school_id: data.school_id,
        trustee_id: data.trustee_id,
        student_info: data.student_info,
        gateway_name: 'SIMULATION',
        order_amount: data.amount,
        custom_order_id: `SIM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        collect_request_id: `SIM_REQ_${Date.now()}`,
        collect_request_url: '#'
    }); 

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const paymentStatus = data.payment_status || 'SUCCESS';
    const paymentMethod = data.payment_method || 'credit_card';
    
    // Map payment method IDs to display names
    const paymentMethodNames = {
        'credit_card': 'Credit Card (Simulated)',
        'debit_card': 'Debit Card (Simulated)',
        'net_banking': 'Net Banking (Simulated)',
        'upi': 'UPI (Simulated)',
        'wallet': 'Digital Wallet (Simulated)'
    };

    // Create status record based on selected status
    const statusData = {
        collect_id: collectRequest._id,
        order_amount: data.amount,
        payment_mode: paymentMethodNames[paymentMethod] || 'Credit Card (Simulated)',
        payment_details: `Simulated ${paymentMethod} payment for testing purposes`,
        bank_reference: `SIM_REF_${Date.now()}`,
        status: paymentStatus,
        payment_time: paymentStatus === 'SUCCESS' ? new Date() : null
    };

    // Add different messages based on status
    if (paymentStatus === 'SUCCESS') {
        statusData.transaction_amount = data.amount;
        statusData.payment_message = 'Payment simulated successfully';
    } else if (paymentStatus === 'PENDING') {
        statusData.payment_message = 'Payment is being processed';
        statusData.error_message = null;
    } else if (paymentStatus === 'FAILED') {
        statusData.payment_message = 'Payment simulation failed';
        statusData.error_message = 'Simulated payment failure for testing';
    }

    await CollectRequestStatus.create(statusData);

    return {
        success: true,
        collect_id: collectRequest._id,
        collect_request_id: collectRequest.collect_request_id,
        payment_url: '#',
        custom_order_id: collectRequest.custom_order_id,
        status: paymentStatus,
        payment_method: paymentMethodNames[paymentMethod] || 'Credit Card (Simulated)',
        transaction_id: `SIM_TXN_${Date.now()}`,
        amount: data.amount,
        payment_message: statusData.payment_message,
        error_message: statusData.error_message
    };
};

const handleWebhook = async (data) => {
    const WebhookLogs = require('../models/WebhookLogs');
    
    try {
        // Log webhook event
        const webhookLog = await WebhookLogs.create({
            event_type: 'payment_webhook',
            payload: data,
            status: 'PROCESSING',
            order_id: data.order_info?.order_id
        });

        const { order_info } = data;

        if (!order_info || !order_info.order_id) {
            await WebhookLogs.findByIdAndUpdate(webhookLog._id, {
                status: 'FAILED',
                error_message: 'Invalid webhook payload: Missing order_info or order_id'
            });
            throw new Error('Invalid webhook payload: Missing order_info or order_id');
        }

        const existingTransaction = await CollectRequest.findOne({
            custom_order_id: order_info.order_id
        });

        if (!existingTransaction) {
            await WebhookLogs.findByIdAndUpdate(webhookLog._id, {
                status: 'FAILED',
                error_message: `Transaction with ID ${order_info.order_id} not found`
            });
            throw new Error(`Transaction with ID ${order_info.order_id} not found`);
        }

        const updatedStatus = await CollectRequestStatus.findOneAndUpdate(
            { collect_id: existingTransaction._id },
            {
                status: data.status === 200 ? 'SUCCESS' : 'FAILED',
                payment_mode: order_info.payment_method,
                transaction_amount: order_info.transaction_amount,
                bank_reference: order_info.bank_reference,
                payment_message: order_info.payment_message,
                payment_time: new Date(),
                error_message: data.status !== 200 ? order_info.error_message : null
            },
            { upsert: true, new: true }
        );

        // Update webhook log as successful
        await WebhookLogs.findByIdAndUpdate(webhookLog._id, {
            status: 'SUCCESS',
            collect_request_id: existingTransaction.collect_request_id
        });

        return updatedStatus;
    } catch (error) {
        console.error('Error handling webhook:', error);
        
        // Update webhook log as failed
        if (webhookLog) {
            await WebhookLogs.findByIdAndUpdate(webhookLog._id, {
                status: 'FAILED',
                error_message: error.message
            });
        }
        
        throw error;
    }
};



const updateTransactionStatus = async (data) => {
    try {
        const { transactionId, status, payment_method, bank_refrence } = data;

        const existingTransaction = await CollectRequest.findOne({
            custom_order_id: transactionId
        });

        if (!existingTransaction) {
            throw new Error(`Transaction with ID ${transactionId} not found`);
        }

        const updatedStatus = await CollectRequestStatus.findOneAndUpdate(
            { collect_id: existingTransaction._id.toString() },
            {
                status: status.toUpperCase(),
                ...(payment_method && { payment_method }),
                gateway: existingTransaction.gateway, 
                ...(bank_refrence && { bank_refrence })
            },
            { upsert: true, new: true }
        );

        return updatedStatus;
    } catch (error) {
        console.error('Error updating transaction status:', error);
        throw error;
    }
};








const mergeTransactionData = (request, status) => ({
    collect_id: request._id,
    school_id: request.school_id,
    trustee_id: request.trustee_id,
    student_info: request.student_info,
    gateway: request.gateway_name,
    order_amount: request.order_amount,
    transaction_amount: status?.transaction_amount,
    status: status?.status || 'PENDING',
    custom_order_id: request.custom_order_id,
    payment_mode: status?.payment_mode,
    bank_reference: status?.bank_reference,
    payment_message: status?.payment_message,
    error_message: status?.error_message,
    payment_time: status?.payment_time,
    created_at: request.createdAt,
    collect_request_id: request.collect_request_id,
    collect_request_url: request.collect_request_url
});

module.exports = {
    getAllTransactions,
    getCollectTransactions,
    getGatewayTransactions,
    getOrderAmountTransactions,
    getTransationAmountTransactions,
    getStatusTransactions,
    getCustomeOrdrIdTransactions,
    getSchoolTransactions,
    checkTransactionStatus,
    checkPaymentGatewayStatus,
    createPaymentRequest,
    simulatePaymentRequest,
    handleWebhook,
    updateTransactionStatus
};
