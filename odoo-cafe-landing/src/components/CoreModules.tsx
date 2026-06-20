import React from "react";
import { motion } from "framer-motion";
import {
  Settings,
  MonitorSmartphone,
  MonitorPlay,
  QrCode,
  LineChart,
  LayoutDashboard,
} from "lucide-react";
export function CoreModules() {
  const modules = [
    {
      icon: <Settings className="w-7 h-7 text-white" />,
      title: "Admin Backend",
      description:
        "Configure menus, manage tables, set up taxes, and control employee permissions from anywhere.",
      color: "bg-brand",
    },
    {
      icon: <MonitorSmartphone className="w-7 h-7 text-white" />,
      title: "POS Terminal",
      description:
        "The fast, intuitive interface for cashiers to take orders, apply discounts, and process payments.",
      color: "bg-teal",
    },
    {
      icon: <LayoutDashboard className="w-7 h-7 text-white" />,
      title: "Kitchen Display (KDS)",
      description:
        "Digital order tickets routed directly to prep stations. Track cooking times and clear bottlenecks.",
      color: "bg-brand-600",
    },
    {
      icon: <MonitorPlay className="w-7 h-7 text-white" />,
      title: "Customer Display",
      description:
        "Show customers their order details in real-time, collect tips, and display digital receipts.",
      color: "bg-teal-600",
    },
    {
      icon: <QrCode className="w-7 h-7 text-white" />,
      title: "Self Ordering",
      description:
        "Let guests scan a QR code at their table to browse the menu, order, and pay independently.",
      color: "bg-brand-500",
    },
    {
      icon: <LineChart className="w-7 h-7 text-white" />,
      title: "Reports & Dashboard",
      description:
        "Real-time analytics on sales, inventory, and staff performance to make data-driven decisions.",
      color: "bg-teal-500",
    },
  ];

  return (
    <section className="py-24 bg-lavender relative" id="modules">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="font-topic text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              A complete suite of modules.
            </h2>
            <p className="text-lg text-gray-600">
              Everything works together seamlessly out of the box. No
              third-party integrations required.
            </p>
          </div>
          <a
            href="#demo"
            className="inline-flex items-center text-brand font-semibold hover:text-brand-600 transition-colors"
          >
            Explore all features &rarr;
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, index) => (
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
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-card transition-all border border-gray-100 group cursor-pointer"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${mod.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}
              >
                {mod.icon}
              </div>
              <h3 className="font-topic text-xl font-semibold text-gray-900 mb-3">
                {mod.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {mod.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
