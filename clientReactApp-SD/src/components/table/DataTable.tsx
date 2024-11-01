import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material';
import initIDB from '../../util/indexedDB/initIDB';
import { getAllDataFromStore } from '../../util/indexedDB/getData';

export default function DataTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await initIDB(); // Initialize the database
        const storedData = await getAllDataFromStore('qc_store'); // Retrieve all data from the specific store
        setData(storedData);
      } catch (error) {
        console.error("Error fetching data from IndexedDB:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 800, margin: 'auto', marginTop: 4 }}>
      <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
        Data from IndexedDB
      </Typography>
      {loading ? (
        <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell>Lot Number</TableCell>
              <TableCell>Closed Date</TableCell>
              <TableCell>Open Date</TableCell>
              <TableCell>Expiration Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.fileName}</TableCell>
                <TableCell>{item.lotNumber}</TableCell>
                <TableCell>{item.closedDate}</TableCell>
                <TableCell>{item.openDate}</TableCell>
                <TableCell>{item.expirationDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}
