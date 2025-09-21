const transactionService = require('../services/transactionService');

const getAllTransactions = async (req, res, next) => {
    try {
        const result = await transactionService.getAllTransactions(req.query);
        res.json(result);
    } catch (error) {
        next(error);
    }
}; 
const getCollectTransactions = async (req, res, next) => {
    try {
        const transactions = await transactionService.getCollectTransactions(req.params.collectId);
        res.json(transactions);
    } catch (error) {
        next(error);
    }
};  

const getGatewayTransactions = async (req, res, next) => {
    try {
        const transactions = await transactionService.getGatewayTransactions(req.params.gateway);
        res.json(transactions);
    } catch (error) {
        next(error);
    }
};  

const getCustomOrderTransactions = async (req, res, next) => {
    try {
        const transactions = await transactionService.getCustomeOrdrIdTransactions(req.params.customOrderId);
        res.json(transactions);
    } catch (error) {
        next(error);
    }
}; 

const getOrderAmountTransactions = async (req, res, next) => {
    try {
        const transactions = await transactionService.getOrderAmountTransactions(req.params.amount);
        res.json(transactions);
    } catch (error) {
        next(error);
    }
}; 

const getTransationAmountTransactions = async (req, res, next) => {
    try {
        const transactions = await transactionService.getTransationAmountTransactions(req.params.amount);
        res.json(transactions);
    } catch (error) {
        next(error);
    }
}; 

const getStatusTransactions = async (req, res,next) => {
    try {
        const transactions = await transactionService.getStatusTransactions(req.params.status);
        res.json(transactions);
    } catch (error) {
        next(error);
    }
};
    

const getSchoolTransactions = async (req, res, next) => {
    try {
        const transactions = await transactionService.getSchoolTransactions(req.params.schoolId);
        res.json(transactions);
    } catch (error) {
        next(error);
    }
};

const checkTransactionStatus = async (req, res, next) => {
    try {
        const transaction = await transactionService.checkTransactionStatus(req.params.customOrderId);
        res.json(transaction);
    } catch (error) {
        next(error);
    }
};

const createPaymentRequest = async (req, res, next) => {
    try {
        const result = await transactionService.createPaymentRequest(req.body);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const simulatePaymentRequest = async (req, res, next) => {
    try {
        const result = await transactionService.simulatePaymentRequest(req.body);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const checkPaymentGatewayStatus = async (req, res, next) => {
    try {
        const { collectRequestId, schoolId } = req.params;
        const result = await transactionService.checkPaymentGatewayStatus(collectRequestId, schoolId);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllTransactions,
    getCollectTransactions,
    getGatewayTransactions,
    getSchoolTransactions,
    checkTransactionStatus,
    checkPaymentGatewayStatus,
    createPaymentRequest,
    simulatePaymentRequest, 
    getCustomOrderTransactions,
    getOrderAmountTransactions,
    getTransationAmountTransactions,
    getStatusTransactions
};
