// components/ToastifyClient.js
"use client";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastifyClient = ({ message }: any) => {
   useEffect(() => {
      if (message) {
         toast(message);
      }
   }, [message]);

   return <ToastContainer />;
};

export default ToastifyClient;
