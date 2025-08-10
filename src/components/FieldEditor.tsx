import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  IconButton,
  Typography,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Checkbox,
} from '@mui/material';
import {
  Delete,
  Edit,
  DragHandle,
  Add,
  Close,
} from '@mui/icons-material';
import { FormField, ValidationRule, FieldOption } from '../types/form';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { updateField, deleteField } from '../store/formSlice';

interface FieldEditorProps {
  field: FormField;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ field }) => {
  const dispatch = useAppDispatch();
  const { currentForm } = useAppSelector(state => state.form);
  const [isEditing, setIsEditing] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [showOptionsDialog, setShowOptionsDialog] = useState(false);
  const [showDerivedDialog, setShowDerivedDialog] = useState(false);

  const handleUpdate = (changes: Partial<FormField>) => {
    dispatch(updateField({ fieldId: field.id, changes }));
  };

  const handleDelete = () => {
    dispatch(deleteField(field.id));
  };

  const addValidationRule = (rule: ValidationRule) => {
    const newRules = [...field.validationRules, rule];
    handleUpdate({ validationRules: newRules });
  };

  const removeValidationRule = (index: number) => {
    const newRules = field.validationRules.filter((_, i) => i !== index);
    handleUpdate({ validationRules: newRules });
  };

  const addOption = (option: FieldOption) => {
    const newOptions = [...(field.options || []), option];
    handleUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = (field.options || []).filter((_, i) => i !== index);
    handleUpdate({ options: newOptions });
  };

  return (
    <>
      <Card sx={{ mb: 2, position: 'relative' }}>
        <Box sx={{ position: 'absolute', right: 8, top: 8, cursor: 'grab' }}>
          <DragHandle color="action" />
        </Box>
        
        <CardContent sx={{ pr: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {field.label || `${field.type} Field`}
            </Typography>
            <Chip
              label={field.type}
              size="small"
              color="primary"
              variant="outlined"
            />
            {field.required && (
              <Chip label="Required" size="small" color="error" variant="outlined" />
            )}
            {field.isDerived && (
              <Chip label="Derived" size="small" color="secondary" variant="outlined" />
            )}
          </Box>

          {isEditing && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Field Label"
                value={field.label}
                onChange={(e) => handleUpdate({ label: e.target.value })}
                fullWidth
                size="small"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={field.required}
                    onChange={(e) => handleUpdate({ required: e.target.checked })}
                  />
                }
                label="Required"
              />

              {(field.type === 'select' || field.type === 'radio') && (
                <Button
                  variant="outlined"
                  onClick={() => setShowOptionsDialog(true)}
                  startIcon={<Edit />}
                  size="small"
                >
                  Edit Options ({(field.options || []).length})
                </Button>
              )}

              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowValidationDialog(true)}
                sx={{ mt: 1, mb: 2 }}
              >
                Edit Validation
              </Button>

              <FormControlLabel
                control={
                  <Switch
                    checked={field.isDerived}
                    onChange={(e) => handleUpdate({ isDerived: e.target.checked })}
                  />
                }
                label="Derived Field"
              />

              {field.isDerived && (
                <Button
                  variant="outlined"
                  onClick={() => setShowDerivedDialog(true)}
                  startIcon={<Edit />}
                  size="small"
                >
                  Configure Derived Logic
                </Button>
              )}
            </Box>
          )}

          {!isEditing && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Validations: {field.validationRules.length}
                {(field.type === 'select' || field.type === 'radio') && 
                  ` • Options: ${(field.options || []).length}`
                }
              </Typography>
            </Box>
          )}
        </CardContent>

        <CardActions>
          <Button
            size="small"
            onClick={() => setIsEditing(!isEditing)}
            startIcon={<Edit />}
          >
            {isEditing ? 'Done' : 'Edit'}
          </Button>
          <IconButton
            size="small"
            onClick={handleDelete}
            color="error"
          >
            <Delete />
          </IconButton>
        </CardActions>
      </Card>

      {/* Validation Dialog */}
      <Dialog open={showValidationDialog} onClose={() => setShowValidationDialog(false)}>
        <DialogTitle>Edit Validation Rules</DialogTitle>
        <DialogContent>
          <List>
            {field.validationRules.map((rule, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={rule.type}
                  secondary={`${rule.message} ${rule.value ? `(${rule.value})` : ''}`}
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => removeValidationRule(index)} size="small">
                    <Close />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl size="small">
              <InputLabel>Rule Type</InputLabel>
              <Select
                value={'required'}
                onChange={(e) => {}}
                label="Rule Type"
              >
                <MenuItem value="required">Required</MenuItem>
                <MenuItem value="minLength">Min Length</MenuItem>
                <MenuItem value="maxLength">Max Length</MenuItem>
                <MenuItem value="email">Email Format</MenuItem>
                <MenuItem value="customPassword">Custom Password</MenuItem>
              </Select>
            </FormControl>
            
            {('minLength' === 'minLength' || 'maxLength' === 'maxLength') && (
              <TextField
                label="Length"
                type="number"
                value={''}
                onChange={(e) => {}}
                size="small"
              />
            )}
            
            <TextField
              label="Error Message"
              value={''}
              onChange={(e) => {}}
              size="small"
              multiline
              rows={2}
            />
            
            <Button
              variant="contained"
              onClick={() => {}}
              disabled={false}
              startIcon={<Add />}
            >
              Add Rule
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowValidationDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Options Dialog */}
      <OptionsDialog
        open={showOptionsDialog}
        onClose={() => setShowOptionsDialog(false)}
        options={field.options || []}
        onAddOption={addOption}
        onRemoveOption={removeOption}
      />

      {/* Derived Field Dialog */}
      <DerivedFieldDialog
        open={showDerivedDialog}
        onClose={() => setShowDerivedDialog(false)}
        field={field}
        availableFields={currentForm.fields.filter(f => f.id !== field.id)}
        onUpdate={handleUpdate}
      />
    </>
  );
};

// Options Dialog Component
const OptionsDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  options: FieldOption[];
  onAddOption: (option: FieldOption) => void;
  onRemoveOption: (index: number) => void;
}> = ({ open, onClose, options, onAddOption, onRemoveOption }) => {
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');

  const handleAddOption = () => {
    if (!label.trim() || !value.trim()) return;
    
    onAddOption({ label: label.trim(), value: value.trim() });
    setLabel('');
    setValue('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Field Options</DialogTitle>
      <DialogContent>
        <List>
          {options.map((option, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={option.label}
                secondary={option.value}
              />
              <ListItemSecondaryAction>
                <IconButton onClick={() => onRemoveOption(index)} size="small">
                  <Close />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Option Label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            size="small"
          />
          
          <TextField
            label="Option Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            size="small"
          />
          
          <Button
            variant="contained"
            onClick={handleAddOption}
            disabled={!label.trim() || !value.trim()}
            startIcon={<Add />}
          >
            Add Option
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

// Derived Field Dialog Component
const DerivedFieldDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  field: FormField;
  availableFields: FormField[];
  onUpdate: (updates: Partial<FormField>) => void;
}> = ({ open, onClose, field, availableFields, onUpdate }) => {
  const [selectedFields, setSelectedFields] = useState<string[]>(
    field.derivedField?.parentFieldIds || []
  );
  const [derivationType, setDerivationType] = useState(
    field.derivedField?.type || 'age'
  );
  const [customFormula, setCustomFormula] = useState(
    field.derivedField?.formula || ''
  );

  const handleSave = () => {
    onUpdate({
      derivedField: {
        parentFieldIds: selectedFields,
        type: derivationType,
        formula: customFormula,
      },
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Configure Derived Field</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <FormControl size="small">
            <InputLabel>Parent Fields</InputLabel>
            <Select
              multiple
              value={selectedFields}
              onChange={(e) => setSelectedFields(e.target.value as string[])}
              label="Parent Fields"
            >
              {availableFields.map((field) => (
                <MenuItem key={field.id} value={field.id}>
                  {field.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl size="small">
            <InputLabel>Derivation Type</InputLabel>
            <Select
              value={derivationType}
              onChange={(e) => setDerivationType(e.target.value as any)}
              label="Derivation Type"
            >
              <MenuItem value="age">Age from Date</MenuItem>
              <MenuItem value="sum">Sum</MenuItem>
              <MenuItem value="concat">Concatenate</MenuItem>
              <MenuItem value="custom">Custom Formula</MenuItem>
            </Select>
          </FormControl>
          
          {derivationType === 'custom' && (
            <TextField
              label="Custom Formula"
              value={customFormula}
              onChange={(e) => setCustomFormula(e.target.value)}
              size="small"
              multiline
              rows={3}
              helperText="Use field_[fieldId] syntax in your formula"
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={selectedFields.length === 0}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FieldEditor;