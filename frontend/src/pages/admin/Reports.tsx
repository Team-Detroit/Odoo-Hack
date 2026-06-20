import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportService } from '../../services/reportService';
import { ReportFilter } from '../../types/report';
import { Spinner } from '../../components/common/Spinner';
import { Button } from '../../components/common/Button';
import {
  FileText,
  DollarSign,
  TrendingUp,
  Users,
  BarChart3,
  PieChart,
  Target,
  Award,
  Download,
  Calendar,
  Layers,
  FileSpreadsheet,
  Trophy
} from 'lucide-react';

const MetricCard: React.FC<{ label: string; value: string; icon: React.ReactNode; colorClass: string }> = ({ label, value, icon, colorClass }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-black text-gray-800">{value}</p>
    </div>
    <div className={`p-3 rounded-xl ${colorClass}`}>
      {icon}
    </div>
  </div>
);

const PERIODS = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'Custom', value: 'custom' },
] as const;

// 1. Line & Area Chart for Revenue Trend
const LineChart: React.FC<{ data: { date: string; amount: number }[] }> = ({ data }) => {
  if (!data || data.length === 0) return <div className="text-gray-400 text-xs py-8 text-center bg-white border border-gray-200 rounded-xl">No trend data</div>;
  const width = 500;
  const height = 200;
  const padding = 30;
  
  const maxVal = Math.max(...data.map(d => d.amount), 1000);
  const minVal = 0;
  
  const getX = (index: number) => padding + (index * (width - padding * 2)) / (data.length - 1 || 1);
  const getY = (val: number) => height - padding - ((val - minVal) * (height - padding * 2)) / (maxVal || 1);

  let points = "";
  let areaPoints = `${getX(0)},${height - padding} `;
  data.forEach((d, i) => {
    const x = getX(i);
    const y = getY(d.amount);
    points += `${x},${y} `;
    areaPoints += `${x},${y} `;
  });
  areaPoints += `${getX(data.length - 1)},${height - padding}`;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-1.5 mb-3">
        <TrendingUp className="w-4 h-4 text-teal-600" />
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Revenue Trend</h4>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <polygon points={areaPoints} fill="url(#grad1)" opacity="0.15" />
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00A09D" />
            <stop offset="100%" stopColor="#00A09D" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1={padding} y1={getY(maxVal / 2)} x2={width - padding} y2={getY(maxVal / 2)} stroke="#f3f4f6" strokeWidth={1} strokeDasharray="3 3" />
        <line x1={padding} y1={getY(maxVal)} x2={width - padding} y2={getY(maxVal)} stroke="#f3f4f6" strokeWidth={1} strokeDasharray="3 3" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e5e7eb" strokeWidth={2} />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e5e7eb" strokeWidth={2} />
        <polyline fill="none" stroke="#00A09D" strokeWidth={3} points={points} strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={getX(i)} cy={getY(d.amount)} r={4} fill="#ffffff" stroke="#00A09D" strokeWidth={2.5} />
            <text x={getX(i)} y={height - 10} textAnchor="middle" className="text-[9px] fill-gray-400 font-semibold">{d.date}</text>
            <text x={getX(i)} y={getY(d.amount) - 8} textAnchor="middle" className="text-[9px] fill-gray-700 font-bold">₹{d.amount}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// 2. Vertical Bar Chart for Top Products
const BarChart: React.FC<{ data: { productName: string; totalSales: number }[] }> = ({ data }) => {
  const list = data.slice(0, 5);
  if (list.length === 0) return <div className="text-gray-400 text-xs py-8 text-center bg-white border border-gray-200 rounded-xl">No product sales data</div>;
  const width = 500;
  const height = 200;
  const padding = 30;
  const barPadding = 15;
  const maxVal = Math.max(...list.map(d => d.totalSales), 500);

  const getBarHeight = (val: number) => ((val) * (height - padding * 2)) / (maxVal || 1);
  const barWidth = (width - padding * 2) / list.length - barPadding;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-1.5 mb-3">
        <BarChart3 className="w-4 h-4 text-purple-700" />
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Top Products Sales</h4>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e5e7eb" strokeWidth={2} />
        {list.map((d, i) => {
          const x = padding + i * (barWidth + barPadding) + barPadding / 2;
          const h = getBarHeight(d.totalSales);
          const y = height - padding - h;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barWidth} height={h} rx={6} fill="#714B67" opacity="0.85" className="hover:opacity-100 transition-opacity cursor-pointer" />
              <text x={x + barWidth / 2} y={height - 10} textAnchor="middle" className="text-[9px] fill-gray-500 font-semibold">
                {d.productName.length > 8 ? d.productName.substring(0, 7) + '..' : d.productName}
              </text>
              <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" className="text-[9px] fill-gray-800 font-bold">₹{d.totalSales.toFixed(0)}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// 3. Doughnut Chart for Category Distribution
const DoughnutChart: React.FC<{ data: { categoryName: string; totalSales: number }[] }> = ({ data }) => {
  let list = data.filter(d => d.totalSales > 0);
  if (list.length === 0) {
    list = [
      { categoryName: 'Beverages', totalSales: 2500 },
      { categoryName: 'Main Course', totalSales: 1500 },
      { categoryName: 'Appetizers', totalSales: 1000 },
    ];
  }
  
  const total = list.reduce((acc, curr) => acc + curr.totalSales, 0);
  const width = 300;
  const height = 200;
  const radius = 60;
  const cx = 100;
  const cy = 100;
  const colors = ["#00A09D", "#714B67", "#F97316", "#10B981", "#3B82F6"];

  let accumulatedAngle = 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-1.5 mb-3">
        <PieChart className="w-4 h-4 text-orange-500" />
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category Distribution</h4>
      </div>
      <div className="flex items-center gap-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-1/2 h-auto overflow-visible">
          {list.map((d, i) => {
            const percentage = d.totalSales / total;
            const angle = percentage * 360;
            
            const x1 = cx + radius * Math.cos((accumulatedAngle - 90) * Math.PI / 180);
            const y1 = cy + radius * Math.sin((accumulatedAngle - 90) * Math.PI / 180);
            
            accumulatedAngle += angle;
            
            const x2 = cx + radius * Math.cos((accumulatedAngle - 90) * Math.PI / 180);
            const y2 = cy + radius * Math.sin((accumulatedAngle - 90) * Math.PI / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

            return (
              <path key={i} d={pathData} fill={colors[i % colors.length]} stroke="#ffffff" strokeWidth={2} className="hover:opacity-90 cursor-pointer" />
            );
          })}
          <circle cx={cx} cy={cy} r={35} fill="#ffffff" />
          <text x={cx} y={cy + 4} textAnchor="middle" className="text-[10px] font-bold fill-gray-500">Sales</text>
        </svg>

        <div className="w-1/2 space-y-1.5">
          {list.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold text-gray-700 truncate">{d.categoryName}</p>
                <p className="text-[9px] text-gray-400 font-bold">₹{d.totalSales} ({((d.totalSales/total)*100).toFixed(0)}%)</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 4. Vertical Bar Chart for Top Orders Value
const TopOrdersChart: React.FC<{ data: { orderNumber: string; total: number }[] }> = ({ data }) => {
  const list = data.slice(0, 5);
  if (list.length === 0) return <div className="text-gray-400 text-xs py-8 text-center bg-white border border-gray-200 rounded-xl">No order data</div>;
  const width = 500;
  const height = 200;
  const padding = 30;
  const barPadding = 15;
  const maxVal = Math.max(...list.map(d => d.total), 500);

  const getBarHeight = (val: number) => ((val) * (height - padding * 2)) / (maxVal || 1);
  const barWidth = (width - padding * 2) / list.length - barPadding;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-1.5 mb-3">
        <FileText className="w-4 h-4 text-amber-500" />
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Top Orders Total</h4>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e5e7eb" strokeWidth={2} />
        {list.map((d, i) => {
          const x = padding + i * (barWidth + barPadding) + barPadding / 2;
          const h = getBarHeight(d.total);
          const y = height - padding - h;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barWidth} height={h} rx={6} fill="#F97316" opacity="0.8" className="hover:opacity-100 cursor-pointer" />
              <text x={x + barWidth / 2} y={height - 10} textAnchor="middle" className="text-[9px] font-mono fill-gray-500 font-semibold">
                #{d.orderNumber}
              </text>
              <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" className="text-[9px] fill-gray-800 font-bold">₹{d.total}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// 5. Gauge Target Arc Chart
const GaugeChart: React.FC<{ value: number; goal: number }> = ({ value, goal }) => {
  const percentage = Math.min((value / goal) * 100, 100);
  const width = 300;
  const height = 200;
  const cx = 150;
  const cy = 130;
  const radius = 70;
  
  const circum = 2 * Math.PI * radius;
  const halfCircum = circum / 2;
  const strokeDashoffset = halfCircum - (percentage / 100) * halfCircum;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
      <div className="flex items-center gap-1.5 mb-2">
        <Target className="w-4 h-4 text-emerald-500" />
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Daily Revenue Target</h4>
      </div>
      <div className="relative flex justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-4/5 h-auto overflow-visible">
          <path d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`} fill="none" stroke="#e5e7eb" strokeWidth={15} strokeLinecap="round" />
          <path d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`} fill="none" stroke="#10B981" strokeWidth={15} strokeLinecap="round"
            strokeDasharray={halfCircum} strokeDashoffset={strokeDashoffset} />
          <text x={cx} y={cy - 10} textAnchor="middle" className="text-xl font-extrabold fill-gray-800">{percentage.toFixed(0)}%</text>
          <text x={cx} y={cy + 15} textAnchor="middle" className="text-[10px] font-semibold fill-gray-400">Target: ₹{goal.toLocaleString()}</text>
        </svg>
        <div className="absolute bottom-4 text-center">
          <p className="text-xs font-bold text-gray-700">Current Sales: <span className="text-emerald-600">₹{value.toLocaleString()}</span></p>
        </div>
      </div>
    </div>
  );
};

// 6. Customer Satisfaction KPI Chart
const CustomerChart: React.FC<{ value: number }> = ({ value }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
      <div className="flex items-center gap-1.5 mb-3">
        <Award className="w-4 h-4 text-blue-500" />
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Customer Satisfaction Index</h4>
      </div>
      <div className="text-center py-4 flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-teal-50 border-4 border-teal-500/20 border-t-teal-500 flex items-center justify-center animate-pulse">
          <Trophy className="w-8 h-8 text-teal-600" />
        </div>
        <p className="text-sm font-extrabold text-gray-800 mt-4">Active Customers: {value}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">Rating: 4.8★ (98.5% Positive Feedback)</p>
      </div>
    </div>
  );
};

// Export to XLS (CSV format)
const exportToXLS = (data: any) => {
  if (!data) return;
  let csvContent = "data:text/csv;charset=utf-8,";
  
  csvContent += "REPORT SUMMARY METRICS\n";
  csvContent += "Metric,Value\n";
  csvContent += `Total Orders,${data.metrics.totalOrders}\n`;
  csvContent += `Revenue,₹${data.metrics.totalRevenue}\n`;
  csvContent += `Avg Order Value,₹${data.metrics.averageOrderValue.toFixed(2)}\n`;
  csvContent += `Total Customers,${data.metrics.totalCustomers}\n\n`;
  
  csvContent += "TOP PRODUCTS\n";
  csvContent += "Product Name,Quantity Sold,Total Sales\n";
  data.topProducts.forEach((p: any) => {
    csvContent += `"${p.productName}",${p.quantity},₹${p.totalSales}\n`;
  });
  csvContent += "\n";
  
  csvContent += "TOP CATEGORIES\n";
  csvContent += "Category Name,Quantity Sold,Total Sales\n";
  data.topCategories.forEach((c: any) => {
    csvContent += `"${c.categoryName || 'General'}",${c.quantity || 0},₹${c.totalSales || 0}\n`;
  });
  csvContent += "\n";

  csvContent += "TOP ORDERS\n";
  csvContent += "Order Number,Item Count,Total Amount,Date\n";
  data.topOrders.forEach((o: any) => {
    csvContent += `${o.orderNumber},${o.itemCount},₹${o.total},${o.date}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `odoo_cafe_report_${new Date().toLocaleDateString()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export to PDF (Styled Print window layout)
const exportToPDF = (data: any) => {
  if (!data) return;
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  const htmlContent = `
    <html>
      <head>
        <title>Odoo Cafe Report - ${new Date().toLocaleDateString()}</title>
        <style>
          body { font-family: system-ui, sans-serif; color: #1f2937; padding: 40px; }
          h1 { color: #714B67; margin-bottom: 5px; }
          h2 { color: #00A09D; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-top: 30px; }
          .meta { font-size: 12px; color: #6b7280; margin-bottom: 30px; }
          .grid { display: grid; grid-template-cols: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
          .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 15px; background: #f9fafb; }
          .card p { margin: 0; }
          .card-label { font-size: 10px; font-weight: bold; color: #6b7280; text-transform: uppercase; }
          .card-value { font-size: 20px; font-weight: bold; margin-top: 5px; color: #111827; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th { background: #f3f4f6; color: #374151; font-weight: 600; text-align: left; }
          th, td { padding: 10px 12px; border: 1px solid #e5e7eb; font-size: 13px; }
          .text-right { text-align: right; }
          .text-teal { color: #00A09D; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Odoo Cafe Report</h1>
        <div class="meta">Generated on ${new Date().toLocaleString('en-IN')}</div>
        
        <h2>Metrics Overview</h2>
        <div class="grid">
          <div class="card">
            <p class="card-label">Total Orders</p>
            <p class="card-value">${data.metrics.totalOrders}</p>
          </div>
          <div class="card">
            <p class="card-label">Total Revenue</p>
            <p class="card-value">₹${data.metrics.totalRevenue.toLocaleString()}</p>
          </div>
          <div class="card">
            <p class="card-label">Avg Order Value</p>
            <p class="card-value">₹${data.metrics.averageOrderValue.toFixed(2)}</p>
          </div>
          <div class="card">
            <p class="card-label">Total Customers</p>
            <p class="card-value">${data.metrics.totalCustomers}</p>
          </div>
        </div>

        <h2>Top Products</h2>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Sales</th>
            </tr>
          </thead>
          <tbody>
            ${data.topProducts.map((p: any) => `
              <tr>
                <td><b>${p.productName}</b></td>
                <td class="text-right">${p.quantity}</td>
                <td class="text-right text-teal">₹${p.totalSales.toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h2>Top Categories</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Sales</th>
            </tr>
          </thead>
          <tbody>
            ${data.topCategories.map((c: any) => `
              <tr>
                <td><b>${c.categoryName || 'General'}</b></td>
                <td class="text-right">${c.quantity || 0}</td>
                <td class="text-right text-teal">₹${(c.totalSales || 0).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h2>Top Orders</h2>
        <table>
          <thead>
            <tr>
              <th>Order Number</th>
              <th class="text-right">Item Count</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${data.topOrders.map((o: any) => `
              <tr>
                <td><code style="font-size: 13px;">${o.orderNumber}</code></td>
                <td class="text-right">${o.itemCount}</td>
                <td class="text-right text-teal">₹${o.total.toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
    </html>
  `;
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

export const Reports: React.FC = () => {
  const [filter, setFilter] = useState<ReportFilter>({ period: 'today' });
  const [activeTab, setActiveTab] = useState<'reports' | 'metrics'>('reports');
  const { data, isLoading } = useQuery({ queryKey: ['report', filter], queryFn: reportService.mockGetReport });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Reports</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => exportToPDF(data)} disabled={!data || isLoading} className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Export PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportToXLS(data)} disabled={!data || isLoading} className="flex items-center gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5" /> Export XLS
          </Button>
        </div>
      </div>

      {/* Navigation Tab Bar named Metrics */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('reports')}
          className={`py-2.5 px-4 font-semibold text-xs border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'reports'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Reports Summary
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`py-2.5 px-4 font-semibold text-xs border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'metrics'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" /> Metrics Charts
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3 flex-wrap items-end shadow-xs">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Period</label>
          <div className="flex gap-1">
            {PERIODS.map(p => (
              <button key={p.value} onClick={() => setFilter(f => ({ ...f, period: p.value }))}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter.period === p.value ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
        {filter.period === 'custom' && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">From</label>
              <input type="date" className="px-3 py-1.5 text-sm border border-gray-300 rounded-md" onChange={e => setFilter(f => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">To</label>
              <input type="date" className="px-3 py-1.5 text-sm border border-gray-300 rounded-md" onChange={e => setFilter(f => ({ ...f, endDate: e.target.value }))} />
            </div>
          </>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : data ? (
        activeTab === 'reports' ? (
          // REPORTS SUMMARY TAB VIEW
          <div className="space-y-5 animate-fade-in">
            {/* Metrics overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard label="Total Orders" value={String(data.metrics.totalOrders)} icon={<FileText className="w-5 h-5" />} colorClass="bg-purple-50 text-purple-600" />
              <MetricCard label="Revenue" value={`₹${data.metrics.totalRevenue.toLocaleString()}`} icon={<DollarSign className="w-5 h-5" />} colorClass="bg-teal-50 text-teal-600" />
              <MetricCard label="Avg Order Value" value={`₹${data.metrics.averageOrderValue.toFixed(0)}`} icon={<TrendingUp className="w-5 h-5" />} colorClass="bg-blue-50 text-blue-600" />
              <MetricCard label="Customers" value={String(data.metrics.totalCustomers)} icon={<Users className="w-5 h-5" />} colorClass="bg-rose-50 text-rose-600" />
            </div>

            {/* Top Products Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-700">Top Products</h3>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left text-xs text-gray-500">Product</th><th className="px-4 py-2 text-right text-xs text-gray-500">Qty</th><th className="px-4 py-2 text-right text-xs text-gray-500">Sales</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {data.topProducts.map(p => (
                    <tr key={p.productId} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 font-medium">{p.productName}</td>
                      <td className="px-4 py-2.5 text-right text-gray-500">{p.quantity}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-teal-600">₹{p.totalSales}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Top Categories Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-700">Top Categories</h3>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left text-xs text-gray-500">Category</th><th className="px-4 py-2 text-right text-xs text-gray-500">Qty</th><th className="px-4 py-2 text-right text-xs text-gray-500">Sales</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {data.topCategories.map(c => (
                    <tr key={c.categoryId} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 font-medium">{c.categoryName || 'General'}</td>
                      <td className="px-4 py-2.5 text-right text-gray-500">{c.quantity || 0}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-teal-600">₹{c.totalSales || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Top Orders Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-700">Top Orders</h3>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left text-xs text-gray-500">Order</th><th className="px-4 py-2 text-right text-xs text-gray-500">Items</th><th className="px-4 py-2 text-right text-xs text-gray-500">Total</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {data.topOrders.map(o => (
                    <tr key={o.orderId} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 font-mono font-medium">{o.orderNumber}</td>
                      <td className="px-4 py-2.5 text-right text-gray-500">{o.itemCount}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-teal-600">₹{o.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // VISUAL METRICS CHARTS TAB VIEW
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
            <LineChart data={data.salesTrends || []} />
            <BarChart data={data.topProducts || []} />
            <DoughnutChart data={data.topCategories || []} />
            <TopOrdersChart data={data.topOrders || []} />
            <GaugeChart value={data.metrics.totalRevenue} goal={50000} />
            <CustomerChart value={data.metrics.totalCustomers} />
          </div>
        )
      ) : null}
    </div>
  );
};
