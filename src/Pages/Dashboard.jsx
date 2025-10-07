import React, { useState, useEffect } from "react";
import clientesData from "@/Entities/Cliente";
import tareasData from "@/Entities/Tarea";
import { Users, CheckSquare, DollarSign, AlertTriangle, FileText } from "lucide-react";
import Button from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton";

import StatCard from "../components/dashboard/StatCard";
import AlertsList from "../components/dashboard/AlertsList";
import ChartTareasEstado from "../components/dashboard/ChartTareasEstado";
import TopClientes from "../components/dashboard/TopClientes";

export default function Dashboard() {
  const [clientes, setClientes] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

 const loadData = async () => {
  setIsLoading(true);
  setClientes(clientesData);
  setTareas(tareasData);
  setIsLoading(false);
};

  const totalCobrado = tareas
    .filter(t => t.estado === 'cobrada')
    .reduce((sum, t) => sum + (t.monto || 0), 0);

  const totalPendiente = tareas
    .filter(t => t.estado === 'finalizada')
    .reduce((sum, t) => sum + (t.monto || 0), 0);

  const tareasActivas = tareas.filter(t => t.estado !== 'cobrada').length;

  const exportToPDF = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          @page {
            margin: 2cm;
          }
        }
      `}</style>
      <div className="max-w-7xl mx-auto print-area">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-500">Vista general de tu negocio</p>
          </div>
          <Button 
            onClick={exportToPDF}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30 no-print"
          >
            <FileText className="w-4 h-4 mr-2" />
            Exportar a PDF
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Clientes"
            value={clientes.length}
            icon={Users}
            gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
            subtitle="Clientes activos"
          />
          <StatCard
            title="Tareas Activas"
            value={tareasActivas}
            icon={CheckSquare}
            gradient="bg-gradient-to-br from-amber-500 to-orange-600"
            subtitle="Sin cobrar"
          />
          <StatCard
            title="Total Cobrado"
            value={`$${totalCobrado.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
            icon={DollarSign}
            gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
            subtitle="Pagos recibidos"
          />
          <StatCard
            title="Por Cobrar"
            value={`$${totalPendiente.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
            icon={AlertTriangle}
            gradient="bg-gradient-to-br from-red-500 to-pink-600"
            subtitle="Trabajos finalizados"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ChartTareasEstado tareas={tareas} />
          </div>
          <div>
            <TopClientes tareas={tareas} clientes={clientes} />
          </div>
        </div>

        <AlertsList tareas={tareas} clientes={clientes} />
      </div>
    </div>
  );
}