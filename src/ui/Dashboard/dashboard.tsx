import React, { useState } from 'react';
import componentStyle from './dashboard.module.css';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';
import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

interface Column {
  id:
    | 'id'
    | 'tpid'
    | 'psp'
    | 'creation'
    | 'approved'
    | 'name'
    | 'email'
    | 'amount'
    | 'crm'
    | 'aggent'
    | 'assigned';
  label: string;
  minWidth?: number;
  align?: 'center';
  show?: boolean;
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'id', label: 'ID', minWidth: 120, show: true },
  { id: 'tpid', label: 'TPID', minWidth: 100, show: true },
  {
    id: 'psp',
    label: 'PSP',
    minWidth: 120,
    show: true,
  },
  {
    id: 'creation',
    label: 'CREATION',
    minWidth: 120,
    show: true,
  },
  {
    id: 'approved',
    label: 'APPROVATE',
    minWidth: 120,
    show: true,
  },
  {
    id: 'name',
    label: 'NAME',
    minWidth: 120,
    show: true,
  },
  {
    id: 'email',
    label: 'EMAIL',
    minWidth: 120,
    show: true,
  },
  {
    id: 'amount',
    label: 'AMOUNT',
    minWidth: 120,
    show: true,
  },
  {
    id: 'crm',
    label: 'CRM',
    minWidth: 120,
    show: true,
  },
  {
    id: 'aggent',
    label: 'Aggent',
    minWidth: 120,
    show: false,
  },
  {
    id: 'assigned',
    label: 'Assigned',
    minWidth: 120,
    show: false,
  },
];

interface Data {
  id: string;
  tpid: number;
  psp: string;
  creation: string;
  approved: string;
  name: string;
  email: string;
  amount: number;
  crm: string;
  aggent: string;
  assigned: string;
}

function createData(
  id: string,
  tpid: number,
  psp: string,
  creation: string,
  approved: string,
  name: string,
  email: string,
  amount: number,
  crm: string,
  aggent: string,
  assigned: string
): Data {
  return {
    id,
    tpid,
    psp,
    creation,
    approved,
    name,
    email,
    amount,
    crm,
    aggent,
    assigned,
  };
}

const rows = [
  createData(
    '1',
    6548511,
    'Internal',
    moment(new Date('Fri, 09 Dec 2022 10:43:03 GMT')).format(
      'YYYY-MM-DD HH:mm'
    ),
    moment(new Date('Fri, 09 Dec 2022 10:43:06 GMT')).format(
      'YYYY-MM-DD HH:mm'
    ),
    'Yuriber Gonzalez',
    'yuribergonzalez777@gmail.com',
    3743,
    'FXMundo',
    'Ricardo Marldonado Ramirez Guimenez',
    'mx'
  ),
  createData(
    '2',
    6548511,
    'Internal',
    moment(new Date('Fri, 09 Dec 2022 10:43:03 GMT')).format(
      'YYYY-MM-DD HH:mm'
    ),
    moment(new Date('Fri, 09 Dec 2022 10:43:06 GMT')).format(
      'YYYY-MM-DD HH:mm'
    ),
    'Yuriber Gonzalez',
    'yuribergonzalez777@gmail.com',
    3743,
    'FXMundo',
    'Roberto Espiritu',
    'all'
  ),
  createData(
    '3',
    6548511,
    'Internal',
    moment(new Date('Fri, 09 Dec 2022 10:43:03 GMT')).format(
      'YYYY-MM-DD HH:mm'
    ),
    moment(new Date('Fri, 09 Dec 2022 10:43:06 GMT')).format(
      'YYYY-MM-DD HH:mm'
    ),
    'Yuriber Gonzalez',
    'yuribergonzalez777@gmail.com',
    3743,
    'FXMundo',
    'Alguiemas Espiritu',
    'co'
  ),
  createData(
    '4',
    6548511,
    'Internal',
    moment(new Date('Fri, 09 Dec 2022 10:43:03 GMT')).format(
      'YYYY-MM-DD HH:mm'
    ),
    moment(new Date('Fri, 09 Dec 2022 10:43:06 GMT')).format(
      'YYYY-MM-DD HH:mm'
    ),
    'Yuriber Gonzalez',
    'yuribergonzalez777@gmail.com',
    3743,
    'FXMundo',
    'Roberto Espiritu',
    'all'
  ),
  createData(
    '5',
    6548511,
    'Internal',
    moment(new Date('Fri, 09 Dec 2022 10:43:03 GMT')).format(
      'YYYY-MM-DD HH:mm'
    ),
    moment(new Date('Fri, 09 Dec 2022 10:43:06 GMT')).format(
      'YYYY-MM-DD HH:mm'
    ),
    'Yuriber Gonzalez',
    'yuribergonzalez777@gmail.com',
    3743,
    'FXMundo',
    'Roberto Espiritu',
    'all'
  ),
  createData(
    '6',
    6548511,
    'Internal',
    moment(new Date('Fri, 09 Dec 2022 10:43:03 GMT')).format(
      'YYYY-MM-DD HH:mm'
    ),
    moment(new Date('Fri, 09 Dec 2022 10:43:06 GMT')).format(
      'YYYY-MM-DD HH:mm'
    ),
    'Yuriber Gonzalez',
    'yuribergonzalez777@gmail.com',
    3743,
    'FXMundo',
    'Roberto Espiritu',
    'all'
  ),
];

type colorButton = {
  backgroundColor?: string;
  color: string;
};

type Buttons = {
  mx?: colorButton;
  co?: colorButton;
  all?: colorButton;
};

export function Dashboard() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [select, setSelect] = useState('all');
  const [buttonSelected, setButtonSelected] = useState<Buttons>({
    all: { backgroundColor: '#332634', color: '#7B536B' },
    mx: { color: 'white' },
    co: { color: 'white' },
  });

  //const handleChangePage = (event: unknown, newPage: number) => {
  //  setPage(newPage);
  //};

  //const handleChangeRowsPerPage = (
  //  event: React.ChangeEvent<HTMLInputElement>
  //) => {
  //  setRowsPerPage(+event.target.value);
  //  setPage(0);
  //};

  const handleSelect = (type: keyof Buttons) => {
    setSelect(type);
    switch (type) {
      case 'mx':
        setButtonSelected({
          [type]: { backgroundColor: '#2B3840', color: '#426B5D' },
          co: { color: 'white' },
          all: { color: 'white' },
        });
        return;
      case 'all':
        setButtonSelected({
          [type]: { backgroundColor: '#332634', color: '#7B536B' },
          mx: { color: 'white' },
          co: { color: 'white' },
        });
        return;
      case 'co':
        setButtonSelected({
          [type]: { backgroundColor: '#3C3135', color: '#837460' },
          mx: { color: 'white' },
          all: { color: 'white' },
        });
        return;
    }
  };

  return (
    <div>
      <h1 className={componentStyle.h1}>Assign Transactions</h1>
      <div id="filters">
        <Paper
          sx={{
            backgroundColor: '#26293C !important',
            color: 'white',
            marginBottom: '1em',
            maxHeight: '3em',
            border: 'none',
          }}
        >
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid xs={10}>
              <h5 className={componentStyle.h5}>Filters:</h5>
            </Grid>
            <Grid xs={2}>
              <Button
                className={componentStyle.button}
                style={buttonSelected?.all}
                onClick={() => handleSelect('all')}
                variant="text"
              >
                ALL
              </Button>
              <Button
                className={componentStyle.button}
                style={buttonSelected?.mx}
                onClick={() => handleSelect('mx')}
                variant="text"
              >
                MX
              </Button>
              <Button
                className={componentStyle.button}
                style={buttonSelected?.co}
                onClick={() => handleSelect('co')}
                variant="text"
              >
                CO
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </div>
      <div id="pagination">
        <Paper sx={{ backgroundColor: '#26293C' }}>
          <Pagination
            shape="circular"
            count={page * rowsPerPage + rowsPerPage}
            siblingCount={1}
          />
        </Paper>
      </div>
      <div id="table">
        <Paper
          sx={{
            marginTop: '1em',
            width: '100%',
            overflow: 'hidden',
            backgroundColor: '#30364E !important',
          }}
          className={componentStyle.paper}
        >
          <Paper className={componentStyle.paper}>
            <TableContainer sx={{ maxHeight: '100%' }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => {
                      return column.show ? (
                        <TableCell
                          sx={{
                            backgroundColor: '#2A2F45 !important',
                            maxHeight: '1em',
                            color: 'white !important',
                            fontStyle: 'normal',
                            fontSize: '10px',
                            fontWeight: 700,
                          }}
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ) : null;
                    })}
                  </TableRow>
                </TableHead>
                <TableBody
                  style={{
                    backgroundColor: '#1D2031',
                    borderBottomStyle: 'none',
                  }}
                >
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return row.assigned === select ? (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.tpid}
                          sx={{
                            backgroundColor: '#212435',
                          }}
                        >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return column.show ? (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ color: 'white' }}
                              >
                                {column.format && typeof value === 'number'
                                  ? column.format(value)
                                  : value}
                              </TableCell>
                            ) : null;
                          })}
                        </TableRow>
                      ) : null;
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Paper>
      </div>
    </div>
  );
}
