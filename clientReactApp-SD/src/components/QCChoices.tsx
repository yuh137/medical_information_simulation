import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useState, useEffect } from 'react';

interface CheckboxLabelsProps {
  onQCBuildChange: (label: string) => void;
}

export default function QCChoices({ onQCBuildChange }: CheckboxLabelsProps) {
  const [checkedState, setCheckedState] = React.useState({
    editQC: false,
    createQC: false,
  });

  const handleChange = (label: string) => () => {
    const newState = {
      editQC: false,
      createQC: false,
      [label]: true,
    };
    setCheckedState(newState);
    onQCBuildChange(label);
  };

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Checkbox
            checked={checkedState.editQC}
            onChange={handleChange('editQC')}
          />
        }
        label="Edit Existing QC Panels"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={checkedState.createQC}
            onChange={handleChange('createQC')}
          />
        }
        label="Create New QC Panel"
      />
    </FormGroup>
  );
}
