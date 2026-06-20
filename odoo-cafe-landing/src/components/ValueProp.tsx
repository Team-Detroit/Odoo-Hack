import React from "react";
import { motion } from "framer-motion";
import {
  Zap,
  CheckCircle2,
  ChefHat,
  CreditCard,
  BarChart3,
} from "lucide-react";
export function ValueProp() {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-brand" />,
      title: "Lightning Fast Service",
      description:
        "Optimized interface for high-volume cafes. Take orders in seconds with a streamlined touch UI.",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-teal" />,
      title: "Zero Order Errors",
      description:
        "Direct integration from POS to Kitchen Display eliminates miscommunications and lost paper tickets.",
    },
    {
      icon: <ChefHat className="w-6 h-6 text-brand" />,
      title: "Kitchen Coordination",
      description:
        "Real-time ticket routing and status tracking keeps your back-of-house perfectly synced.",
    },
    {
      icon: <CreditCard className="w-6 h-6 text-teal" />,
      title: "Seamless Payments",
      description:
        "Accept cash, cards, and UPI QR instantly. Split bills and manage tips with a single tap.",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-brand" />,
      title: "Actionable Insights",
      description:
        "Track top-selling items, peak hours, and employee performance with built-in reporting.",
    },
  ];

  return (
    <section className="py-24 bg-white relative" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-topic text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Everything you need to run a better cafe.
          </h2>
          <p className="text-lg text-gray-600">
            Odoo Cafe POS replaces disconnected tools with one unified platform,
            designed specifically for the speed of the hospitality industry.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
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
                margin: "-50px",
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className="bg-offwhite rounded-3xl p-8 border border-gray-100 hover:shadow-card transition-shadow"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 border border-gray-100">
                {feature.icon}
              </div>
              <h3 className="font-topic text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
