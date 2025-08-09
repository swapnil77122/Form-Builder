import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
  Paper,
  Divider,
} from '@mui/material';
import { Save, Clear } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import FieldTypeSelector from '../components/FieldTypeSelector';
import FieldEditor from '../components/FieldEditor';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setFormName, saveForm, clearForm, reorderFields } from '../store/formSlice';

const CreateForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentForm } = useAppSelector(state => state.form);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const handleSaveForm = () => {
    if (!currentForm.name.trim()) {
      return;
    }
    
    dispatch(saveForm());
    setShowSuccessAlert(true);
  };

  const handleClearForm = () => {
    dispatch(clearForm());
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    dispatch(reorderFields({
      fromIndex: result.source.index,
      toIndex: result.destination.index,
    }));
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Create New Form
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
          <TextField
            label="Form Name"
            value={currentForm.name}
            onChange={(e) => dispatch(setFormName(e.target.value))}
            variant="outlined"
            size="medium"
            sx={{ flexGrow: 1 }}
            placeholder="Enter form name..."
          />
          
          <Button
            variant="contained"
            onClick={handleSaveForm}
            disabled={!currentForm.name.trim() || currentForm.fields.length === 0}
            startIcon={<Save />}
            sx={{ px: 3, py: 1.5 }}
          >
            Save Form
          </Button>
          
          <Button
            variant="outlined"
            onClick={handleClearForm}
            startIcon={<Clear />}
            sx={{ px: 3, py: 1.5 }}
          >
            Clear
          </Button>
        </Box>
      </Paper>

      <FieldTypeSelector />

      {currentForm.fields.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Form Fields ({currentForm.fields.length})
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="form-fields">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {[...currentForm.fields]
                    .sort((a, b) => a.order - b.order)
                    .map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <FieldEditor field={field} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Paper>
      )}

      {currentForm.fields.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="h6" gutterBottom>
            No fields added yet
          </Typography>
          <Typography>
            Use the field selector above to add fields to your form
          </Typography>
        </Paper>
      )}

      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={4000}
        onClose={() => setShowSuccessAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowSuccessAlert(false)}
          severity="success"
          variant="filled"
        >
          Form saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateForm;