import React, { useState } from "react";
import { motion } from "framer-motion";
import { QrCode, Utensils, Clock, CheckCircle } from "lucide-react";
export function SelfOrderQR() {
  const menuItems = [
    {
      name: "Avocado Toast",
      price: 12,
    },
    {
      name: "Flat White",
      price: 4.5,
    },
    {
      name: "House Granola",
      price: 8,
    },
  ];
  const [itemCounts, setItemCounts] = useState([0, 0, 0]);
  const steps = [
    {
      icon: <QrCode className="w-5 h-5" />,
      title: "Scan QR Code",
      desc: "Guests scan the code on their table.",
    },
    {
      icon: <Utensils className="w-5 h-5" />,
      title: "Browse Digital Menu",
      desc: "View photos, descriptions, and allergens.",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Place Order",
      desc: "Order is sent directly to the KDS.",
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Pay & Track",
      desc: "Pay via phone and track prep status.",
    },
  ];

  const totalItems = itemCounts.reduce((sum, count) => sum + count, 0);
  const totalPrice = itemCounts.reduce(
    (sum, count, index) => sum + count * menuItems[index].price,
    0,
  );
  const addItem = (index: number) => {
    setItemCounts((currentCounts) =>
      currentCounts.map((count, countIndex) =>
        countIndex === index ? count + 1 : count,
      ),
    );
  };
  const handleViewOrder = () => {
    document.querySelector("#demo")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  return (
    <section className="py-24 bg-white overflow-hidden" id="self-ordering">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Phone Mockup */}
          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
            }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Decorative Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-50 rounded-full blur-3xl -z-10"></div>

            {/* Phone Frame */}
            <div className="relative w-[280px] h-[580px] bg-gray-900 rounded-[3rem] p-3 shadow-float border-4 border-gray-800 z-10">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-20"></div>

              {/* Screen */}
              <div className="w-full h-full bg-gray-50 rounded-[2.25rem] overflow-hidden flex flex-col relative">
                {/* Header Image */}
                <div className="h-40 bg-brand-100 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-topic font-bold text-lg">
                      The Corner Cafe
                    </h3>
                    <p className="text-xs opacity-90">Table 12</p>
                  </div>
                </div>

                {/* Menu Categories */}
                <div className="flex gap-2 overflow-x-auto p-4 hide-scrollbar bg-white border-b border-gray-100">
                  {["Popular", "Coffee", "Pastries", "Mains"].map((cat, i) => (
                    <div
                      key={cat}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${i === 0 ? "bg-brand text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                      {cat}
                    </div>
                  ))}
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                  {menuItems.map((item, index) => (
                    <div
                      key={item.name}
                      className="flex gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-lg"></div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-topic text-sm font-semibold text-gray-900">
                            Avocado Toast
                          </h4>
                          <p className="text-[10px] text-gray-500 line-clamp-2">
                            Sourdough, poached egg, chili flakes
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm font-bold text-brand">
                            ${item.price.toFixed(2)}
                          </span>
                          <button
                            type="button"
                            className="w-6 h-6 rounded-full bg-brand-50 text-brand flex items-center justify-center text-lg leading-none pb-0.5"
                            onClick={() => addItem(index)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Bar */}
                <button
                  type="button"
                  onClick={handleViewOrder}
                  className="absolute bottom-4 left-4 right-4 bg-brand text-white rounded-2xl p-4 shadow-lg flex justify-between items-center text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                      {totalItems}
                    </div>
                    <span className="font-semibold text-sm">View Order</span>
                  </div>
                  <span className="font-bold">${totalPrice.toFixed(2)}</span>
                </button>
              </div>
            </div>

            {/* Floating QR Code */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.5,
                duration: 0.5,
              }}
              className="absolute -left-8 top-1/4 bg-white p-4 rounded-2xl shadow-card border border-gray-100 z-20"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                <QrCode className="w-10 h-10 text-gray-800" />
              </div>
              <div className="text-center text-xs font-bold text-gray-800">
                Scan to Order
              </div>
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{
              opacity: 0,
              x: 40,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
            }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 text-brand text-xs font-semibold uppercase tracking-wider mb-6">
              Self-Service Ordering
            </div>
            <h2 className="font-topic text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
              Turn every table into a point of sale.
            </h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Empower your guests to order and pay at their own pace. Increase
              table turnover, boost average order value, and free up your staff
              to focus on hospitality rather than taking orders.
            </p>

            <div className="flex flex-col gap-6">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand shrink-0 mt-1">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="font-topic text-lg font-semibold text-gray-900 mb-1">
                      {step.title}
                    </h4>
                    <p className="text-gray-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
