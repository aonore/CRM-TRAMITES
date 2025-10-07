import React, { useState, useEffect } from "react";
import { Tarea } from "@/entities/Tarea";
import { Cliente } from "@/entities/Cliente";
import { Button } from "@/components/ui/button";
import { FileText, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { isWithinInterval, parseISO, format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import FiltrosCobros from "../components/cobros/FiltrosCobros";
import ResumenCobros from "../components/cobros/ResumenCobros";

export default function Cobros() {
  const [tareas, setTareas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [tareasData, clientesData] = await Promise.all([
      Tarea.filter({ estado: 'cobrada' }, '-fecha_cobro'),
      Cliente.list()
    ]);
    setTareas(tareasData);
    setClientes(clientesData);
    setIsLoading(false);
  };

  const getClienteById = (clienteId) => {
    return clientes.find(c => c.id === clienteId);
  };

  const filteredCobros = tareas.filter(tarea => {
    const matchesCliente = clienteSeleccionado === 'all' || tarea.cliente_id === clienteSeleccionado;
    
    let matchesFechas = true;
    if (tarea.fecha_cobro && (fechaDesde || fechaHasta)) {
      const fechaCobro = parseISO(tarea.fecha_cobro);
      
      if (fechaDesde && fechaHasta) {
        matchesFechas = isWithinInterval(fechaCobro, {
          start: parseISO(fechaDesde),
          end: parseISO(fechaHasta)
        });
      } else if (fechaDesde) {
        matchesFechas = fechaCobro >= parseISO(fechaDesde);
      } else if (fechaHasta) {
        matchesFechas = fechaCobro <= parseISO(fechaHasta);
      }
    }

    return matchesCliente && matchesFechas;
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
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Cobros</h1>
            <p className="text-slate-500">Historial completo de pagos recibidos</p>
          </div>
          <Button
            onClick={exportToPDF}
            disabled={filteredCobros.length === 0}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30 no-print"
          >
            <FileText className="w-4 h-4 mr-2" />
            Exportar a PDF
          </Button>
        </div>

        <div className="no-print">
          <FiltrosCobros
            fechaDesde={fechaDesde}
            fechaHasta={fechaHasta}
            clienteSeleccionado={clienteSeleccionado}
            clientes={clientes}
            onFechaDesdeChange={setFechaDesde}
            onFechaHastaChange={setFechaHasta}
            onClienteChange={setClienteSeleccionado}
          />
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}
            </div>
            <Skeleton className="h-96" />
          </div>
        ) : (
          <>
            <ResumenCobros cobros={filteredCobros} />

            <Card className="border-0 shadow-lg shadow-slate-200/50">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-xl font-bold text-slate-900">
                  Listado de Cobros ({filteredCobros.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {filteredCobros.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      No se encontraron cobros
                    </h3>
                    <p className="text-slate-500 mb-6">
                      {fechaDesde || fechaHasta || clienteSeleccionado !== 'all' 
                        ? 'Intenta ajustar los filtros de búsqueda'
                        : 'Aún no hay tareas cobradas en el sistema'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50">
                          <TableHead className="font-semibold text-slate-900">Fecha de Cobro</TableHead>
                          <TableHead className="font-semibold text-slate-900">Cliente</TableHead>
                          <TableHead className="font-semibold text-slate-900">Empresa</TableHead>
                          <TableHead className="font-semibold text-slate-900">Tarea</TableHead>
                          <TableHead className="font-semibold text-slate-900">Descripción</TableHead>
                          <TableHead className="font-semibold text-slate-900 text-right">Monto</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCobros.map((tarea, index) => {
                          const cliente = getClienteById(tarea.cliente_id);
                          return (
                            <TableRow 
                              key={tarea.id}
                              className={`hover:bg-slate-50 transition-colors ${
                                index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                              }`}
                            >
                              <TableCell className="font-medium">
                                {tarea.fecha_cobro ? (
                                  <div>
                                    <p className="font-semibold text-slate-900">
                                      {format(parseISO(tarea.fecha_cobro), "dd/MM/yyyy")}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {format(parseISO(tarea.fecha_cobro), "EEEE", { locale: es })}
                                    </p>
                                  </div>
                                ) : (
                                  <span className="text-slate-400">Sin fecha</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-semibold text-slate-900">{cliente?.nombre_completo || 'N/A'}</p>
                                  {cliente?.email && (
                                    <p className="text-xs text-slate-500">{cliente.email}</p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {cliente?.empresa ? (
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    {cliente.empresa}
                                  </Badge>
                                ) : (
                                  <span className="text-slate-400 text-sm">-</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <p className="font-medium text-slate-900">{tarea.titulo}</p>
                              </TableCell>
                              <TableCell>
                                {tarea.descripcion ? (
                                  <p className="text-sm text-slate-600 line-clamp-2 max-w-md">
                                    {tarea.descripcion}
                                  </p>
                                ) : (
                                  <span className="text-slate-400 text-sm">Sin descripción</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <p className="text-lg font-bold text-emerald-700">
                                  ${tarea.monto.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}