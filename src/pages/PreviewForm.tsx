import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  Divider,
} from '@mui/material';
import { PlayArrow, Refresh } from '@mui/icons-material';
import FormRenderer from '../components/FormRenderer';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { updatePreviewData } from '../store/formSlice';
import { FormField, ValidationRule } from '../types/form';

const PreviewForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentForm, previewData } = useAppSelector(state => state.form);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Initialize default values
    currentForm.fields.forEach(field => {
      if (field.defaultValue !== undefined && !previewData[field.id]) {
        dispatch(updatePreviewData({ fieldId: field.id, value: field.defaultValue }));
      }
    });
  }, [currentForm.fields, previewData, dispatch]);

  const handleFieldChange = (fieldId: string, value: any) => {
    dispatch(updatePreviewData({ fieldId, value }));
    
    // Clear error for this field
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validateField = (field: FormField, value: any): string => {
    for (const rule of field.validationRules) {
      if (!isValidByRule(rule, value)) {
        return rule.message;
      }
    }
    return '';
  };

  const isValidByRule = (rule: ValidationRule, value: any): boolean => {
    switch (rule.type) {
      case 'required':
        return value !== undefined && value !== null && value !== '';
      case 'minLength':
        return !value || value.toString().length >= (rule.value as number);
      case 'maxLength':
        return !value || value.toString().length <= (rule.value as number);
      case 'email':
        return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'customPassword':
        return !value || (value.length >= 8 && /\d/.test(value));
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    
    currentForm.fields.forEach(field => {
      const value = previewData[field.id];
      const error = validateField(field, value);
      if (error) {
        newErrors[field.id] = error;
      }
    });
    
    setErrors(newErrors);
    setIsSubmitted(true);
    
    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted successfully:', previewData);
    }
  };

  const handleReset = () => {
    // Reset to default values
    const resetData: Record<string, any> = {};
    currentForm.fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        resetData[field.id] = field.defaultValue;
      }
    });
    
    // Dispatch all updates
    Object.entries(resetData).forEach(([fieldId, value]) => {
      dispatch(updatePreviewData({ fieldId, value }));
    });
    
    setErrors({});
    setIsSubmitted(false);
  };

  if (currentForm.fields.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          No Form to Preview
        </Typography>
        <Typography color="text.secondary">
          Create a form first to see the preview here.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Preview: {currentForm.name || 'Untitled Form'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This is how your form will appear to end users. Test all validations and interactions.
        </Typography>
      </Paper>

      {isSubmitted && Object.keys(errors).length === 0 && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Form submitted successfully! Check the console for the submitted data.
        </Alert>
      )}

      {isSubmitted && Object.keys(errors).length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Please fix the validation errors below before submitting.
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <FormRenderer
          fields={currentForm.fields}
          values={previewData}
          errors={errors}
          onChange={handleFieldChange}
        />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={handleReset}
            startIcon={<Refresh />}
            size="large"
          >
            Reset Form
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            startIcon={<PlayArrow />}
            size="large"
          >
            Submit Form
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PreviewForm;