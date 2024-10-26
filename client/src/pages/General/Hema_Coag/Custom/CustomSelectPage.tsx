import React from 'react';
import { ButtonBase } from '@mui/material';
import { Link } from 'react-router-dom';
import NavBar from '../../../../components/NavBar';
import { useTheme } from '../../../../context/ThemeContext';
import { qcTypeLinkList } from '../../../../utils/utils';

const CustomSelectPage = () => {
    const { theme } = useTheme();

  return (
    <div>
      <h1>Select Custom Page</h1>
      {
      
      }
    </div>
  );
};

export default CustomSelectPage;