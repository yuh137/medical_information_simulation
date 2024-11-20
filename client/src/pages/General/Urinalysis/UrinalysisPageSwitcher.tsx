import React, { useState } from 'react';
import {UrinalysisQualitativeInput} from './UrinalysisQualitativeInput';
import UrinalysisLeveyJennings from './UrinalysisLeveyJennings';
import { Button } from '@mui/material';

const UrinalysisPageSwitcher = () => {
  const [currentPage, setCurrentPage] = useState<'qualitative' | 'leveyJennings'>('qualitative');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <Button variant="contained" onClick={() => setCurrentPage('qualitative')} style={{ marginRight: '10px' }}>
          Qualitative
        </Button>
        <Button variant="contained" onClick={() => setCurrentPage('leveyJennings')}>
          Levey-Jennings
        </Button>
      </div>
      {currentPage === 'qualitative' && <UrinalysisQualitativeInput name="Qualitative Input" />}
      {currentPage === 'leveyJennings' && <UrinalysisLeveyJennings />}
    </div>
  );
};

export default UrinalysisPageSwitcher;