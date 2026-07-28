import React from "react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-100 flex flex-col items-center justify-center z-[9999]">
      {/* Logo */}
      <div className="bg-white rounded-3xl shadow-xl p-5 border border-gray-200">
        <img
          src="/log-guru.png"
          alt="Gurukrupa Enterprises"
          className="w-40 h-auto object-contain animate-pulse"
        />
      </div>

      {/* Company Name */}
      <h1 className="mt-6 text-2xl font-bold text-[#1a6fc4]">
        Gurukrupa Enterprises
      </h1>

      <p className="text-gray-500 mt-2">
        Office Automation Solutions
      </p>

      {/* Loading Bar */}
      <div className="mt-8 w-72 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="loading-bar h-full rounded-full"></div>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Loading Admin Panel...
      </p>
    </div>
  );
}