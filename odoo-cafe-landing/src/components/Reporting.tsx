import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Calendar,
  ChevronDown,
} from "lucide-react";
function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-50px",
  });
  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = value / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);
  return (
    <span ref={ref}>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}
export function Reporting() {
  const timeRanges = ["Today", "This Week", "This Month"];
  const employeeGroups = ["All Employees", "Cashiers", "Baristas"];
  const [timeRangeIndex, setTimeRangeIndex] = useState(0);
  const [employeeGroupIndex, setEmployeeGroupIndex] = useState(0);

  const cycleOption = (currentIndex: number, optionsLength: number) =>
    (currentIndex + 1) % optionsLength;

  return (
    <section className="py-24 bg-offwhite relative" id="reporting">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-topic text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Insights that drive growth.
          </h2>
          <p className="text-lg text-gray-600">
            Make informed decisions with real-time analytics. Track sales,
            monitor employee performance, and understand your customers better.
          </p>
        </div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
          }}
          className="bg-white rounded-3xl shadow-float border border-gray-100 overflow-hidden max-w-5xl mx-auto"
        >
          {/* Dashboard Header */}
          <div className="px-8 py-6 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center bg-gray-50/50">
            <h3 className="font-topic text-xl font-bold text-gray-900">
              Overview
            </h3>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() =>
                  setTimeRangeIndex((index) =>
                    cycleOption(index, timeRanges.length),
                  )
                }
              >
                <Calendar className="w-4 h-4 text-gray-500" />
                {timeRanges[timeRangeIndex]}
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() =>
                  setEmployeeGroupIndex((index) =>
                    cycleOption(index, employeeGroups.length),
                  )
                }
              >
                {employeeGroups[employeeGroupIndex]}
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="p-8">
            {/* KPI Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">
                    <TrendingUp className="w-3 h-3" /> +12.5%
                  </span>
                </div>
                <div className="text-gray-500 text-sm font-medium mb-1">
                  Total Revenue
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  <AnimatedCounter value={4250.5} prefix="$" decimals={2} />
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">
                    <TrendingUp className="w-3 h-3" /> +8.2%
                  </span>
                </div>
                <div className="text-gray-500 text-sm font-medium mb-1">
                  Total Orders
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  <AnimatedCounter value={342} />
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                    +0.0%
                  </span>
                </div>
                <div className="text-gray-500 text-sm font-medium mb-1">
                  Average Order Value
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  <AnimatedCounter value={12.42} prefix="$" decimals={2} />
                </div>
              </div>
            </div>

            {/* Charts & Lists Area */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Fake Chart */}
              <div className="md:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col">
                <h4 className="font-topic font-bold text-gray-900 mb-6">
                  Revenue Over Time
                </h4>
                <div className="flex-1 flex items-end gap-2 h-48">
                  {[40, 60, 45, 80, 55, 90, 75, 100, 85, 65, 50, 70].map(
                    (height, i) => (
                      <div
                        key={i}
                        className="flex-1 flex flex-col justify-end group"
                      >
                        <motion.div
                          initial={{
                            height: 0,
                          }}
                          whileInView={{
                            height: `${height}%`,
                          }}
                          viewport={{
                            once: true,
                          }}
                          transition={{
                            duration: 0.8,
                            delay: i * 0.05,
                          }}
                          className="w-full bg-brand-100 rounded-t-sm group-hover:bg-brand transition-colors relative"
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            ${height * 10}
                          </div>
                        </motion.div>
                      </div>
                    ),
                  )}
                </div>
                <div className="flex justify-between mt-4 text-xs text-gray-400 font-medium">
                  <span>8 AM</span>
                  <span>12 PM</span>
                  <span>4 PM</span>
                  <span>8 PM</span>
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h4 className="font-topic font-bold text-gray-900 mb-6">
                  Top Products
                </h4>
                <div className="flex flex-col gap-4">
                  {[
                    {
                      name: "Avocado Toast",
                      sales: 45,
                      color: "bg-brand",
                    },
                    {
                      name: "Latte Large",
                      sales: 38,
                      color: "bg-teal",
                    },
                    {
                      name: "Eggs Benedict",
                      sales: 32,
                      color: "bg-brand-400",
                    },
                    {
                      name: "Iced Americano",
                      sales: 28,
                      color: "bg-teal-400",
                    },
                    {
                      name: "Croissant",
                      sales: 24,
                      color: "bg-gray-300",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 text-sm font-bold text-gray-400">
                        #{i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-900">
                            {item.name}
                          </span>
                          <span className="text-gray-500">{item.sales}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{
                              width: 0,
                            }}
                            whileInView={{
                              width: `${(item.sales / 45) * 100}%`,
                            }}
                            viewport={{
                              once: true,
                            }}
                            transition={{
                              duration: 1,
                              delay: 0.5,
                            }}
                            className={`h-full ${item.color} rounded-full`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
