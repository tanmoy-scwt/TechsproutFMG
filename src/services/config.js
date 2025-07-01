'use client';

import axios from 'axios';
import Cookies from 'js-cookie'; // For fallback if needed
import { getSession } from 'next-auth/react'; // Import from next-auth

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Public Axios Instance
 */
const apiClientPublic = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": 'application/json'
  }
});

/**
 * Private Axios Instance
 * Automatically includes the `Authorization` header with the token from NextAuth's session.
 */
const apiClientPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": 'application/json'
  }
});

// Add a request interceptor to attach the token to requests
apiClientPrivate.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession(); // Retrieve session using NextAuth
      const token = session?.user?.token; // Token from session

      if (token) {
        console.log("Token from NextAuth session: ", token);
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Fallback: Try retrieving token from cookies
        const cookieToken = Cookies.get('authToken');
        if (cookieToken) {
          console.log("Token from cookies: ", cookieToken);
          config.headers.Authorization = `Bearer ${cookieToken}`;
        } else {
          console.log("No token found in session or cookies.");
        }
      }
    } catch (error) {
      console.error("Error retrieving session or token: ", error);
    }

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Optionally, add a response interceptor

export { apiClientPublic, apiClientPrivate };
