import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormField, FormSchema, FormState } from '../types/form';
import { v4 as uuidv4 } from 'uuid';

const initialState: FormState = {
  currentForm: {
    name: '',
    fields: [],
  },
  savedForms: JSON.parse(localStorage.getItem('formBuilder_savedForms') || '[]'),
  previewData: {},
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFormName: (state, action: PayloadAction<string>) => {
      state.currentForm.name = action.payload;
    },
    
    addField: (state, action: PayloadAction<Omit<FormField, 'id' | 'order'>>) => {
      const newField: FormField = {
        ...action.payload,
        id: uuidv4(),
        order: state.currentForm.fields.length,
      };
      state.currentForm.fields.push(newField);
    },
    
    updateField: (state, action: PayloadAction<{ fieldId: string; changes: Partial<FormField> }>) => {
      const { fieldId, changes } = action.payload;
      const field = state.currentForm.fields.find(f => f.id === fieldId);
      if (field) {
        Object.assign(field, changes);
      }
    },
    
    deleteField: (state, action: PayloadAction<string>) => {
      state.currentForm.fields = state.currentForm.fields
        .filter(field => field.id !== action.payload)
        .map((field, index) => ({ ...field, order: index }));
    },
    
    reorderFields: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload;
      const fields = [...state.currentForm.fields];
      const [movedField] = fields.splice(fromIndex, 1);
      fields.splice(toIndex, 0, movedField);
      
      state.currentForm.fields = fields.map((field, index) => ({ ...field, order: index }));
    },
    
    saveForm: (state) => {
      if (!state.currentForm.name.trim()) return;
      
      const newForm: FormSchema = {
        id: uuidv4(),
        name: state.currentForm.name,
        fields: state.currentForm.fields,
        createdAt: new Date().toISOString(),
      };
      
      state.savedForms.push(newForm);
      localStorage.setItem('formBuilder_savedForms', JSON.stringify(state.savedForms));
    },
    
    loadForm: (state, action: PayloadAction<string>) => {
      const form = state.savedForms.find(f => f.id === action.payload);
      if (form) {
        state.currentForm = {
          name: form.name,
          fields: form.fields,
        };
      }
    },
    
    clearForm: (state) => {
      state.currentForm = { name: '', fields: [] };
      state.previewData = {};
    },
    
    updatePreviewData: (state, action: PayloadAction<{ fieldId: string; value: any }>) => {
      const { fieldId, value } = action.payload;
      state.previewData[fieldId] = value;
      
      // Update derived fields
      state.currentForm.fields.forEach(field => {
        if (field.isDerived && field.derivedField) {
          const derivedValue = calculateDerivedValue(field, state.previewData, state.currentForm.fields);
          state.previewData[field.id] = derivedValue;
        }
      });
    },
    
    deleteForm: (state, action: PayloadAction<string>) => {
      state.savedForms = state.savedForms.filter(form => form.id !== action.payload);
      localStorage.setItem('formBuilder_savedForms', JSON.stringify(state.savedForms));
    },
  },
});

function calculateDerivedValue(field: FormField, previewData: Record<string, any>, allFields: FormField[]): any {
  if (!field.derivedField) return '';
  
  const { parentFieldIds, type, formula } = field.derivedField;
  const parentValues = parentFieldIds.map(id => previewData[id] || '');
  
  switch (type) {
    case 'age':
      if (parentValues[0]) {
        const birthDate = new Date(parentValues[0]);
        const today = new Date();
        return today.getFullYear() - birthDate.getFullYear() - 
               (today.getMonth() < birthDate.getMonth() || 
                (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0);
      }
      return '';
    
    case 'sum':
      return parentValues.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    
    case 'concat':
      return parentValues.filter(val => val).join(' ');
    
    case 'custom':
      try {
        return Function(...parentFieldIds.map(id => `field_${id}`), `return ${formula}`)(...parentValues);
      } catch {
        return '';
      }
    
    default:
      return '';
  }
}

export const { setFormName, saveForm, clearForm, reorderFields, updateField, addField, deleteField, deleteForm, loadForm, updatePreviewData } = formSlice.actions;
export default formSlice.reducer;