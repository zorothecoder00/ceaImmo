"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#333",
          color: "#fff",
          borderRadius: "8px",
          padding: "12px 16px",
        },
      }}
    />
  );
}
