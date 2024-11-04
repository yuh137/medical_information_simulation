import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function CheckboxLabels({ onQCChange }) {
  const [checkedState, setCheckedState] = React.useState({
    orderQC: false,
    reviewQC: false,
    buildQC: false,
  });

  const handleChange = (label: string) => () => {
    const newState = {
      orderQC: false,
      reviewQC: false,
      buildQC: false,
      [label]: true,
    };
    setCheckedState(newState);

    // Handle QC visibility changes by passing the label to onQCChange
    onQCChange(label);
  };

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Checkbox
            checked={checkedState.orderQC}
            onChange={handleChange('orderQC')}
          />
        }
        label="Order QC"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={checkedState.reviewQC}
            onChange={handleChange('reviewQC')}
          />
        }
        label="Review QC"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={checkedState.buildQC}
            disabled
            onChange={handleChange('buildQC')}
          />
        }
        label="Build QC (Disabled for student)"
      />
    </FormGroup>
  );
}
