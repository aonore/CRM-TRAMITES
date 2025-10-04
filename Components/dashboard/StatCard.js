import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function StatCard({ title, value, icon: Icon, gradient, trend, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300 overflow-hidden group">
        <div className={`absolute top-0 right-0 w-32 h-32 ${gradient} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-300`} />
        <CardContent className="p-6 relative">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
              <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
              {subtitle && (
                <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
              )}
            </div>
            <div className={`p-3 rounded-xl ${gradient} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
              <Icon className={`w-6 h-6 ${gradient.replace('bg-', 'text-').replace('to-', '').split(' ')[0]}`} />
            </div>
          </div>
          {trend && (
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                trend.type === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
                {trend.value}
              </span>
              <span className="text-xs text-slate-500">{trend.label}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}