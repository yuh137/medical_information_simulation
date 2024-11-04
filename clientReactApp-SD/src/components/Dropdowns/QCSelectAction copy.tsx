import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

export default function QCSelectAction() {
  return (
    <Box sx={{ width: '400px' }}>
      <FormControl fullWidth>
        <InputLabel variant="standard" htmlFor="uncontrolled-native">
          Department
        </InputLabel>
        <NativeSelect
          defaultValue={30}
          inputProps={{
            name: 'age',
            id: 'uncontrolled-native',
          }}
        >
          <option value={'Molecular'}>Molecular</option>
          <option value={'Serology'}>Serology</option>
          <option value={'Chemistry'}>Chemistry</option>
          <option value={'BloodBank'}>Blood Bank</option>
          <option value={'UABF'}>UA/Body Fluids</option>
          <option value={'Hematology'}>Hematology/Coag</option>
          <option value={'MicroBiology'}>MicroBiology</option>
          
        </NativeSelect>
      </FormControl>
    </Box>
  );
}
