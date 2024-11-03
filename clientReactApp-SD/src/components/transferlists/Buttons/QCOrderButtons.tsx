import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

interface QCOrderButtonsProps {
  onClearSelection: () => void;
  onOrderQC: () => void;
}

export default function QCOrderButtons({ onClearSelection, onOrderQC }: QCOrderButtonsProps) {
  return (
    <Stack direction="row" spacing={2} sx={{ margin: '10px' }}>
      <Button variant="contained" onClick={onClearSelection}>
        Clear Selection
      </Button>
      <Button variant="contained" onClick={onOrderQC}>
        Order QC
      </Button>
    </Stack>
  );
}
