import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, User } from "lucide-react";

export default function FiltrosCobros({ 
  fechaDesde, 
  fechaHasta, 
  clienteSeleccionado,
  clientes,
  onFechaDesdeChange,
  onFechaHastaChange,
  onClienteChange
}) {
  return (
    <Card className="border-0 shadow-lg shadow-slate-200/50 mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Filtros de Búsqueda</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fecha_desde" className="flex items-center gap-2 text-slate-700">
              <Calendar className="w-4 h-4" />
              Fecha Desde
            </Label>
            <Input
              id="fecha_desde"
              type="date"
              value={fechaDesde}
              onChange={(e) => onFechaDesdeChange(e.target.value)}
              className="h-11 border-slate-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha_hasta" className="flex items-center gap-2 text-slate-700">
              <Calendar className="w-4 h-4" />
              Fecha Hasta
            </Label>
            <Input
              id="fecha_hasta"
              type="date"
              value={fechaHasta}
              onChange={(e) => onFechaHastaChange(e.target.value)}
              className="h-11 border-slate-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cliente" className="flex items-center gap-2 text-slate-700">
              <User className="w-4 h-4" />
              Cliente
            </Label>
            <Select value={clienteSeleccionado} onValueChange={onClienteChange}>
              <SelectTrigger className="h-11 border-slate-200 focus:border-blue-400 focus:ring-blue-400">
                <SelectValue placeholder="Todos los clientes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los clientes</SelectItem>
                {clientes.map(cliente => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    {cliente.nombre_completo} {cliente.empresa ? `- ${cliente.empresa}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}