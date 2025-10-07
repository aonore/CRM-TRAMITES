import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock } from "lucide-react";
import Badge from "@/Components/ui/badge";
import { differenceInDays, format } from "date-fns";
import { es } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import User from "@/Entities/user";

export default function AlertsList({ tareas, clientes }) {
  const [diasAlertaGlobal, setDiasAlertaGlobal] = useState(7);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const userData = await User.me();
      setDiasAlertaGlobal(userData.dias_alerta_global || 7);
    } catch (error) {
      console.error("Error cargando configuración:", error);
    }
  };

  const getClienteById = (clienteId) => {
    return clientes.find(c => c.id === clienteId);
  };

  // IMPORTANTE: Excluir tareas cobradas - ya concluyeron y no necesitan seguimiento
  const tareasConAlerta = tareas.filter(tarea => {
    // Las tareas cobradas NO deben generar alertas
    if (tarea.estado === 'cobrada') return false;
    
    const ultimaActualizacion = tarea.ultima_actualizacion || tarea.updated_date;
    const diasSinActividad = differenceInDays(new Date(), new Date(ultimaActualizacion));
    
    // Solo mostrar alerta si supera los días configurados
    return diasSinActividad >= diasAlertaGlobal;
  });

  return (
    <Card className="border-0 shadow-lg shadow-slate-200/50">
      <CardHeader className="border-b border-slate-100 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Alertas de Inactividad
          <Badge variant="outline" className="ml-auto">
            {diasAlertaGlobal} días configurados
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {tareasConAlerta.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No hay tareas con alertas</p>
            <p className="text-xs text-slate-400 mt-1">
              Las tareas inactivas por más de {diasAlertaGlobal} días aparecerán aquí
            </p>
            <p className="text-xs text-slate-400 mt-1">
              (Las tareas cobradas no generan alertas)
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {tareasConAlerta.map((tarea, index) => {
                const cliente = getClienteById(tarea.cliente_id);
                const ultimaActualizacion = tarea.ultima_actualizacion || tarea.updated_date;
                const diasSinActividad = differenceInDays(new Date(), new Date(ultimaActualizacion));
                
                return (
                  <motion.div
                    key={tarea.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 bg-amber-50 border border-amber-200 rounded-xl hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{tarea.titulo}</h4>
                        <p className="text-sm text-slate-600">{cliente?.nombre_completo}</p>
                      </div>
                      <Badge className="bg-amber-500 text-white">
                        {diasSinActividad} días
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      Última actualización: {format(new Date(ultimaActualizacion), "d 'de' MMMM", { locale: es })}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}