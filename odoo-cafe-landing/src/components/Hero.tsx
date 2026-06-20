import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  PlayCircle,
  Coffee,
  CreditCard,
  LayoutGrid,
  Settings,
} from "lucide-react";
export function Hero() {
  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };
  const handlePayNowClick = () => {
    document.querySelector("#demo")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  return (
    <section
      className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-offwhite"
      id="product"
    >
      {/* Drifting Gradient Backdrop */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(circle,rgba(113,75,103,0.15)_0%,transparent_70%)] animate-gradient-drift" />
        <div
          className="absolute top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(1,126,132,0.1)_0%,transparent_70%)] animate-gradient-drift"
          style={{
            animationDelay: "-5s",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-brand"></span>
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Restaurant POS • Kitchen Display • Self Ordering
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-topic text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6"
            >
              Run your cafe with{" "}
              <span className="text-brand">one smart POS.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl"
            >
              From tables to kitchen to checkout — all in one flow. A complete
              restaurant operating system built for speed, accuracy, and
              seamless customer experiences.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#demo"
                className="inline-flex justify-center items-center gap-2 bg-brand hover:bg-brand-600 text-white font-medium px-8 py-3.5 rounded-full transition-all hover:shadow-soft hover:-translate-y-0.5"
              >
                Request Demo
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#modules"
                className="inline-flex justify-center items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-medium px-8 py-3.5 rounded-full transition-all hover:shadow-sm"
              >
                <PlayCircle className="w-5 h-5 text-gray-500" />
                Explore Modules
              </a>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-10 flex items-center gap-6 text-sm text-gray-500 font-medium"
            >
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-teal" /> Backend Setup
              </div>
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-teal" /> Kitchen Display
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-teal" /> Self-Order QR
              </div>
            </motion.div>
          </motion.div>

          {/* Mockup */}
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="relative lg:ml-auto w-full max-w-[600px]"
          >
            {/* Main Tablet Mockup */}
            <div className="relative bg-white rounded-3xl shadow-float border border-gray-100 overflow-hidden aspect-[4/3] flex flex-col">
              {/* Tablet Header */}
              <div className="h-12 bg-gray-50 border-b border-gray-100 flex items-center px-4 justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                    <Coffee className="w-4 h-4 text-brand" />
                  </div>
                  <span className="font-semibold text-gray-800 text-sm">
                    Main Register
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Settings className="w-4 h-4" />
                  <div className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-md">
                    Session Open
                  </div>
                </div>
              </div>

              {/* Tablet Body */}
              <div className="flex-1 flex bg-gray-50/50">
                {/* Categories Sidebar */}
                <div className="w-24 border-r border-gray-100 bg-white flex flex-col gap-2 p-2">
                  {["Coffee", "Pastries", "Mains", "Drinks"].map((cat, i) => (
                    <div
                      key={cat}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors ${i === 0 ? "bg-brand-50 text-brand" : "text-gray-500 hover:bg-gray-50"}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${i === 0 ? "bg-brand-100" : "bg-gray-100"}`}
                      >
                        <Coffee className="w-4 h-4" />
                      </div>
                      {cat}
                    </div>
                  ))}
                </div>

                {/* Products Grid */}
                <div className="flex-1 p-4 grid grid-cols-3 gap-3 overflow-hidden">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                    <div
                      key={item}
                      className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex flex-col justify-between hover:border-brand-200 cursor-pointer transition-colors"
                    >
                      <div className="w-full h-16 bg-gray-50 rounded-lg mb-2"></div>
                      <div>
                        <div className="text-xs font-semibold text-gray-800 truncate">
                          Espresso {item}
                        </div>
                        <div className="text-xs text-gray-500">$3.50</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Sidebar */}
                <div className="w-64 bg-white border-l border-gray-100 flex flex-col">
                  <div className="p-4 border-b border-gray-100">
                    <div className="text-sm font-semibold text-gray-800">
                      Current Order
                    </div>
                    <div className="text-xs text-gray-500">
                      Table 4 • Walk-in
                    </div>
                  </div>
                  <div className="flex-1 p-4 flex flex-col gap-3">
                    {[1, 2].map((item) => (
                      <div
                        key={item}
                        className="flex justify-between items-center"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center text-[10px] font-medium">
                            1
                          </div>
                          <div className="text-xs font-medium text-gray-800">
                            Latte Large
                          </div>
                        </div>
                        <div className="text-xs font-medium text-gray-800">
                          $4.50
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-semibold text-gray-800">
                        Total
                      </span>
                      <span className="text-lg font-bold text-brand">
                        $9.00
                      </span>
                    </div>
                    <button
                      type="button"
                      className="w-full bg-brand text-white py-2.5 rounded-xl text-sm font-medium shadow-sm"
                      onClick={handlePayNowClick}
                    >
                      Pay Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.8,
                duration: 0.6,
              }}
              className="absolute -right-6 top-1/4 bg-white p-3 rounded-2xl shadow-card border border-gray-100 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium">
                  Payment Received
                </div>
                <div className="text-sm font-bold text-gray-900">$24.50</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
