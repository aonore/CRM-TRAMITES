import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Cliente } from "@/entities/Cliente";

export default function TareaForm({ tarea, onSubmit, onCancel }) {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState(tarea || {
    cliente_id: '',
    titulo: '',
    descripcion: '',
    estado: 'iniciada',
    monto: 0,
    fecha_inicio: '',
    fecha_finalizacion: '',
    fecha_cobro: '',
    ultima_actualizacion: new Date().toISOString()
  });

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    const data = await Cliente.list();
    setClientes(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      ultima_actualizacion: new Date().toISOString()
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">
            {tarea ? 'Editar Tarea' : 'Nueva Tarea'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cliente_id">Cliente *</Label>
            <Select
              value={formData.cliente_id}
              onValueChange={(value) => handleChange('cliente_id', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientes.map(cliente => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    {cliente.nombre_completo} {cliente.empresa ? `- ${cliente.empresa}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => handleChange('titulo', e.target.value)}
              placeholder="Diseño de sitio web"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
              placeholder="Detalles del trabajo a realizar..."
              rows={4}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={formData.estado}
                onValueChange={(value) => handleChange('estado', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iniciada">Iniciada</SelectItem>
                  <SelectItem value="en_proceso">En Proceso</SelectItem>
                  <SelectItem value="finalizada">Finalizada</SelectItem>
                  <SelectItem value="cobrada">Cobrada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monto">Monto ($)</Label>
              <Input
                id="monto"
                type="number"
                min="0"
                step="0.01"
                value={formData.monto}
                onChange={(e) => handleChange('monto', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
              <Input
                id="fecha_inicio"
                type="date"
                value={formData.fecha_inicio}
                onChange={(e) => handleChange('fecha_inicio', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_finalizacion">Fecha de Finalización</Label>
              <Input
                id="fecha_finalizacion"
                type="date"
                value={formData.fecha_finalizacion}
                onChange={(e) => handleChange('fecha_finalizacion', e.target.value)}
              />
            </div>
          </div>

          {formData.estado === 'cobrada' && (
            <div className="space-y-2">
              <Label htmlFor="fecha_cobro">Fecha de Cobro *</Label>
              <Input
                id="fecha_cobro"
                type="date"
                value={formData.fecha_cobro}
                onChange={(e) => handleChange('fecha_cobro', e.target.value)}
                required
              />
              <p className="text-xs text-slate-500">
                Esta fecha se usará para filtrar y ordenar en la sección de Cobros
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30"
            >
              {tarea ? 'Guardar Cambios' : 'Crear Tarea'}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}