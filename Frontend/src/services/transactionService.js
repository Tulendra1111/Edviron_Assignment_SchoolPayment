import axios from "axios";
import { Base_url } from "../constants";

export const fetchTransactionsService = async ({ 
  status, 
  startDate, 
  endDate, 
  page = 1, 
  limit = 10, 
  school_id, 
  gateway, 
  sortBy = 'createdAt', 
  sortOrder = 'desc' 
}) => {
  const token = localStorage.getItem("token");
  try {
    const { data } = await axios.get(`${Base_url}/api/transactions`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: {
        status,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
        page,
        limit,
        school_id,
        gateway,
        sortBy,
        sortOrder
      },
    });
    return data; 
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const createPaymentService = async (paymentData) => {
  const token = localStorage.getItem("token");
  try {
    const { data } = await axios.post(`${Base_url}/api/create-payment`, paymentData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

export const simulatePaymentService = async (paymentData) => {
  const token = localStorage.getItem("token");
  try {
    const { data } = await axios.post(`${Base_url}/api/simulate-payment`, paymentData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error simulating payment:", error);
    throw error;
  }
};

export const checkTransactionStatusService = async (customOrderId) => {
  const token = localStorage.getItem("token");
  try {
    const { data } = await axios.get(`${Base_url}/api/transactions/status/${customOrderId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error checking transaction status:", error);
    throw error;
  }
};

export const getSchoolTransactionsService = async (schoolId) => {
  const token = localStorage.getItem("token");
  try {
    const { data } = await axios.get(`${Base_url}/api/transactions/${schoolId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error fetching school transactions:", error);
    throw error;
  }
};
