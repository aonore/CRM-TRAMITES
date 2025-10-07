import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, FileText, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function CobroCard({ tarea, cliente }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300 overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity duration-300" />
        <CardContent className="p-6 relative">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-1">{tarea.titulo}</h3>
              <div className="flex items-center gap-2 text-slate-600">
                <User className="w-4 h-4" />
                <span className="text-sm">{cliente?.nombre_completo}</span>
              </div>
              {cliente?.empresa && (
                <p className="text-xs text-slate-500 mt-1">{cliente.empresa}</p>
              )}
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 border">
              Cobrado
            </Badge>
          </div>

          {tarea.descripcion && (
            <div className="mb-4 p-3 bg-slate-50 rounded-lg">
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
                <p className="text-sm text-slate-600 line-clamp-2">{tarea.descripcion}</p>
              </div>
            </div>
          )}

          <div className="border-t border-slate-100 pt-4 mt-4 grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium">Fecha de Cobro</span>
              </div>
              <p className="text-sm font-semibold text-slate-900">
                {tarea.fecha_cobro ? format(new Date(tarea.fecha_cobro), "d 'de' MMMM, yyyy", { locale: es }) : 'No especificada'}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-emerald-600 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-medium">Monto</span>
              </div>
              <p className="text-2xl font-bold text-emerald-700">
                ${tarea.monto.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {tarea.fecha_inicio && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                Iniciado: {format(new Date(tarea.fecha_inicio), "d 'de' MMMM, yyyy", { locale: es })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}