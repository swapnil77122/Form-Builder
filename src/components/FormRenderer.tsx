import React from 'react';
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  Box,
  Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FormField, ValidationRule } from '../types/form';

interface FormRendererProps {
  fields: FormField[];
  values: Record<string, any>;
  errors: Record<string, string>;
  onChange: (fieldId: string, value: any) => void;
}

const FormRenderer: React.FC<FormRendererProps> = ({ fields, values, errors, onChange }) => {
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

  const renderField = (field: FormField) => {
    const value = values[field.id] || '';
    const error = errors[field.id] || '';
    const hasError = !!error;

    const commonProps = {
      fullWidth: true,
      error: hasError,
      helperText: error,
      disabled: field.isDerived,
    };

    switch (field.type) {
      case 'text':
        return (
          <TextField
            {...commonProps}
            label={field.label}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            required={field.required}
          />
        );

      case 'number':
        return (
          <TextField
            {...commonProps}
            label={field.label}
            type="number"
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <TextField
            {...commonProps}
            label={field.label}
            multiline
            rows={4}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            required={field.required}
          />
        );

      case 'select':
        return (
          <FormControl {...commonProps} required={field.required}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value}
              onChange={(e) => onChange(field.id, e.target.value)}
              label={field.label}
            >
              {(field.options || []).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {hasError && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl component="fieldset" error={hasError} required={field.required}>
            <FormLabel component="legend">{field.label}</FormLabel>
            <RadioGroup
              value={value}
              onChange={(e) => onChange(field.id, e.target.value)}
            >
              {(field.options || []).map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {hasError && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControl error={hasError}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!value}
                  onChange={(e) => onChange(field.id, e.target.checked)}
                />
              }
              label={field.label}
            />
            {hasError && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );

      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={field.label}
              value={value ? dayjs(value) : null}
              onChange={(newValue) => onChange(field.id, newValue?.format('YYYY-MM-DD'))}
              slotProps={{
                textField: {
                  ...commonProps,
                  required: field.required,
                },
              }}
            />
          </LocalizationProvider>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {[...fields]
        .sort((a, b) => a.order - b.order)
        .map((field) => (
          <Paper key={field.id} sx={{ p: 2 }}>
            {renderField(field)}
            {field.isDerived && (
              <FormHelperText sx={{ mt: 1, fontStyle: 'italic' }}>
                This field is automatically calculated
              </FormHelperText>
            )}
          </Paper>
        ))}
    </Box>
  );
};

export default FormRenderer;