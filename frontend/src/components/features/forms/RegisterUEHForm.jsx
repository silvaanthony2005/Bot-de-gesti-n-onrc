import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const RegisterUEHForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre1: '', apellido1: '', cedular1: '',
    nombre2: '', apellido2: '', cedular2: ''
  });
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Aquí normalmente guardaríamos en BDD via backend
      // 2. Generamos el PDF
      const response = await fetch('http://localhost:8000/api/documents/generate-ueh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setPdfUrl(url);
        if (onSubmit) onSubmit("Registro completado exitosamente. Puede descargar su certificado.");
      }
    } catch (error) {
      console.error(error);
      alert("Error generando certificado");
    } finally {
      setLoading(false);
    }
  };

  if (pdfUrl) {
    return (
      <Card className="p-6 bg-green-50 border-green-200">
        <h3 className="text-xl font-bold text-green-800 mb-4">¡Registro Exitoso!</h3>
        <p className="mb-4">Su acta de Unión Estable de Hecho ha sido procesada.</p>
        <div className="flex gap-4">
          <a href={pdfUrl} download="certificado_ueh.pdf" className="w-full">
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Descargar Certificado PDF
            </Button>
          </a>
          <Button variant="outline" onClick={onCancel}>Cerrar</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 w-full max-w-lg mx-auto bg-white shadow-lg mt-4">
      <h3 className="text-lg font-bold mb-4 text-blue-900 border-b pb-2">
        Registro de Unión Estable de Hecho
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Declarante 1</h4>
            <Input name="nombre1" placeholder="Nombres" required onChange={handleChange} />
            <Input name="apellido1" placeholder="Apellidos" required onChange={handleChange} />
            <Input name="cedular1" placeholder="Cédula" required onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Declarante 2</h4>
            <Input name="nombre2" placeholder="Nombres" required onChange={handleChange} />
            <Input name="apellido2" placeholder="Apellidos" required onChange={handleChange} />
            <Input name="cedular2" placeholder="Cédula" required onChange={handleChange} />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="bg-blue-600">
            {loading ? 'Procesando...' : 'Registrar y Generar PDF'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default RegisterUEHForm;
