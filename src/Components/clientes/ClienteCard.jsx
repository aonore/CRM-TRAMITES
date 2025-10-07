import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Building2, Edit, Eye, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ClienteCard({ cliente, tareas, onEdit }) {
  const tareasCliente = tareas.filter(t => t.cliente_id === cliente.id);
  const totalCobrado = tareasCliente
    .filter(t => t.estado === 'cobrada')
    .reduce((sum, t) => sum + (t.monto || 0), 0);
  const totalPendiente = tareasCliente
    .filter(t => t.estado === 'finalizada')
    .reduce((sum, t) => sum + (t.monto || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300 overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity duration-300" />
        <CardContent className="p-6 relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{cliente.nombre_completo}</h3>
              {cliente.empresa && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm">{cliente.empresa}</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onEdit(cliente)}
                className="hover:bg-blue-50 hover:text-blue-600"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Link to={`${createPageUrl('ClienteDetalle')}?id=${cliente.id}`}>
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mail className="w-4 h-4" />
              <span>{cliente.email}</span>
            </div>
            {cliente.telefono && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="w-4 h-4" />
                <span>{cliente.telefono}</span>
              </div>
            )}
            {cliente.ciudad && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4" />
                <span>{cliente.ciudad}{cliente.pais ? `, ${cliente.pais}` : ''}</span>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 pt-4 mt-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-slate-500">Tareas</span>
              <Badge variant="secondary">{tareasCliente.length}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-emerald-50 rounded-lg">
                <div className="flex items-center gap-1 text-emerald-600 text-xs mb-1">
                  <DollarSign className="w-3 h-3" />
                  <span className="font-medium">Cobrado</span>
                </div>
                <p className="text-lg font-bold text-emerald-700">
                  ${totalCobrado.toLocaleString('es-ES', { minimumFractionDigits: 0 })}
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-1 text-amber-600 text-xs mb-1">
                  <DollarSign className="w-3 h-3" />
                  <span className="font-medium">Pendiente</span>
                </div>
                <p className="text-lg font-bold text-amber-700">
                  ${totalPendiente.toLocaleString('es-ES', { minimumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}