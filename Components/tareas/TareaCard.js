import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, AlertCircle, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import DialogoFechaCobro from "./DialogoFechaCobro";

const ESTADO_COLORS = {
  iniciada: 'bg-amber-100 text-amber-800 border-amber-200',
  en_proceso: 'bg-blue-100 text-blue-800 border-blue-200',
  finalizada: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cobrada: 'bg-purple-100 text-purple-800 border-purple-200'
};

const ESTADO_LABELS = {
  iniciada: 'Iniciada',
  en_proceso: 'En Proceso',
  finalizada: 'Finalizada',
  cobrada: 'Cobrada'
};

export default function TareaCard({ tarea, cliente, onEdit, onEstadoChange, onDelete }) {
  const [showDialogoCobro, setShowDialogoCobro] = useState(false);
  
  const ultimaActualizacion = tarea.ultima_actualizacion || tarea.updated_date;
  const diasSinActividad = differenceInDays(new Date(), new Date(ultimaActualizacion));
  const mostrarAlerta = diasSinActividad >= (cliente?.dias_alerta || 7) && tarea.estado !== 'cobrada';

  const handleEstadoChange = (nuevoEstado) => {
    if (nuevoEstado === 'cobrada') {
      setShowDialogoCobro(true);
    } else {
      onEstadoChange(tarea, nuevoEstado);
    }
  };

  const handleConfirmarCobro = (fechaCobro) => {
    onEstadoChange(tarea, 'cobrada', fechaCobro);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={`border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all duration-300 overflow-hidden ${
          mostrarAlerta ? 'ring-2 ring-amber-400' : ''
        }`}>
          {mostrarAlerta && (
            <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span className="text-xs text-amber-700 font-medium">
                Sin actividad hace {diasSinActividad} días
              </span>
            </div>
          )}
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-1">{tarea.titulo}</h3>
                <p className="text-sm text-slate-600">{cliente?.nombre_completo}</p>
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Badge 
                      className={`${ESTADO_COLORS[tarea.estado]} border cursor-pointer hover:opacity-80`}
                    >
                      {ESTADO_LABELS[tarea.estado]}
                    </Badge>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleEstadoChange('iniciada')}>
                      Iniciada
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEstadoChange('en_proceso')}>
                      En Proceso
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEstadoChange('finalizada')}>
                      Finalizada
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEstadoChange('cobrada')}>
                      Cobrada
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onEdit(tarea)}
                  className="hover:bg-blue-50 hover:text-blue-600"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar tarea?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se eliminará permanentemente la tarea "{tarea.titulo}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(tarea.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {tarea.descripcion && (
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{tarea.descripcion}</p>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <div>
                {tarea.fecha_inicio && (
                  <p className="text-xs text-slate-500">
                    Inicio: {format(new Date(tarea.fecha_inicio), "d MMM yyyy", { locale: es })}
                  </p>
                )}
                {tarea.estado === 'cobrada' && tarea.fecha_cobro && (
                  <p className="text-xs text-emerald-600 font-medium">
                    Cobrado: {format(new Date(tarea.fecha_cobro), "d MMM yyyy", { locale: es })}
                  </p>
                )}
                {ultimaActualizacion && tarea.estado !== 'cobrada' && (
                  <p className="text-xs text-slate-400">
                    Actualizado: {format(new Date(ultimaActualizacion), "d MMM", { locale: es })}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-900">
                  ${tarea.monto.toLocaleString('es-ES', { minimumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <DialogoFechaCobro
        open={showDialogoCobro}
        onOpenChange={setShowDialogoCobro}
        onConfirm={handleConfirmarCobro}
        tarea={tarea}
      />
    </>
  );
}