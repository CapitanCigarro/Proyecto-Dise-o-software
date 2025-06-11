// Base URL for all API requests
const API_URL = 'http://192.168.50.19:3007/api'; //Reemplaza http://TU_IP:3007/api

// Central function for making HTTP requests to the backend API
export const apiRequest = async (
  endpoint: string,
  method: string = 'GET',
  data: any = null,
  headers: Record<string, string> = {}
) => {
  const url = `${API_URL}${endpoint}`;
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const responseData = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: responseData.message || 'Ha ocurrido un error',
        data: responseData
      };
    }

    return responseData;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};