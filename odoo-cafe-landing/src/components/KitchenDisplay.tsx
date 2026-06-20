import React, { useState } from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";
export function KitchenDisplay() {
  const [tickets, setTickets] = useState([
    {
      id: "#1042",
      time: "2m ago",
      table: "Table 4",
      items: ["2x Avocado Toast", "1x Eggs Benedict", "1x Side Bacon"],
      status: "normal",
    },
    {
      id: "#1043",
      time: "Just now",
      table: "Takeaway",
      items: ["1x Breakfast Burrito", "1x Iced Latte"],
      status: "normal",
    },
    {
      id: "#1040",
      time: "8m ago",
      table: "Table 12",
      items: ["3x Pancakes", "1x Fruit Bowl", "2x Orange Juice"],
      status: "warning",
    },
    {
      id: "#1041",
      time: "5m ago",
      table: "Table 2",
      items: ["1x Full English", "1x Black Coffee"],
      status: "normal",
    },
    {
      id: "#1038",
      time: "12m ago",
      table: "Table 7",
      items: ["2x Croissant", "2x Cappuccino"],
      status: "ready",
    },
  ]);

  const columns = [
    {
      title: "To Cook",
      color: "border-gray-200",
      headerBg: "bg-gray-100",
      tickets: tickets.filter((ticket) => ticket.status === "normal"),
    },
    {
      title: "Preparing",
      color: "border-brand-200",
      headerBg: "bg-brand-50",
      tickets: tickets.filter((ticket) => ticket.status === "warning"),
    },
    {
      title: "Ready",
      color: "border-green-200",
      headerBg: "bg-green-50",
      tickets: tickets.filter((ticket) => ticket.status === "ready"),
    },
  ];

  const updateTicketStatus = (
    ticketId: string,
    nextStatus: "normal" | "warning" | "ready",
  ) => {
    setTickets((currentTickets) =>
      currentTickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: nextStatus } : ticket,
      ),
    );
  };

  return (
    <section className="py-24 bg-gray-900 relative overflow-hidden" id="kds">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(113,75,103,0.15),transparent_50%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-topic text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            A smarter kitchen display.
          </h2>
          <p className="text-lg text-gray-400">
            Ditch the paper tickets. Route orders directly to the right prep
            stations, track cooking times, and keep your back-of-house perfectly
            synchronized.
          </p>
        </div>

        {/* KDS Mockup */}
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
          className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden"
        >
          {/* KDS Header */}
          <div className="bg-gray-950 px-6 py-4 flex justify-between items-center border-b border-gray-700">
            <div className="flex items-center gap-4">
              <span className="text-white font-bold text-lg tracking-wide">
                KITCHEN DISPLAY
              </span>
              <div className="h-6 w-px bg-gray-700"></div>
              <span className="text-gray-400 text-sm font-medium">
                Main Prep Station
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" /> 10:42 AM
              </div>
            </div>
          </div>

          {/* Kanban Board */}
          <div className="p-6 grid md:grid-cols-3 gap-6 overflow-x-auto">
            {columns.map((col, i) => (
              <div key={i} className="flex flex-col gap-4 min-w-[300px]">
                {/* Column Header */}
                <div
                  className={`px-4 py-3 rounded-xl ${col.headerBg} flex justify-between items-center`}
                >
                  <span className="font-bold text-gray-800">{col.title}</span>
                  <span className="bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                    {col.tickets.length}
                  </span>
                </div>

                {/* Tickets */}
                <div className="flex flex-col gap-4">
                  {col.tickets.map((ticket, j) => (
                    <motion.div
                      key={j}
                      initial={{
                        opacity: 0,
                        scale: 0.95,
                      }}
                      whileInView={{
                        opacity: 1,
                        scale: 1,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        delay: 0.2 + i * 0.1 + j * 0.1,
                      }}
                      className={`bg-white rounded-xl shadow-sm border-l-4 overflow-hidden ${ticket.status === "warning" ? "border-orange-500" : ticket.status === "ready" ? "border-green-500" : "border-brand"}`}
                    >
                      {/* Ticket Header */}
                      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">
                            {ticket.id}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-200 text-gray-700">
                            {ticket.table}
                          </span>
                        </div>
                        <div
                          className={`flex items-center gap-1 text-xs font-medium ${ticket.status === "warning" ? "text-orange-600" : "text-gray-500"}`}
                        >
                          {ticket.status === "warning" && (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          {ticket.time}
                        </div>
                      </div>

                      {/* Ticket Items */}
                      <div className="p-4 flex flex-col gap-3">
                        {ticket.items.map((item, k) => (
                          <div key={k} className="flex items-start gap-3">
                            <div
                              className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${ticket.status === "ready" ? "bg-green-500 border-green-500 text-white" : "border-gray-300"}`}
                            >
                              {ticket.status === "ready" && (
                                <CheckCircle2 className="w-4 h-4" />
                              )}
                            </div>
                            <span
                              className={`text-sm font-medium ${ticket.status === "ready" ? "text-gray-400 line-through" : "text-gray-800"}`}
                            >
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Ticket Action */}
                      {ticket.status !== "ready" && (
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                          <button
                            type="button"
                            className={`w-full py-2 rounded-lg text-sm font-bold transition-colors ${col.title === "To Cook" ? "bg-brand-50 text-brand hover:bg-brand-100" : "bg-green-500 text-white hover:bg-green-600"}`}
                            onClick={() =>
                              updateTicketStatus(
                                ticket.id,
                                col.title === "To Cook" ? "warning" : "ready",
                              )
                            }
                          >
                            {col.title === "To Cook"
                              ? "Start Preparing"
                              : "Mark Ready"}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
