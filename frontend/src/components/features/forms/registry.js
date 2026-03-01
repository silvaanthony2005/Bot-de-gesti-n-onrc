import RegisterUEHForm from './RegisterUEHForm';
import AppointmentForm from './AppointmentForm';

export const FormRegistry = {
  'REGISTRO_UEH': RegisterUEHForm,
  'AGENDAR_CITA': AppointmentForm,
  // Aquí podemos agregar más formularios a futuro
};

export const getFormById = (formId) => {
  return FormRegistry[formId] || null;
};
