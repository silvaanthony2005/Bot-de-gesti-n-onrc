import RegisterUEHForm from './RegisterUEHForm';

export const FormRegistry = {
  'REGISTRO_UEH': RegisterUEHForm,
  // Aquí podemos agregar más formularios a futuro
};

export const getFormById = (formId) => {
  return FormRegistry[formId] || null;
};
