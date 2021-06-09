import React, { useState, useEffect } from 'react'
import { TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core'
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';

const filter = createFilterOptions();

export default function FreeSoloDialog(props) {

    const [value, setValue] = React.useState(null);
    const [open, toggleOpen] = React.useState(false);

    const handleClose = () => {
        setDialogValue({
          label: '',
        });
    
        toggleOpen(false);
    };

    const [dialogValue, setDialogValue] = React.useState({
        label: ''
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        setValue({
          label: dialogValue.label,
        });
    
        handleClose();
    };

    return (
        <React.Fragment>
            <Autocomplete
                multiple
                value={value}
                onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                      // timeout to avoid instant validation of the dialog's form.
                      setTimeout(() => {
                        toggleOpen(true);
                        setDialogValue({
                          label: newValue,
                        });
                      });
                    } else if (newValue && newValue.inputValue) {
                      toggleOpen(true);
                      setDialogValue({
                        label: newValue.inputValue,
                      });
                    } else {
                      setValue(newValue);
                    }
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);
          
                    if (params.inputValue !== '') {
                      filtered.push({
                        inputValue: params.inputValue,
                        title: `Add "${params.inputValue}"`,
                      });
                    }
          
                    return filtered;
                }}
                id="free-solo-dialog"
                options={props.dialogData}
                getOptionLabel={(option) => {
                    // e.g value selected with enter, right from the input
                    if (typeof option === 'string') {
                      return option;
                    }
                    if (option.inputValue) {
                      return option.inputValue;
                    }
                    return option.label;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                renderOption={(option) => (option.label)}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip variant="filled" label={option} {...getTagProps({ index })} />
                    ))
                }
                style={{ width: 300 }}
                freeSolo
                renderInput={(params) => (
                    <TextField {...params} label="Categories" variant="outlined" />
                )}
            />
        </React.Fragment>
    )

};



