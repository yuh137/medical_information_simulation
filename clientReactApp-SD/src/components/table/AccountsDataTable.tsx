import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material';
import { getAllDataFromStore } from '../../util/indexedDB/getData';
import initIDB from '../../util/indexedDB/initIDB';

export default function AccountsDataTable() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        await initIDB(); // Initialize IndexedDB if not already initialized
        const storedAccounts = await getAllDataFromStore('user_store'); // Fetch accounts from 'user_store'
        setAccounts(storedAccounts);
      } catch (error) {
        console.error("Error fetching accounts from IndexedDB:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 800, margin: 'auto', marginTop: 4 }}>
      <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
        Registered Accounts
      </Typography>
      {loading ? (
        <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Roles</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account, index) => (
              <TableRow key={index}>
                <TableCell>{account.Username}</TableCell>
                <TableCell>{account.Email}</TableCell>
                <TableCell>{account.Roles ? account.Roles.join(', ') : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}
