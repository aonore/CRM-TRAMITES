import React, { useState, useEffect } from "react";
import { Cliente } from "@/entities/Cliente";
import { Tarea } from "@/entities/Tarea";
import { Button } from "@/components/ui/button";
import { Plus, Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

import ClienteForm from "../components/clientes/ClienteForm";
import ClienteCard from "../components/clientes/ClienteCard";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [clientesData, tareasData] = await Promise.all([
      Cliente.list('-created_date'),
      Tarea.list()
    ]);
    setClientes(clientesData);
    setTareas(tareasData);
    setIsLoading(false);
  };

  const handleSubmit = async (clienteData) => {
    if (editingCliente) {
      await Cliente.update(editingCliente.id, clienteData);
    } else {
      await Cliente.create(clienteData);
    }
    setShowForm(false);
    setEditingCliente(null);
    loadData();
  };

  const handleEdit = (cliente) => {
    setEditingCliente(cliente);
    setShowForm(true);
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Clientes</h1>
            <p className="text-slate-500">Gestiona tu cartera de clientes</p>
          </div>
          <div className="flex gap-3 no-print">
            <Button
              variant="outline"
              onClick={exportToPDF}
              disabled={clientes.length === 0}
            >
              <FileText className="w-4 h-4 mr-2" />
              Exportar a PDF
            </Button>
            <Button
              onClick={() => {
                setEditingCliente(null);
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Cliente
            </Button>
          </div>
        </div>

        <div className="mb-6 no-print">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Buscar clientes por nombre, empresa o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-slate-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        ) : filteredClientes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {searchTerm ? 'No se encontraron clientes' : 'No hay clientes'}
            </h3>
            <p className="text-slate-500 mb-6">
              {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando tu primer cliente'}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white no-print"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Cliente
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredClientes.map(cliente => (
                <ClienteCard
                  key={cliente.id}
                  cliente={cliente}
                  tareas={tareas}
                  onEdit={handleEdit}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        <AnimatePresence>
          {showForm && (
            <ClienteForm
              cliente={editingCliente}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingCliente(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}