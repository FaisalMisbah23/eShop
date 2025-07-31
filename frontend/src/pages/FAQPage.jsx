import React, { useState } from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import styles from "../styles/styles";

const FAQPage = () => {
    return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F8FF] via-[#A0C1FF] to-[#4F8CFF]">
            <Header activeHeading={5} />
      {/* Hero Section */}
      <div className="w-full py-12 px-4 flex flex-col items-center justify-center bg-gradient-to-r from-[#4F8CFF] to-[#A0C1FF]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 text-center drop-shadow-lg">Frequently Asked Questions</h1>
        <p className="text-white text-lg sm:text-xl text-center max-w-2xl">Find answers to the most common questions about shopping on eShopZone.</p>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-10">
            <Faq />
      </div>
            <Footer />
        </div>
    );
};

const Faq = () => {
    const [activeTab, setActiveTab] = useState(0);

    const toggleTab = (tab) => {
        if (activeTab === tab) {
            setActiveTab(0);
        } else {
            setActiveTab(tab);
        }
    };

  const faqs = [
    {
      q: "What is your return policy?",
      a: "If you're not satisfied with your purchase, we accept returns within 30 days of delivery. To initiate a return, please email us at support@eshopzone.com with your order number and a brief explanation of why you're returning the item.",
    },
    {
      q: "How do I track my order?",
      a: "You can track your order by clicking the tracking link in your shipping confirmation email, or by logging into your account on our website and viewing the order details.",
    },
    {
      q: "How do I contact customer support?",
      a: "You can contact our customer support team by emailing us at support@eshopzone.com, or by calling us at (555) 123-4567 between the hours of 9am and 5pm EST, Monday through Friday.",
    },
    {
      q: "Can I change or cancel my order?",
      a: "Unfortunately, once an order has been placed, we are not able to make changes or cancellations. If you no longer want the items you've ordered, you can return them for a refund within 30 days of delivery.",
    },
    {
      q: "Do you offer international shipping?",
      a: "Currently, we only offer shipping within the United States.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept Visa, Mastercard, PayPal, and also offer cash on delivery.",
    },
  ];

    return (
    <div className="space-y-4">
      {faqs.map((faq, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow p-4">
                    <button
            className="flex items-center justify-between w-full focus:outline-none"
            onClick={() => toggleTab(idx + 1)}
                    >
            <span className="text-lg font-medium text-gray-900 text-left">
              {faq.q}
                        </span>
            {activeTab === idx + 1 ? (
              <svg className="h-6 w-6 text-[#4F8CFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        )}
                    </button>
          {activeTab === idx + 1 && (
                        <div className="mt-4">
              <p className="text-base text-gray-600">{faq.a}</p>
                        </div>
                    )}
                </div>
      ))}
        </div>
    );
};

export default FAQPage;