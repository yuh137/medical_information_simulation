import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { ButtonBase } from '@mui/material';
import { flexRender, getCoreRowModel, useReactTable, ColumnDef } from '@tanstack/react-table';
import { QCRangeElements, QCTemplateBatch } from '../pages/CustomQCBuild'; // Import types from CustomQCBuild
import { renderSubString } from '../utils/utils';

const CustomTests = (props: { name: string }) => {
  const navigate = useNavigate();
  const [customQCData, setCustomQCData] = React.useState<QCTemplateBatch[]>([]);

  React.useEffect(() => {
    const data = JSON.parse(localStorage.getItem('customQCData') || '[]');
    setCustomQCData(data);
  }, []);

  const columns: ColumnDef<QCRangeElements, string>[] = [
    {
      accessorKey: "analyteName",
      header: "Name",
      cell: (info) => <div>{info.getValue()}</div>,
    },
    {
      accessorKey: "analyteAcronym",
      header: "Abbreviation",
      cell: (info) => (
        <div dangerouslySetInnerHTML={{ __html: renderSubString(info.getValue() as string) }} />
      ),
    },
    {
      accessorKey: "unit_of_measure",
      header: "Units of Measure",
      cell: (info) => <div>{info.getValue()}</div>,
    },
    {
      accessorKey: "min_level",
      header: "Min Level",
      cell: (info) => <div>{info.getValue()}</div>,
    },
    {
      accessorKey: "max_level",
      header: "Max Level",
      cell: (info) => <div>{info.getValue()}</div>,
    },
    {
      accessorKey: "mean",
      header: "Mean",
      cell: (info) => <div>{info.getValue()}</div>,
    },
    {
      accessorKey: "std_devi",
      header: "Standard Deviation",
      cell: (info) => <div>{info.getValue()}</div>,
    },
  ];

  const table = useReactTable({
    data: customQCData.flatMap(data => data.analytes),
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <NavBar name={props.name} />
      <div className="final-container relative sm:space-y-4 pb-24">
        <div className="table-container flex flex-col mt-8 sm:w-[94svw] sm:max-h-[75svh] sm:mx-auto w-100svw bg-[#CFD5EA] relative">
          <Table className="p-8 rounded-lg border-solid border-[1px] border-slate-200">
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id} className="font-bold text-base bg-[#3A62A7] hover:bg-[#3A62A7] sticky top-0 z-20">
                  {group.headers.map((header) => (
                    <TableHead key={header.id} className="text-white text-center">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {!table.getRowModel().rows?.length ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="sm:h-32 !p-2 text-center">
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map(row => (
                  <TableRow key={row.id} className="text-center sm:h-[10%] border-none">
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <ButtonBase
          className="save-button !absolute left-1/2 -translate-x-1/2 sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold"
          onClick={() => navigate('/qc_builder')}
        >
          Back to Builder
        </ButtonBase>
      </div>
    </>
  );
};

export default CustomTests;
