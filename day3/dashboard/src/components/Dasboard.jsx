import React from "react";
import { Link } from "react-router-dom";


import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { HomeIcon, UserIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import Setting from "../pages/Setting";

const pieData = [
  { name: "Facebook", value: 2000, color: "#3498db" },
  { name: "YouTube", value: 1500, color: "#e74c3c" },
  { name: "Amazon", value: 2500, color: "#f1c40f" },
];

const barData = [
  { name: "Jan", earning: 4000 },
  { name: "Feb", earning: 5000 },
  { name: "Mar", earning: 6000 },
  { name: "Apr", earning: 3000 },
  { name: "May", earning: 8000 },
  { name: "Jun", earning: 7000 },
  { name: "Jul", earning: 9000 },
  { name: "Aug", earning: 12000 },
  { name: "Sep", earning: 4000 },
  { name: "Oct", earning: 14000 },
  { name: "Nov", earning: 7000 },
  { name: "Dec", earning: 11000 },
];



export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900 ">
      <div className="mx-auto flex max-w-8xl h-screen gap-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Sidebar */}
     <nav className="w-48 rounded-2xl bg-blue-600/95 p-6 text-white shadow-xl ">
      <Link
        to="/"
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-white/10"
      >
        <HomeIcon className="h-5 w-5" /> Dashboard
      </Link>

      <Link
        to="/customers"
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-white/10"
      >
        <UserIcon className="h-5 w-5" /> Customers
      </Link>

      <Link
        to="/settings"
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-white/10"
      >
        <Cog6ToothIcon className="h-5 w-5" /> Settings
      </Link>

      <button className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-white/10">
        <ArrowRightOnRectangleIcon className="h-5 w-5" /> Sign Out
      </button>
    </nav>

      {/* Main */}
      <main className="flex-1">
        {/* Topbar */}
        <header className="mb-6 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-2.5 shadow-sm outline-none ring-blue-500/30 transition placeholder:text-slate-400 focus:ring-4"
            />
          </div>
          <img
            src="https://via.placeholder.com/40"
            alt="profile"
            className="h-10 w-10 rounded-full ring-2 ring-white shadow"
          />
        </header>

        {/* Cards */}
        <section className="mb-6 grid grid-row gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-bold">1,504</h2>
            <p className="text-slate-500">Daily Views</p>
          </div>
          <div className="rounded-2xl bg-blue-600 p-5 text-center text-white shadow-sm">
            <h2 className="text-2xl font-bold">80</h2>
            <p>Sales</p>
          </div>
          <div className="rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-bold">284</h2>
            <p className="text-slate-500">Comments</p>
          </div>
          <div className="rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-bold">$7,842</h2>
            <p className="text-slate-500">Earning</p>
          </div>
        </section>

        {/* Charts */}
        <section className="mb-6 grid grid-row gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <h3 className="mb-4 font-semibold">Traffic sources</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <h3 className="mb-4 font-semibold">Earnings</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="earning" fill="#3498db" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Orders + Customers */}
        <section className="grid grid-row gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <h3 className="mb-4 font-semibold">Recent orders</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th>Name</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td>First Order</td>
                  <td>$1200</td>
                  <td className="font-medium text-green-600">Paid</td>
                </tr>
                <tr>
                  <td>Second Order</td>
                  <td>$950</td>
                  <td className="font-medium text-amber-600">Pending</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <h3 className="mb-4 font-semibold">Recent customers</h3>
            <ul>
              <li className="flex items-center gap-3 border-b py-2">
                <img src="https://via.placeholder.com/30" alt="customer" className="h-8 w-8 rounded-full ring-1 ring-slate-200" />
                <span>David (Italy)</span>
              </li>
              <li className="flex items-center gap-3 py-2">
                <img src="https://via.placeholder.com/30" alt="customer" className="h-8 w-8 rounded-full ring-1 ring-slate-200" />
                <span>Anna (USA)</span>
              </li>
            </ul>
          </div>
        </section>
      </main>
      </div>
    </div>
  );
}
