import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, UserCircle, Smartphone } from "lucide-react";
export function RoleBasedExperience() {
  const [activeRole, setActiveRole] = useState(0);
  const roles = [
    {
      id: "admin",
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Manager / Admin",
      description:
        "Full control over the system. Manage menus, view real-time analytics, configure floor plans, and set employee permissions.",
      imageColor: "bg-brand-50",
      uiMockup: (
        <div className="w-full h-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-8 h-8 rounded-full bg-brand-100"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="w-12 h-3 bg-gray-200 rounded mb-2"></div>
              <div className="w-20 h-6 bg-brand-100 rounded"></div>
            </div>
            <div className="h-20 bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="w-12 h-3 bg-gray-200 rounded mb-2"></div>
              <div className="w-20 h-6 bg-teal-100 rounded"></div>
            </div>
          </div>
          <div className="flex-1 bg-gray-50 rounded-lg border border-gray-100 p-3">
            <div className="w-full h-3 bg-gray-200 rounded mb-3"></div>
            <div className="w-3/4 h-3 bg-gray-200 rounded mb-3"></div>
            <div className="w-5/6 h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      ),
    },
    {
      id: "cashier",
      icon: <UserCircle className="w-5 h-5" />,
      title: "Cashier / Server",
      description:
        "A streamlined, distraction-free interface built for speed. Take orders, apply discounts, and process payments rapidly.",
      imageColor: "bg-teal-50",
      uiMockup: (
        <div className="w-full h-full bg-white rounded-xl shadow-sm border border-gray-100 flex overflow-hidden">
          <div className="w-1/3 bg-gray-50 border-r border-gray-100 p-3 flex flex-col gap-2">
            <div className="w-full h-8 bg-white border border-gray-200 rounded"></div>
            <div className="w-full h-8 bg-white border border-gray-200 rounded"></div>
            <div className="w-full h-8 bg-white border border-gray-200 rounded"></div>
          </div>
          <div className="w-2/3 p-3 flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-2">
              <div className="h-16 bg-teal-50 rounded border border-teal-100"></div>
              <div className="h-16 bg-teal-50 rounded border border-teal-100"></div>
              <div className="h-16 bg-teal-50 rounded border border-teal-100"></div>
              <div className="h-16 bg-teal-50 rounded border border-teal-100"></div>
            </div>
            <div className="h-10 bg-teal text-white rounded flex items-center justify-center text-xs font-bold">
              PAY
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "customer",
      icon: <Smartphone className="w-5 h-5" />,
      title: "Customer",
      description:
        "A beautiful self-service experience. Scan QR codes to view digital menus, place orders, and pay from their own devices.",
      imageColor: "bg-gray-50",
      uiMockup: (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
          <div className="w-40 h-72 bg-white rounded-[2rem] shadow-md border-4 border-gray-800 p-2 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-gray-800 rounded-b-xl"></div>
            <div className="w-full h-24 bg-brand-100 rounded-xl mb-2 mt-4"></div>
            <div className="w-3/4 h-3 bg-gray-200 rounded mb-2"></div>
            <div className="w-1/2 h-3 bg-gray-200 rounded mb-4"></div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="w-full h-10 bg-gray-50 rounded flex items-center px-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              </div>
              <div className="w-full h-10 bg-gray-50 rounded flex items-center px-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="py-24 bg-offwhite" id="roles">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-topic text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Tailored for every role.
          </h2>
          <p className="text-lg text-gray-600">
            Different users need different tools. Odoo Cafe POS provides
            specialized interfaces for everyone in your restaurant.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Role Selector */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {roles.map((role, index) => (
              <button
                key={role.id}
                onClick={() => setActiveRole(index)}
                className={`text-left p-6 rounded-2xl transition-all border ${activeRole === index ? "bg-white border-brand shadow-md" : "bg-transparent border-transparent hover:bg-white/50"}`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div
                    className={`p-2 rounded-lg ${activeRole === index ? "bg-brand text-white" : "bg-gray-100 text-gray-500"}`}
                  >
                    {role.icon}
                  </div>
                  <h3
                    className={`font-topic text-xl font-semibold ${activeRole === index ? "text-gray-900" : "text-gray-600"}`}
                  >
                    {role.title}
                  </h3>
                </div>
                <p
                  className={`text-sm leading-relaxed ${activeRole === index ? "text-gray-600" : "text-gray-500"}`}
                >
                  {role.description}
                </p>
              </button>
            ))}
          </div>

          {/* Visual Display */}
          <div className="lg:col-span-7 h-[400px] relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRole}
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                }}
                transition={{
                  duration: 0.3,
                }}
                className={`w-full h-full rounded-3xl p-8 ${roles[activeRole].imageColor} flex items-center justify-center`}
              >
                <div className="w-full max-w-md h-full">
                  {roles[activeRole].uiMockup}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
