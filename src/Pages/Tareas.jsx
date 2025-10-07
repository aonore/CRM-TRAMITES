import React, { useState, useEffect } from "react";
import { Tarea } from "@/entities/Tarea";
import { Cliente } from "@/entities/Cliente";
import { Button } from "@/components/ui/button";
import { Plus, Search, FileText, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

import TareaForm from "../components/tareas/TareaForm";
import TareaCard from "../components/tareas/TareaCard";

export default function Tareas() {
  const [tareas, setTareas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTarea, setEditingTarea] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [tareasData, clientesData] = await Promise.all([
      Tarea.list('-updated_date'),
      Cliente.list()
    ]);
    setTareas(tareasData);
    setClientes(clientesData);
    setIsLoading(false);
  };

  const handleSubmit = async (tareaData) => {
    if (editingTarea) {
      await Tarea.update(editingTarea.id, tareaData);
    } else {
      await Tarea.create(tareaData);
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
      updateData.fecha_cobro = fechaCobro || new Date().toISOString().split('T')[0];
    }

    await Tarea.update(tarea.id, updateData);
    loadData();
  };

  const handleEdit = (tarea) => {
    setEditingTarea(tarea);
    setShowForm(true);
  };

  const handleDelete = async (tareaId) => {
    await Tarea.delete(tareaId);
    loadData();
  };

  const getClienteById = (clienteId) => {
    return clientes.find(c => c.id === clienteId);
  };

  const filteredTareas = tareas.filter(tarea => {
    const cliente = getClienteById(tarea.cliente_id);
    const matchesSearch = tarea.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente?.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = estadoFilter === 'all' || tarea.estado === estadoFilter;
    return matchesSearch && matchesEstado;
  });

  const exportToPDF = () => {
    window.print();
  };

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
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Tareas</h1>
            <p className="text-slate-500">Gestiona el trabajo de tus clientes</p>
          </div>
          <div className="flex gap-3 no-print">
            <Button
              variant="outline"
              onClick={exportToPDF}
              disabled={tareas.length === 0}
            >
              <FileText className="w-4 h-4 mr-2" />
              Exportar a PDF
            </Button>
            <Button
              onClick={() => {
                setEditingTarea(null);
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Tarea
            </Button>
          </div>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4 no-print">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Buscar tareas por título o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-slate-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
          <Select value={estadoFilter} onValueChange={setEstadoFilter}>
            <SelectTrigger className="w-full md:w-48 h-12">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Estados</SelectItem>
              <SelectItem value="iniciada">Iniciadas</SelectItem>
              <SelectItem value="en_proceso">En Proceso</SelectItem>
              <SelectItem value="finalizada">Finalizadas</SelectItem>
              <SelectItem value="cobrada">Cobradas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : filteredTareas.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {searchTerm || estadoFilter !== 'all' ? 'No se encontraron tareas' : 'No hay tareas'}
            </h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || estadoFilter !== 'all' ? 'Intenta ajustar los filtros' : 'Comienza agregando tu primera tarea'}
            </p>
            {!searchTerm && estadoFilter === 'all' && (
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white no-print"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Tarea
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredTareas.map(tarea => (
                <TareaCard
                  key={tarea.id}
                  tarea={tarea}
                  cliente={getClienteById(tarea.cliente_id)}
                  onEdit={handleEdit}
                  onEstadoChange={handleEstadoChange}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

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