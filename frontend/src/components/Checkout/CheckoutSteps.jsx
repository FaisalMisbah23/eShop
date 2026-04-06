import React from "react";

const CheckoutSteps = ({ active }) => {
  const steps = [
    { id: 1, name: "Shipping" },
    { id: 2, name: "Payment" },
    { id: 3, name: "Done" },
  ];

  return (
    <div
      className="border-b border-gray-200 bg-white py-5 sm:py-6"
      role="navigation"
      aria-label="Checkout progress"
    >
      <div className="mx-auto flex max-w-md items-center justify-center gap-2 px-4 sm:max-w-lg sm:gap-4">
        {steps.map((step, index) => {
          const isCurrent = active === step.id;
          const isDone = active > step.id;
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center text-center">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold tabular-nums ${
                    isDone || isCurrent
                      ? "border-[#4F8CFF] bg-[#4F8CFF] text-white"
                      : "border-gray-300 bg-white text-gray-500"
                  }`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {step.id}
                </span>
                <span
                  className={`mt-1.5 text-xs font-medium sm:text-sm ${
                    isCurrent ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 ? (
                <div
                  className={`mb-6 h-0.5 w-6 shrink-0 sm:mb-7 sm:w-12 ${
                    active > step.id ? "bg-[#4F8CFF]" : "bg-gray-200"
                  }`}
                  aria-hidden
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps;
