import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const RegisterUEHForm = ({ onSubmit, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Registrador
    nombre1r: "Registrador", apellido1r: "Principal", cedula: "V-999999", 
    nombreuh: "Registro Civil San Cristóbal",

    // Unido 1
    nombre1Unido: '', apellido1Unido: '', numDocumentoUnido: '',
    fechaNacUnido: '', edadUnido: '', nacionalidadUnido: 'Venezolano',
    profesionUnido: '', direccionUnido: '',

    // Unida 2
    nombre1Unida: '', apellido1Unida: '', numDocumentoUnida: '',
    fechaNacUnida: '', edadUnida: '', nacionalidadUnida: 'Venezolana',
    profesionUnida: '', direccionUnida: '',

    // Testigos
    nombresTestigo1: '', apellidosTestigo1: '', docidentidadTestigo1: '',
    nombresTestigo2: '', apellidosTestigo2: '', docidentidadTestigo2: '',
    
    // Meta
    nombrestado: "Táchira", nombremunicipio: "San Cristóbal", nombreparroquia: "La Concordia"
  });

  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevenir envío accidental con Enter si no estamos en el último paso
    if (step < 3) {
      nextStep();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/documents/generate-ueh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setPdfUrl(url);
        if (onSubmit) onSubmit("Registro completado. Descarga tu certificado oficial.");
      } else {
        alert("Error en el servidor al generar PDF");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  if (pdfUrl) {
    return (
      <Card className="p-6 bg-green-50 border-green-200">
        <h3 className="text-xl font-bold text-green-800 mb-4">¡Acta Generada!</h3>
        <a href={pdfUrl} download="acta_ueh.pdf">
          <Button className="w-full bg-green-600 hover:bg-green-700">Descargar PDF</Button>
        </a>
      </Card>
    );
  }

  return (
    <Card className="p-4 w-full max-w-2xl mx-auto bg-white shadow-lg mt-4 text-gray-800">
      <h3 className="text-lg font-bold mb-4 text-blue-900 border-b pb-2">
        Registro Civil - Unión Estable de Hecho (Paso {step}/3)
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* PASO 1: UNIDO DE HECHO */}
        {step === 1 && (
          <div className="space-y-3 animation-fade-in">
            <h4 className="font-semibold text-blue-700 bg-blue-50 p-2 rounded">Datos del Primer Declarante</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input name="nombre1Unido" placeholder="Nombres" required onChange={handleChange} value={formData.nombre1Unido} />
              <Input name="apellido1Unido" placeholder="Apellidos" required onChange={handleChange} value={formData.apellido1Unido} />
              <Input name="numDocumentoUnido" placeholder="Cédula" required onChange={handleChange} value={formData.numDocumentoUnido} />
              <Input name="fechaNacUnido" type="date" placeholder="Fecha Nacimiento" required onChange={handleChange} value={formData.fechaNacUnido} />
              <Input name="edadUnido" placeholder="Edad" type="number" onChange={handleChange} value={formData.edadUnido} />
              <Input name="nacionalidadUnido" placeholder="Nacionalidad" onChange={handleChange} value={formData.nacionalidadUnido} />
              <Input name="profesionUnido" placeholder="Profesión" onChange={handleChange} value={formData.profesionUnido} />
              <Input name="direccionUnido" placeholder="Dirección de Residencia" className="col-span-2" onChange={handleChange} value={formData.direccionUnido} />
            </div>
          </div>
        )}

        {/* PASO 2: UNIDA DE HECHO */}
        {step === 2 && (
          <div className="space-y-3 animation-fade-in">
            <h4 className="font-semibold text-pink-700 bg-pink-50 p-2 rounded">Datos del Segundo Declarante</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input name="nombre1Unida" placeholder="Nombres" required onChange={handleChange} value={formData.nombre1Unida} />
              <Input name="apellido1Unida" placeholder="Apellidos" required onChange={handleChange} value={formData.apellido1Unida} />
              <Input name="numDocumentoUnida" placeholder="Cédula" required onChange={handleChange} value={formData.numDocumentoUnida} />
              <Input name="fechaNacUnida" type="date" placeholder="Fecha Nacimiento" required onChange={handleChange} value={formData.fechaNacUnida} />
              <Input name="edadUnida" placeholder="Edad" type="number" onChange={handleChange} value={formData.edadUnida} />
              <Input name="nacionalidadUnida" placeholder="Nacionalidad" onChange={handleChange} value={formData.nacionalidadUnida} />
              <Input name="profesionUnida" placeholder="Profesión" onChange={handleChange} value={formData.profesionUnida} />
              <Input name="direccionUnida" placeholder="Dirección de Residencia" className="col-span-2" onChange={handleChange} value={formData.direccionUnida} />
            </div>
          </div>
        )}

        {/* PASO 3: TESTIGOS Y FINALIZAR */}
        {step === 3 && (
          <div className="space-y-3 animation-fade-in">
            <h4 className="font-semibold text-gray-700 bg-gray-50 p-2 rounded">Datos de Testigos</h4>
            
            <p className="text-xs font-bold uppercase text-gray-500">Testigo 1</p>
            <div className="grid grid-cols-2 gap-2">
               <Input name="nombresTestigo1" placeholder="Nombres" onChange={handleChange} value={formData.nombresTestigo1} />
               <Input name="apellidosTestigo1" placeholder="Apellidos" onChange={handleChange} value={formData.apellidosTestigo1} />
               <Input name="docidentidadTestigo1" placeholder="Cédula" onChange={handleChange} value={formData.docidentidadTestigo1} />
               <Input name="direccionTestigo1" placeholder="Dirección" onChange={handleChange} value={formData.direccionTestigo1} />
            </div>

            <p className="text-xs font-bold uppercase text-gray-500 mt-2">Testigo 2</p>
            <div className="grid grid-cols-2 gap-2">
               <Input name="nombresTestigo2" placeholder="Nombres" onChange={handleChange} value={formData.nombresTestigo2} />
               <Input name="apellidosTestigo2" placeholder="Apellidos" onChange={handleChange} value={formData.apellidosTestigo2} />
               <Input name="docidentidadTestigo2" placeholder="Cédula" onChange={handleChange} value={formData.docidentidadTestigo2} />
               <Input name="direccionTestigo2" placeholder="Dirección" onChange={handleChange} value={formData.direccionTestigo2} />
            </div>

            <div className="pt-4 border-t mt-4">
                <p className="text-xs text-center text-gray-500">Al procesar, certifica que los datos son verdaderos.</p>
            </div>
          </div>
        )}
        
        <div className="flex justify-between gap-2 pt-4">
          {step > 1 ? (
             <Button type="button" variant="outline" onClick={prevStep}>Atrás</Button>
          ) : (
             <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
          )}

          {step < 3 ? (
             <Button type="button" onClick={nextStep} className="bg-blue-600">Siguiente</Button>
          ) : (
             <Button type="submit" disabled={loading} className="bg-green-600 w-full ml-auto">
               {loading ? 'Generando Acta...' : 'Generar Documento PDF'}
             </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default RegisterUEHForm;
