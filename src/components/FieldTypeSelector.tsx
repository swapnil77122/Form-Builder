import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from '@mui/material';
import {
  TextFields,
  Numbers,
  Notes,
  ArrowDropDown,
  RadioButtonChecked,
  CheckBox,
  DateRange,
  Add,
} from '@mui/icons-material';
import { FormField } from '../types/form';
import { useAppDispatch } from '../hooks/redux';
import { addField } from '../store/formSlice';

const fieldTypes = [
  { type: 'text' as const, label: 'Text', icon: <TextFields /> },
  { type: 'number' as const, label: 'Number', icon: <Numbers /> },
  { type: 'textarea' as const, label: 'Textarea', icon: <Notes /> },
  { type: 'select' as const, label: 'Select', icon: <ArrowDropDown /> },
  { type: 'radio' as const, label: 'Radio', icon: <RadioButtonChecked /> },
  { type: 'checkbox' as const, label: 'Checkbox', icon: <CheckBox /> },
  { type: 'date' as const, label: 'Date', icon: <DateRange /> },
];

const FieldTypeSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const [selectedType, setSelectedType] = useState<FormField['type'] | null>(null);
  const [fieldLabel, setFieldLabel] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const handleTypeSelect = (type: FormField['type']) => {
    setSelectedType(type);
    setFieldLabel('');
    setShowDialog(true);
  };

  const handleCreateField = () => {
    if (!selectedType || !fieldLabel.trim()) return;

    const newField: Omit<FormField, 'id' | 'order'> = {
      type: selectedType,
      label: fieldLabel.trim(),
      required: false,
      validationRules: [],
      isDerived: false,
    };

    dispatch(addField(newField));
    setShowDialog(false);
    setSelectedType(null);
    setFieldLabel('');
  };

  return (
    <>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add New Field
          </Typography>
          
          <Grid container spacing={2}>
            {fieldTypes.map(({ type, label, icon }) => (
              <Grid item xs={6} sm={4} md={3} key={type}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleTypeSelect(type)}
                  sx={{
                    height: 80,
                    flexDirection: 'column',
                    gap: 1,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'primary.50',
                    },
                  }}
                >
                  {icon}
                  <Typography variant="caption">{label}</Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Create {selectedType && fieldTypes.find(ft => ft.type === selectedType)?.label} Field
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              label="Field Label"
              value={fieldLabel}
              onChange={(e) => setFieldLabel(e.target.value)}
              fullWidth
              autoFocus
              placeholder="Enter field label..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateField}
            variant="contained"
            disabled={!fieldLabel.trim()}
            startIcon={<Add />}
          >
            Create Field
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FieldTypeSelector;