import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useState, useEffect } from 'react';
import { getAccountData } from '../../util/indexedDB/getData';
import { Admin, Student } from '../../util/indexedDB/IDBSchema';

// Grab user type from one of the account tables
async function fetchUserType(): Promise<string> {
  const accountData = await getAccountData();
  if (accountData && Array.isArray(accountData) && accountData.length > 0) {
    const user = accountData[0] as Admin | Student;
    return `${user.type}`;
  }
  return 'Not registered as student or admin';
}

interface CheckboxLabelsProps {
  onQCChange: (label: string) => void;
}

export default function CheckboxLabels({ onQCChange }: CheckboxLabelsProps) {
  const [checkedState, setCheckedState] = React.useState({
    orderQC: false,
    reviewQC: false,
    buildQC: false,
  });
  const [userType, setUserType] = useState<string>('Type');

  // Fetch the user's type from IndexedDB on component mount
  useEffect(() => {
    async function fetchType() {
      const user_type = await fetchUserType();
      setUserType(user_type);
    }
    fetchType();
  }, []);

  const handleChange = (label: string) => () => {
    const newState = {
      orderQC: false,
      reviewQC: false,
      buildQC: false,
      [label]: true,
    };
    setCheckedState(newState);
    onQCChange(label);
  };

  return (
    <FormGroup>
      <FormControlLabel
        sx={{ display: 'inline-flex', width: '10%' }}
        control={
          <Checkbox
            checked={checkedState.orderQC}
            onChange={handleChange('orderQC')}
          />
        }
        label="Order QC"
      />
      <FormControlLabel
        sx={{ display: 'inline-flex', width: '10%' }}
        control={
          <Checkbox
            checked={checkedState.reviewQC}
            onChange={handleChange('reviewQC')}
          />
        }
        label="Review QC"
      />
      {userType === 'admin' && (
        <FormControlLabel
        sx={{ display: 'inline-flex', width: '10%' }}
          control={
            <Checkbox
              checked={checkedState.buildQC}
              onChange={handleChange('buildQC')}
            />
          }
          label="Build QC"
        />
      )}
    </FormGroup>
  );
}
