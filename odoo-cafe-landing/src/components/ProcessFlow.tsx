import React from "react";
import { motion } from "framer-motion";
import {
  KeyRound,
  Users,
  ShoppingCart,
  ChefHat,
  CreditCard,
  Receipt,
  BarChart,
} from "lucide-react";
export function ProcessFlow() {
  const steps = [
    {
      icon: <KeyRound className="w-5 h-5" />,
      title: "Open Session",
      desc: "Start shift with opening float",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Select Table",
      desc: "Assign guests to a floor plan",
    },
    {
      icon: <ShoppingCart className="w-5 h-5" />,
      title: "Take Order",
      desc: "Add items and modifiers",
    },
    {
      icon: <ChefHat className="w-5 h-5" />,
      title: "To Kitchen",
      desc: "Auto-route to prep stations",
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: "Payment",
      desc: "Split bills or pay in full",
    },
    {
      icon: <Receipt className="w-5 h-5" />,
      title: "Receipt",
      desc: "Print or email to customer",
    },
    {
      icon: <BarChart className="w-5 h-5" />,
      title: "Reports",
      desc: "Close session & view stats",
    },
  ];

  return (
    <section className="py-24 bg-white border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-topic text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            The perfect operational flow.
          </h2>
          <p className="text-lg text-gray-600">
            Designed to match exactly how your restaurant works, from the first
            customer to the end-of-day reconciliation.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-7 gap-8 md:gap-4 relative z-10">
            {steps.map((step, index) => (
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
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="flex flex-row md:flex-col items-center gap-4 md:gap-6"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white border-2 border-gray-100 shadow-sm flex items-center justify-center text-brand relative group hover:border-brand hover:text-brand transition-colors z-10">
                  {step.icon}
                  <div className="absolute -inset-2 bg-brand/5 rounded-full scale-0 group-hover:scale-100 transition-transform -z-10" />
                </div>
                <div className="text-left md:text-center flex-1">
                  <h4 className="font-topic font-semibold text-gray-900 text-sm md:text-base mb-1">
                    {step.title}
                  </h4>
                  <p className="text-xs text-gray-500">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
