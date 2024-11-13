import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useState, useEffect } from 'react';


interface CheckboxLabelsProps {
  onTestChange: (label: string) => void;
}

export default function LeevyorQual({ onTestChange }: CheckboxLabelsProps) {
  const [checkedState, setCheckedState] = React.useState({
    qualitative: true,
    leevyjennings: false,
  });

  const handleChange = (label: string) => () => {
    const newState = {
      qualitative: false,
      leevyjennings: false,
      [label]: true,
    };
    setCheckedState(newState);
    onTestChange(label);
  };

  return (
    <FormGroup>
      <FormControlLabel
        sx={{ display: 'inline-flex', width: '10%' }}
        control={
          <Checkbox
            checked={checkedState.qualitative}
            onChange={handleChange('qualitative')}
          />
        }
        label="Order QC"
      />
      <FormControlLabel
        sx={{ display: 'inline-flex', width: '10%' }}
        control={
          <Checkbox
            checked={checkedState.leevyjennings}
            onChange={handleChange('leevyjenning')}
          />
        }
        label="Review QC"
      />
    </FormGroup>
  );
}
