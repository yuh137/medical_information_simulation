import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

interface QCSubmitButtonsProps {
  onSubmitQC: () => void;
}

export default function QCSubmitButton({ onSubmitQC }: QCSubmitButtonsProps) {
  return (
    <Stack direction="row" spacing={2} sx={{ margin: '10px' }}>
      <Button variant="contained" onClick={onSubmitQC}>
        Submit Order for QC
      </Button>
    </Stack>
  );
}
