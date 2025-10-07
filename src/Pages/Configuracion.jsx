import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Configuracion() {
  const [user, setUser] = useState(null);
  const [diasAlerta, setDiasAlerta] = useState(7);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      setDiasAlerta(userData.dias_alerta_global || 7);
    } catch (error) {
      console.error("Error cargando usuario:", error);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await User.updateMyUserData({ dias_alerta_global: diasAlerta });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      await loadUser();
    } catch (error) {
      console.error("Error guardando configuración:", error);
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Configuración</h1>
          <p className="text-slate-500">Personaliza el comportamiento del sistema</p>
        </div>

        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <Settings className="w-5 h-5 text-white" />
              </div>
              Alertas de Inactividad
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-medium mb-1">
                  ¿Qué son las alertas de inactividad?
                </p>
                <p className="text-sm text-blue-700">
                  El sistema te avisará cuando una tarea no haya sido actualizada en el número de días que configures aquí. 
                  Las tareas inactivas aparecerán destacadas en el Dashboard y en el listado de tareas.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dias_alerta" className="text-base font-semibold text-slate-900">
                  Días máximos sin actividad
                </Label>
                <p className="text-sm text-slate-500 mb-3">
                  Ingresa el número de días que puede pasar una tarea sin cambios antes de mostrar una alerta
                </p>
                <div className="flex items-center gap-4">
                  <Input
                    id="dias_alerta"
                    type="number"
                    min="1"
                    max="365"
                    value={diasAlerta}
                    onChange={(e) => setDiasAlerta(parseInt(e.target.value) || 1)}
                    className="max-w-xs h-12 text-lg font-semibold border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                  <span className="text-slate-600 font-medium">días</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="font-semibold text-slate-900 mb-2">Ejemplo:</h4>
                <p className="text-sm text-slate-600">
                  Si configuras <strong>{diasAlerta} días</strong>, todas las tareas que no hayan sido actualizadas 
                  en los últimos {diasAlerta} días mostrarán una alerta visual y aparecerán en la sección 
                  "Alertas de Inactividad" del Dashboard.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-500">
                  Usuario actual: <span className="font-medium text-slate-900">{user?.full_name}</span>
                </p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Configuración
                  </>
                )}
              </Button>
            </div>

            {showSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 animate-in fade-in duration-300">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-emerald-800 font-medium">
                  ¡Configuración guardada exitosamente!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900 mb-1">
                Nota importante
              </p>
              <p className="text-sm text-amber-700">
                Esta configuración afecta a todas las tareas activas del sistema. Las alertas se mostrarán 
                automáticamente cuando una tarea supere el período de inactividad configurado.
              </p>
              <p className="text-sm text-amber-700 mt-2 font-medium">
                ⚠️ Las tareas con estado "Cobrada" NO generan alertas de inactividad, 
                ya que se consideran finalizadas y no requieren seguimiento adicional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}