import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign } from "lucide-react";

export default function TopClientes({ tareas, clientes }) {
  const clientesConIngresos = clientes.map(cliente => {
    const tareasCliente = tareas.filter(t => t.cliente_id === cliente.id);
    const totalCobrado = tareasCliente
      .filter(t => t.estado === 'cobrada')
      .reduce((sum, t) => sum + (t.monto || 0), 0);
    const totalPendiente = tareasCliente
      .filter(t => t.estado === 'finalizada')
      .reduce((sum, t) => sum + (t.monto || 0), 0);
    
    return {
      ...cliente,
      totalCobrado,
      totalPendiente,
      totalGeneral: totalCobrado + totalPendiente
    };
  }).sort((a, b) => b.totalGeneral - a.totalGeneral).slice(0, 5);

  return (
    <Card className="border-0 shadow-lg shadow-slate-200/50">
      <CardHeader className="border-b border-slate-100 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Top Clientes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {clientesConIngresos.map((cliente, index) => (
            <div key={cliente.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors duration-200">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900">{cliente.nombre_completo}</h4>
                <p className="text-xs text-slate-500">{cliente.empresa || 'Sin empresa'}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-emerald-600 font-bold">
                  <DollarSign className="w-4 h-4" />
                  {cliente.totalGeneral.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                {cliente.totalPendiente > 0 && (
                  <p className="text-xs text-amber-600">
                    ${cliente.totalPendiente.toLocaleString('es-ES', { minimumFractionDigits: 2 })} pendiente
                  </p>
                )}
              </div>
            </div>
          ))}
          {clientesConIngresos.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500 text-sm">No hay datos de clientes</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}