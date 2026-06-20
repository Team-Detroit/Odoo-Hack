import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
export function FinalCTA() {
  return (
    <section className="py-24 relative overflow-hidden bg-white" id="demo">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
            duration: 0.6,
          }}
          className="bg-gray-900 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-float"
        >
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(113,75,103,0.8)_0%,transparent_60%)] animate-gradient-drift" />
            <div
              className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,rgba(1,126,132,0.6)_0%,transparent_60%)] animate-gradient-drift"
              style={{
                animationDelay: "-3s",
              }}
            />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-topic text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
              See how Odoo Cafe POS transforms restaurant operations.
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-10">
              Join thousands of modern cafes and restaurants running their
              entire business on one unified platform.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="#demo"
                className="inline-flex justify-center items-center gap-2 bg-brand hover:bg-brand-400 text-white font-medium px-8 py-4 rounded-full transition-all hover:shadow-soft hover:-translate-y-0.5 text-lg"
              >
                Request Demo
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#modules"
                className="inline-flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium px-8 py-4 rounded-full transition-all hover:shadow-sm text-lg backdrop-blur-sm"
              >
                Explore Modules
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
