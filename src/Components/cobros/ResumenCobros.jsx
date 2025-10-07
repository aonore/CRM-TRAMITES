import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, Calendar, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function ResumenCobros({ cobros }) {
  const totalCobrado = cobros.reduce((sum, c) => sum + (c.monto || 0), 0);
  const cantidadCobros = cobros.length;
  const promedioMonto = cantidadCobros > 0 ? totalCobrado / cantidadCobros : 0;

  const statCards = [
    {
      title: "Total Cobrado",
      value: `$${totalCobrado.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      gradient: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-100"
    },
    {
      title: "Cantidad de Cobros",
      value: cantidadCobros,
      icon: FileText,
      gradient: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Promedio por Cobro",
      value: `$${promedioMonto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      gradient: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-100"
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="border-0 shadow-lg shadow-slate-200/50 overflow-hidden group hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-300`} />
            <CardContent className="p-6 relative">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-500 mb-2">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-6 h-6 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}