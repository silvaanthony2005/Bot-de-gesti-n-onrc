import React, { useRef, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const Field = ({ label, required = true, ...props }) => (
  <label className="flex flex-col gap-1 text-sm text-gray-300">
    <span className="font-medium text-gray-400">{label}</span>
    <input
      {...props}
      required={required}
      className="w-full bg-transparent border-0 border-b border-white/20 px-0 py-2 text-gray-100 placeholder:text-gray-500 focus:border-primary-500 focus:ring-0 outline-none"
    />
  </label>
);

const SelectField = ({ label, children, required = true, ...props }) => (
  <label className="flex flex-col gap-1 text-sm text-gray-300">
    <span className="font-medium text-gray-400">{label}</span>
    <select
      {...props}
      required={required}
      className="w-full bg-transparent border-0 border-b border-white/20 px-0 py-2 text-gray-100 focus:border-primary-500 focus:ring-0 outline-none"
    >
      {children}
    </select>
  </label>
);

const RegisterUEHForm = ({ onSubmit, onCancel }) => {
  const formRef = useRef(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    tipoActa: '',
    // Registrador
    nombre1r: "Registrador", apellido1r: "Principal", cedula: "V-999999", 
    nombreuh: "Registro Civil San Cristóbal",

    // Unido 1
    nombre1Unido: '', nombre2Unido: '', apellido1Unido: '', apellido2Unido: '', numDocumentoUnido: '',
    tipoDocUnido: 'CEDULA',
    fechaNacUnido: '', edadUnido: '', nacionalidadUnido: 'Venezolano',
    paisNacUnido: 'Venezuela',
    edoCivilUnido: '',
    profesionUnido: '', direccionUnido: '',
    estadoNacUnido: '', municipioNacUnido: '',

    // Unida 2
    nombre1Unida: '', nombre2Unida: '', apellido1Unida: '', apellido2Unida: '', numDocumentoUnida: '',
    tipoDocUnida: 'CEDULA',
    fechaNacUnida: '', edadUnida: '', nacionalidadUnida: 'Venezolana',
    paisNacUnida: 'Venezuela',
    edoCivilUnida: '',
    profesionUnida: '', direccionUnida: '',
    estadoNacUnida: '', municipioNacUnida: '',

    // Testigos
    nombresTestigo1: '', apellidosTestigo1: '', tipoDocTestigo1: 'CEDULA', docidentidadTestigo1: '', edadTestigo1: '', nacionalidadTestigo1: '', profesionTestigo1: '',
    nombresTestigo2: '', apellidosTestigo2: '', tipoDocTestigo2: 'CEDULA', docidentidadTestigo2: '', edadTestigo2: '', nacionalidadTestigo2: '', profesionTestigo2: '',
    
    // Meta
    nombrestado: "Táchira", nombremunicipio: "San Cristóbal", nombreparroquia: "La Concordia"
  });

  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    if (step !== 3) return;

    if (formRef.current && !formRef.current.checkValidity()) {
      formRef.current.reportValidity();
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
      <Card className="p-6 bg-dark-800/80 border border-emerald-500/30 rounded-2xl">
        <h3 className="text-xl font-bold text-emerald-300 mb-4">¡Acta Generada!</h3>
        <a href={pdfUrl} download="acta_ueh.pdf">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Descargar PDF</Button>
        </a>
      </Card>
    );
  }

  return (
    <Card className="p-5 md:p-6 w-full max-w-4xl mx-auto bg-dark-800/80 backdrop-blur-xl border border-white/10 shadow-xl mt-4 text-gray-100 rounded-2xl">
      <h3 className="text-xl font-semibold mb-5 text-white border-b border-white/10 pb-3">
        Registro Civil - INSERCION DE ACTAS (Paso {step}/3)
      </h3>
      <form
        ref={formRef}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        }}
        className="space-y-4"
      >
        
        {/* PASO 1: UNIDO DE HECHO */}
        {step === 1 && (
          <div className="space-y-5 animation-fade-in">
            <div className="rounded-xl border border-white/10 bg-dark-900/40 p-4">
              <h4 className="font-semibold text-gray-100 mb-3">Tipo de Acta</h4>
              <SelectField
                label="Trámite"
              name="tipoActa"
              required
              onChange={handleChange}
              value={formData.tipoActa}
            >
              <option value="">Seleccionar tipo de acta</option>
              <option value="UNION ESTABLE">UNION ESTABLE</option>
              <option value="DEFUNCION">DEFUNCION</option>
              <option value="NACIONALIDAD">NACIONALIDAD</option>
              <option value="NACIMIENTO">NACIMIENTO</option>
              <option value="CAPACIDAD">CAPACIDAD</option>
              <option value="MATRIMONIO">MATRIMONIO</option>
              </SelectField>
            </div>

            <div className="rounded-xl border border-white/10 bg-dark-900/40 p-4">
              <h4 className="font-semibold text-gray-100 mb-3">Ubicación del Acta</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Estado" name="nombrestado" placeholder="Ej: Táchira" required onChange={handleChange} value={formData.nombrestado} />
                <Field label="Municipio" name="nombremunicipio" placeholder="Ej: San Cristóbal" required onChange={handleChange} value={formData.nombremunicipio} />
                <Field label="Parroquia" name="nombreparroquia" placeholder="Ej: La Concordia" required onChange={handleChange} value={formData.nombreparroquia} />
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-dark-900/40 p-4">
              <h4 className="font-semibold text-gray-100 mb-3">Datos del Primer Declarante</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Primer Nombre" name="nombre1Unido" placeholder="Nombres" required onChange={handleChange} value={formData.nombre1Unido} />
                <Field label="Segundo Nombre" name="nombre2Unido" placeholder="Segundo nombre" onChange={handleChange} value={formData.nombre2Unido} />
                <Field label="Primer Apellido" name="apellido1Unido" placeholder="Apellidos" required onChange={handleChange} value={formData.apellido1Unido} />
                <Field label="Segundo Apellido" name="apellido2Unido" placeholder="Segundo apellido" onChange={handleChange} value={formData.apellido2Unido} />
                <Field label="Documento" name="numDocumentoUnido" placeholder="Cédula o pasaporte" required onChange={handleChange} value={formData.numDocumentoUnido} />
                <SelectField label="Tipo de Documento" name="tipoDocUnido" required onChange={handleChange} value={formData.tipoDocUnido}>
                  <option value="CEDULA">CÉDULA</option>
                  <option value="PASAPORTE">PASAPORTE</option>
                </SelectField>
                <Field label="Fecha de Nacimiento" name="fechaNacUnido" type="date" required onChange={handleChange} value={formData.fechaNacUnido} />
                <Field label="Edad" name="edadUnido" placeholder="Edad" type="number" onChange={handleChange} value={formData.edadUnido} />
                <Field label="Nacionalidad" name="nacionalidadUnido" placeholder="Nacionalidad" onChange={handleChange} value={formData.nacionalidadUnido} />
                <Field label="País de Nacimiento" name="paisNacUnido" placeholder="Ej: Venezuela" onChange={handleChange} value={formData.paisNacUnido} />
                <Field label="Estado Civil" name="edoCivilUnido" placeholder="Ej: Soltero(a)" onChange={handleChange} value={formData.edoCivilUnido} />
                <Field label="Profesión" name="profesionUnido" placeholder="Profesión" onChange={handleChange} value={formData.profesionUnido} />
                <Field label="Estado de Nacimiento" name="estadoNacUnido" placeholder="Estado" onChange={handleChange} value={formData.estadoNacUnido} />
                <Field label="Municipio de Nacimiento" name="municipioNacUnido" placeholder="Municipio" onChange={handleChange} value={formData.municipioNacUnido} />
                <div className="md:col-span-2">
                  <Field label="Dirección de Residencia" name="direccionUnido" placeholder="Dirección" onChange={handleChange} value={formData.direccionUnido} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PASO 2: UNIDA DE HECHO */}
        {step === 2 && (
          <div className="space-y-5 animation-fade-in">
            <div className="rounded-xl border border-white/10 bg-dark-900/40 p-4">
              <h4 className="font-semibold text-gray-100 mb-3">Datos del Segundo Declarante</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Primer Nombre" name="nombre1Unida" placeholder="Nombres" required onChange={handleChange} value={formData.nombre1Unida} />
                <Field label="Segundo Nombre" name="nombre2Unida" placeholder="Segundo nombre" onChange={handleChange} value={formData.nombre2Unida} />
                <Field label="Primer Apellido" name="apellido1Unida" placeholder="Apellidos" required onChange={handleChange} value={formData.apellido1Unida} />
                <Field label="Segundo Apellido" name="apellido2Unida" placeholder="Segundo apellido" onChange={handleChange} value={formData.apellido2Unida} />
                <Field label="Documento" name="numDocumentoUnida" placeholder="Cédula o pasaporte" required onChange={handleChange} value={formData.numDocumentoUnida} />
                <SelectField label="Tipo de Documento" name="tipoDocUnida" required onChange={handleChange} value={formData.tipoDocUnida}>
                  <option value="CEDULA">CÉDULA</option>
                  <option value="PASAPORTE">PASAPORTE</option>
                </SelectField>
                <Field label="Fecha de Nacimiento" name="fechaNacUnida" type="date" required onChange={handleChange} value={formData.fechaNacUnida} />
                <Field label="Edad" name="edadUnida" placeholder="Edad" type="number" onChange={handleChange} value={formData.edadUnida} />
                <Field label="Nacionalidad" name="nacionalidadUnida" placeholder="Nacionalidad" onChange={handleChange} value={formData.nacionalidadUnida} />
                <Field label="País de Nacimiento" name="paisNacUnida" placeholder="Ej: Venezuela" onChange={handleChange} value={formData.paisNacUnida} />
                <Field label="Estado Civil" name="edoCivilUnida" placeholder="Ej: Soltero(a)" onChange={handleChange} value={formData.edoCivilUnida} />
                <Field label="Profesión" name="profesionUnida" placeholder="Profesión" onChange={handleChange} value={formData.profesionUnida} />
                <Field label="Estado de Nacimiento" name="estadoNacUnida" placeholder="Estado" onChange={handleChange} value={formData.estadoNacUnida} />
                <Field label="Municipio de Nacimiento" name="municipioNacUnida" placeholder="Municipio" onChange={handleChange} value={formData.municipioNacUnida} />
                <div className="md:col-span-2">
                  <Field label="Dirección de Residencia" name="direccionUnida" placeholder="Dirección" onChange={handleChange} value={formData.direccionUnida} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PASO 3: TESTIGOS Y FINALIZAR */}
        {step === 3 && (
           <div className="space-y-5 animation-fade-in">
            <div className="rounded-xl border border-white/10 bg-dark-900/40 p-4">
            <h4 className="font-semibold text-gray-100 mb-3">Datos de Testigos</h4>
            
            <p className="text-xs font-semibold uppercase text-gray-400">Testigo 1</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Nombres" name="nombresTestigo1" placeholder="Nombres" onChange={handleChange} value={formData.nombresTestigo1} />
              <Field label="Apellidos" name="apellidosTestigo1" placeholder="Apellidos" onChange={handleChange} value={formData.apellidosTestigo1} />
              <SelectField label="Tipo de Documento" name="tipoDocTestigo1" onChange={handleChange} value={formData.tipoDocTestigo1}>
                <option value="CEDULA">CÉDULA</option>
                <option value="PASAPORTE">PASAPORTE</option>
              </SelectField>
              <Field label="Documento" name="docidentidadTestigo1" placeholder="Cédula" onChange={handleChange} value={formData.docidentidadTestigo1} />
              <Field label="Edad" name="edadTestigo1" placeholder="Edad" type="number" onChange={handleChange} value={formData.edadTestigo1} />
              <Field label="Nacionalidad" name="nacionalidadTestigo1" placeholder="Nacionalidad" onChange={handleChange} value={formData.nacionalidadTestigo1} />
              <Field label="Profesión" name="profesionTestigo1" placeholder="Profesión" onChange={handleChange} value={formData.profesionTestigo1} />
              <Field label="Dirección" name="direccionTestigo1" placeholder="Dirección" onChange={handleChange} value={formData.direccionTestigo1} />
            </div>

            <p className="text-xs font-semibold uppercase text-gray-400 mt-2">Testigo 2</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Nombres" name="nombresTestigo2" placeholder="Nombres" onChange={handleChange} value={formData.nombresTestigo2} />
              <Field label="Apellidos" name="apellidosTestigo2" placeholder="Apellidos" onChange={handleChange} value={formData.apellidosTestigo2} />
              <SelectField label="Tipo de Documento" name="tipoDocTestigo2" onChange={handleChange} value={formData.tipoDocTestigo2}>
                <option value="CEDULA">CÉDULA</option>
                <option value="PASAPORTE">PASAPORTE</option>
              </SelectField>
              <Field label="Documento" name="docidentidadTestigo2" placeholder="Cédula" onChange={handleChange} value={formData.docidentidadTestigo2} />
              <Field label="Edad" name="edadTestigo2" placeholder="Edad" type="number" onChange={handleChange} value={formData.edadTestigo2} />
              <Field label="Nacionalidad" name="nacionalidadTestigo2" placeholder="Nacionalidad" onChange={handleChange} value={formData.nacionalidadTestigo2} />
              <Field label="Profesión" name="profesionTestigo2" placeholder="Profesión" onChange={handleChange} value={formData.profesionTestigo2} />
              <Field label="Dirección" name="direccionTestigo2" placeholder="Dirección" onChange={handleChange} value={formData.direccionTestigo2} />
            </div>

            <div className="pt-4 border-t border-white/10 mt-4">
              <p className="text-xs text-center text-gray-400">Al procesar, certifica que los datos son verdaderos.</p>
            </div>
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
             <Button type="button" onClick={nextStep} className="bg-indigo-600 hover:bg-indigo-700">Siguiente</Button>
          ) : (
             <Button type="button" onClick={handleSubmit} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 w-full ml-auto">
               {loading ? 'Generando Acta...' : 'Generar Documento PDF'}
             </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default RegisterUEHForm;
