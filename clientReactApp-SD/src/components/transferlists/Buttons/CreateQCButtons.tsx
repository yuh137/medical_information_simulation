import * as React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

interface CreateQCButtonsProps {
  onClearSelection: () => void;
  onCreateQC: () => void;
}

export default function QCOrderButtons({
  onClearSelection,
  onCreateQC,
}: CreateQCButtonsProps) {
  return (
    <Stack direction="row" spacing={2} sx={{ margin: "10px" }}>
      <Button variant="contained" onClick={onClearSelection}>
        Clear Selection
      </Button>
      <Button variant="contained" onClick={onCreateQC}>
        Create QC
      </Button>
    </Stack>
  );
}
