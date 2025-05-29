// src/components/common/LoadingSpinner.jsx
import React from "react";

const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
      <svg
        className="w-8 h-8 animate-spin text-blue-600"
        viewBox="0 0 100 101"
        fill="none"
      >
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="currentColor"
          strokeWidth="10"
          className="opacity-40"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="currentColor"
          strokeWidth="10"
          strokeDasharray="250"
          strokeDashoffset="210"
          fill="none"
        />
      </svg>
      <span className="sr-only">Cargando...</span>
    </div>
  );

  export default LoadingSpinner;