import React from "react";
import { Twitter, Linkedin, Github, Instagram } from "lucide-react";
export function Footer() {
  const columns = [
    {
      title: "Product",
      links: [
        {
          label: "Features",
          href: "#modules",
        },
        {
          label: "Pricing",
          href: "#demo",
        },
        {
          label: "Hardware",
          href: "#product",
        },
        {
          label: "Integrations",
          href: "#how-it-works",
        },
        {
          label: "Updates",
          href: "#reporting",
        },
      ],
    },
    {
      title: "Modules",
      links: [
        {
          label: "POS Terminal",
          href: "#product",
        },
        {
          label: "Kitchen Display",
          href: "#kds",
        },
        {
          label: "Self Ordering",
          href: "#self-ordering",
        },
        {
          label: "Inventory",
          href: "#modules",
        },
        {
          label: "Reporting",
          href: "#reporting",
        },
      ],
    },
    {
      title: "Resources",
      links: [
        {
          label: "Help Center",
          href: "#how-it-works",
        },
        {
          label: "API Documentation",
          href: "https://www.odoo.com/documentation",
        },
        {
          label: "Community",
          href: "#roles",
        },
        {
          label: "Blog",
          href: "https://www.odoo.com/blog",
        },
        {
          label: "Webinars",
          href: "#demo",
        },
      ],
    },
    {
      title: "Company",
      links: [
        {
          label: "About Us",
          href: "#product",
        },
        {
          label: "Careers",
          href: "https://www.odoo.com/jobs",
        },
        {
          label: "Partners",
          href: "#modules",
        },
        {
          label: "Contact",
          href: "#demo",
        },
        {
          label: "Legal",
          href: "https://www.odoo.com/privacy",
        },
      ],
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-end gap-2 leading-none">
                <span
                  className="font-topic text-[2rem] text-gray-900"
                  style={{ fontFamily: '"Caveat Brush", cursive' }}
                >
                  Odoo
                </span>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-gray-700">
                  Cafe
                </span>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
              The complete restaurant operating system built for speed,
              accuracy, and seamless customer experiences.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.odoo.com/"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-brand transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.odoo.com/"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-brand transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://www.odoo.com/"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-brand transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.odoo.com/"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-brand transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {columns.map((col, i) => (
            <div key={i} className="col-span-1">
              <h4 className="font-topic font-bold text-gray-900 mb-4 text-sm">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <a
                      href={link.href}
                      target={
                        link.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        link.href.startsWith("http") ? "noreferrer" : undefined
                      }
                      className="text-gray-500 hover:text-brand text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Odoo Cafe POS Concept. All rights
            reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a
              href="https://www.odoo.com/privacy"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="https://www.odoo.com/terms-of-use"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gray-900 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="mailto:hello@odoo.com"
              className="hover:text-gray-900 transition-colors"
            >
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
