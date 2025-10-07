import React, { useState, useEffect } from "react";
import { Cliente } from "@/entities/Cliente";
import { Tarea } from "@/entities/Tarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Phone, MapPin, Building2, AlertCircle, DollarSign, CheckSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence } from "framer-motion";
import TareaCard from "../components/tareas/TareaCard";
import TareaForm from "../components/tareas/TareaForm";

export default function ClienteDetalle() {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [tareas, setTareas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTarea, setEditingTarea] = useState(null);

  const urlParams = new URLSearchParams(window.location.search);
  const clienteId = urlParams.get('id');

  useEffect(() => {
    if (clienteId) {
      const loadData = async () => {
        setIsLoading(true);
        const [clienteData, tareasData] = await Promise.all([
          Cliente.list().then(clientes => clientes.find(c => c.id === clienteId)),
          Tarea.filter({ cliente_id: clienteId }, '-updated_date')
        ]);
        setCliente(clienteData);
        setTareas(tareasData);
        setIsLoading(false);
      };
      loadData();
    }
  }, [clienteId]);

  const loadData = async () => {
    setIsLoading(true);
    const [clienteData, tareasData] = await Promise.all([
      Cliente.list().then(clientes => clientes.find(c => c.id === clienteId)),
      Tarea.filter({ cliente_id: clienteId }, '-updated_date')
    ]);
    setCliente(clienteData);
    setTareas(tareasData);
    setIsLoading(false);
  };

  const handleSubmit = async (tareaData) => {
    if (editingTarea) {
      await Tarea.update(editingTarea.id, tareaData);
    } else {
      await Tarea.create({ ...tareaData, cliente_id: clienteId });
    }
    setShowForm(false);
    setEditingTarea(null);
    loadData();
  };

  const handleEstadoChange = async (tarea, nuevoEstado, fechaCobro = null) => {
    const updateData = {
      ...tarea,
      estado: nuevoEstado,
      ultima_actualizacion: new Date().toISOString()
    };

    if (nuevoEstado === 'finalizada' && !tarea.fecha_finalizacion) {
      updateData.fecha_finalizacion = new Date().toISOString().split('T')[0];
    }
    if (nuevoEstado === 'cobrada') {
      // Use provided fechaCobro if available, otherwise default to current date
      updateData.fecha_cobro = fechaCobro || new Date().toISOString().split('T')[0];
    }

    await Tarea.update(tarea.id, updateData);
    loadData();
  };

  if (isLoading || !cliente) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Cargando información del cliente...</p>
        </div>
      </div>
    );
  }

  const totalCobrado = tareas.filter(t => t.estado === 'cobrada').reduce((sum, t) => sum + (t.monto || 0), 0);
  const totalPendiente = tareas.filter(t => t.estado === 'finalizada').reduce((sum, t) => sum + (t.monto || 0), 0);
  const tareasActivas = tareas.filter(t => t.estado !== 'cobrada').length;

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl('Clientes'))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Clientes
        </Button>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1 border-0 shadow-lg shadow-slate-200/50">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-2xl font-bold text-slate-900">{cliente.nombre_completo}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {cliente.empresa && (
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-700">{cliente.empresa}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-slate-400" />
                <span className="text-slate-700">{cliente.email}</span>
              </div>
              {cliente.telefono && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-700">{cliente.telefono}</span>
                </div>
              )}
              {(cliente.ciudad || cliente.pais) && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-700">
                    {cliente.ciudad}{cliente.pais ? `, ${cliente.pais}` : ''}
                  </span>
                </div>
              )}
              {cliente.direccion && (
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-sm text-slate-500 mb-1">Dirección</p>
                  <p className="text-slate-700">{cliente.direccion}</p>
                </div>
              )}
              {cliente.notas && (
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-sm text-slate-500 mb-1">Notas</p>
                  <p className="text-slate-700 text-sm">{cliente.notas}</p>
                </div>
              )}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-500">
                    Alerta configurada: {cliente.dias_alerta} días
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg shadow-slate-200/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm text-slate-500">Tareas Activas</span>
                  </div>
                  <p className="text-3xl font-bold text-slate-900">{tareasActivas}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg shadow-slate-200/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-sm text-slate-500">Total Cobrado</span>
                  </div>
                  <p className="text-3xl font-bold text-emerald-600">
                    ${totalCobrado.toLocaleString('es-ES', { minimumFractionDigits: 0 })}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg shadow-slate-200/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="text-sm text-slate-500">Por Cobrar</span>
                  </div>
                  <p className="text-3xl font-bold text-amber-600">
                    ${totalPendiente.toLocaleString('es-ES', { minimumFractionDigits: 0 })}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-lg shadow-slate-200/50">
              <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold text-slate-900">Tareas del Cliente</CardTitle>
                <Button
                  onClick={() => {
                    setEditingTarea(null);
                    setShowForm(true);
                  }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                >
                  Nueva Tarea
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                {tareas.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No hay tareas para este cliente</p>
                    <Button
                      onClick={() => setShowForm(true)}
                      variant="outline"
                      className="mt-4"
                    >
                      Crear Primera Tarea
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    <AnimatePresence>
                      {tareas.map(tarea => (
                        <TareaCard
                          key={tarea.id}
                          tarea={tarea}
                          cliente={cliente}
                          onEdit={(t) => {
                            setEditingTarea(t);
                            setShowForm(true);
                          }}
                          onEstadoChange={handleEstadoChange}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <AnimatePresence>
          {showForm && (
            <TareaForm
              tarea={editingTarea}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingTarea(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}