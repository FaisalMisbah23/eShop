import React from "react";

const CheckoutSteps = ({ active }) => {
  const steps = [
    { id: 1, name: "Shipping", icon: "🚚" },
    { id: 2, name: "Payment", icon: "💳" },
    { id: 3, name: "Success", icon: "✅" }
  ];

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-2xl flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-300 ${
                  active >= step.id
                    ? "bg-[#4F8CFF] text-white shadow-lg"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.icon}
              </div>
              <span
                className={`text-sm font-medium mt-2 transition-colors duration-300 ${
                  active >= step.id ? "text-[#4F8CFF]" : "text-gray-500"
                }`}
              >
                {step.name}
              </span>
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-1 mx-4 transition-all duration-300 ${
                  active > step.id ? "bg-[#4F8CFF]" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutSteps;
