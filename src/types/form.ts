export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'customPassword';
  value?: number | string;
  message: string;
}

export interface FieldOption {
  value: string;
  label: string;
}

export interface DerivedField {
  parentFieldIds: string[];
  formula: string;
  type: 'age' | 'sum' | 'concat' | 'custom';
}

export interface FormField {
  id: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';
  label: string;
  required: boolean;
  defaultValue?: string | number | boolean | string[];
  validationRules: ValidationRule[];
  options?: FieldOption[];
  isDerived: boolean;
  derivedField?: DerivedField;
  order: number;
}

export interface FormSchema {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: string;
}

export interface FormState {
  currentForm: {
    name: string;
    fields: FormField[];
  };
  savedForms: FormSchema[];
  previewData: Record<string, any>;
}