import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import componentStyle from './dashboard.module.css';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TablePagination from '@mui/material/TablePagination';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import LogoutIcon from '@mui/icons-material/Logout';

import {
  FormControl,
  InputBase,
  InputLabel,
  MenuItem,
  OutlinedInput,
} from '@mui/material';
import {
  getTransactions,
  unassign,
  assigned,
  who_i_am,
} from './services/dashboard.services';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import storage from '../../utils/storage';

const socket = io(process.env.REACT_APP_API_URL || '');
console.log('-->', process.env.REACT_APP_API_URL);

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
  { id: 'id', label: 'ID', minWidth: 90, show: true },
  { id: 'tpid', label: 'TPID', minWidth: 40, show: true },
  {
    id: 'psp',
    label: 'PSP',
    minWidth: 90,
    show: true,
  },
  {
    id: 'creation',
    label: 'CREATION',
    minWidth: 90,
    show: true,
  },
  {
    id: 'approved',
    label: 'APPROVATE',
    minWidth: 90,
    show: true,
  },
  {
    id: 'name',
    label: 'NAME',
    minWidth: 90,
    show: true,
  },
  {
    id: 'email',
    label: 'EMAIL',
    minWidth: 90,
    show: true,
  },
  {
    id: 'amount',
    label: 'AMOUNT',
    minWidth: 90,
    show: true,
  },
  {
    id: 'crm',
    label: 'CRM',
    minWidth: 90,
    show: true,
  },
  {
    id: 'aggent',
    label: 'Aggent',
    minWidth: 90,
    show: false,
  },
  {
    id: 'assigned',
    label: 'Assigned',
    minWidth: 90,
    show: true,
  },
];

interface Data {
  id: string;
  tpid: number;
  psp: string;
  creation: any;
  approved: any;
  name: string;
  email: string;
  amount: number;
  crm: string;
  aggent: string;
  assigned: string;
  uuid: string;
}

interface AssignAgent {
  uuid: string;
  name: string;
  country: string;
}

interface me {
  id: string;
  email: string;
  region: string;
  name: string;
  lastname: string;
  position: string;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#1D2031',
  border: 'transparent',
  borderRadius: '15px',
  boxShadow: 24,
  p: 4,
  color: 'white',
  borderColor: 'white',
};

type colorButton = {
  backgroundColor?: string;
  color: string;
};

type Buttons = {
  MX?: colorButton;
  CO?: colorButton;
  ALL?: colorButton;
};

export function Dashboard({ history }: any) {
  const [transactions, setTransactions] = React.useState<Data[]>([]);
  const [findTransactions, setFindTransactions] = React.useState<Data[]>([]);
  const [asignTransaction, setAsignTransaction] = React.useState<AssignAgent>({
    uuid: '',
    name: '',
    country: '',
  });
  const [UnassignTransaction, setUnassignTransaction] = React.useState({
    uuid: '',
    name: '',
  });

  const [page, setPage] = React.useState(0);
  const [userInformation, setUserInformation] = React.useState<me>({
    id: '',
    email: '',
    region: '',
    name: '',
    lastname: '',
    position: '',
  });

  const [rowsPerPage, setRowsPerPage] = React.useState(15);

  const [openUnassign, setOpenUnassign] = React.useState(false);
  const handleOpenUnassign = () => setOpenUnassign(true);
  const handleCloseUnassign = () => setOpenUnassign(false);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [select, setSelect] = useState('ALL');
  const [buttonSelected, setButtonSelected] = useState<Buttons>({
    ALL: { backgroundColor: '#332634', color: '#7B536B' },
    MX: { color: 'white' },
    CO: { color: 'white' },
  });

  useEffect(() => {
    socket.on('newTransaction', (newTransaction) => {
      let newTransactions = [...findTransactions, ...newTransaction];

      newTransactions = newTransactions.sort(function (a: Data, b: Data) {
        return new Date(b.approved).valueOf() - new Date(a.approved).valueOf();
      });

      setFindTransactions(newTransactions);
      setTransactions(newTransactions);
    });

    return () => {
      socket.off('connect');
      socket.off('newTransaction');
    };
  }, [findTransactions]);

  useEffect(() => {
    (async () => {
      let getTransaction = await getTransactions();
      getTransaction = getTransaction.payload.sort(function (a: Data, b: Data) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.approved).valueOf() - new Date(a.approved).valueOf();
      });

      setTransactions(getTransaction);
      setFindTransactions(getTransaction);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const iAm: me = await who_i_am();
      setUserInformation(iAm);
    })();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSelect = (type: keyof Buttons) => {
    setSelect(type);
    setPage(0);
    switch (type) {
      case 'MX':
        setButtonSelected({
          [type]: { backgroundColor: '#2B3840', color: '#426B5D' },
          CO: { color: 'white' },
          ALL: { color: 'white' },
        });
        return;
      case 'ALL':
        setButtonSelected({
          [type]: { backgroundColor: '#332634', color: '#7B536B' },
          MX: { color: 'white' },
          CO: { color: 'white' },
        });
        return;
      case 'CO':
        setButtonSelected({
          [type]: { backgroundColor: '#3C3135', color: '#837460' },
          MX: { color: 'white' },
          ALL: { color: 'white' },
        });
        return;
    }
  };

  const handlerFinTransaction = (event: any) => {
    const search = event.target.value;

    if (search === '') {
      setFindTransactions(transactions);
    }

    const searchByTpid = transactions.filter((o) =>
      o.tpid.toString().includes(search)
    );
    const searchByName = transactions.filter((o) => o.name.includes(search));
    const searchByPspName = transactions.filter((o) => o.psp.includes(search));
    const searchByTransactionId = transactions.filter((o) =>
      o.id.toString().includes(search)
    );
    const searchByEmail = transactions.filter((o) => o.email.includes(search));
    const searchByCrm = transactions.filter((o) => o.crm.includes(search));

    let allResults = [
      ...searchByTpid,
      ...searchByName,
      ...searchByPspName,
      ...searchByTransactionId,
      ...searchByEmail,
      ...searchByCrm,
    ];

    allResults = allResults.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.uuid === value.uuid)
    );

    setFindTransactions(allResults);
    setPage(0);
  };

  const handlerUnassignTransaction = (name: string, uuid: string) => {
    handleOpenUnassign();
    setUnassignTransaction({ name: name, uuid: uuid });
  };

  const handlerAssignAgentTransaction = async () => {
    let area: string = '';

    if (asignTransaction.country === 'MX') {
      area = 'MEXICO';
    }

    if (asignTransaction.country === 'CO') {
      area = 'COLOMBIA';
    }

    const response = await assigned(
      asignTransaction.uuid,
      asignTransaction.name,
      area
    );

    if (response) {
      let newTransactions = findTransactions.map((item) => {
        if (item.uuid === asignTransaction.uuid) {
          return {
            ...item,
            aggent: asignTransaction.name,
            assigned: asignTransaction.country,
          };
        }
        return item;
      });

      newTransactions = newTransactions.sort(function (a: Data, b: Data) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.approved).valueOf() - new Date(a.approved).valueOf();
      });

      setTransactions(newTransactions);
      setFindTransactions(newTransactions);
      handleSelect('ALL');
      handleClose();

      setAsignTransaction({ name: '', country: '', uuid: '' });
    }
  };

  const handlerDesasigTransaction = async (uuid: string) => {
    const response = await unassign(uuid);
    if (response) {
      let newTransactions = findTransactions.map((item) => {
        if (item.uuid === uuid) {
          return { ...item, aggent: '', assigned: 'ALL' };
        }
        return item;
      });
      newTransactions = newTransactions.sort(function (a: Data, b: Data) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.approved).valueOf() - new Date(a.approved).valueOf();
      });
      setTransactions(newTransactions);
      setFindTransactions(newTransactions);
      handleSelect('ALL');
      handleCloseUnassign();
    }
  };

  const handlerAssignAgent =
    (prop: keyof AssignAgent) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAsignTransaction({ ...asignTransaction, [prop]: event.target.value });
    };

  const handleChangeSelect = (event: SelectChangeEvent) => {
    setAsignTransaction({
      ...asignTransaction,
      country: event.target.value,
    });
  };

  const handleModalTransactionOpen = (uuid: string) => {
    setAsignTransaction({
      ...asignTransaction,
      uuid: uuid,
    });
    handleOpen();
  };

  const handlerAddUser = () => {
    history.push('/user');
  };

  const handlerLogOut = () => {
    storage.clearToken();
    history.push('/');
  };

  return (
    <div>
      <Grid container>
        <Grid xs={6} sm={6} md={6}>
          <h1 className={componentStyle.h1}>Assign Transactions</h1>
        </Grid>
        <Grid xs={6} sm={6} md={6} sx={{ textAlign: 'right' }}>
          {userInformation.position === 'MANAGER' ? (
            <>
              <Button
                style={{
                  margin: '5px',
                  backgroundColor:
                    'linear-gradient(90deg, #26293C 0%, #1A1B27 100%)',
                  borderRadius: '19px',
                  maxHeight: '30px',
                  minWidth: '100px',
                  border: '1px solid #30364E',
                }}
                onClick={handlerAddUser}
              >
                <h6 style={{ color: 'white' }}>Config</h6>
                <SettingsSuggestIcon
                  sx={{
                    ml: 1,
                    color: 'white',
                    marginBottom: '5px !important',
                    width: '20px',
                  }}
                />
              </Button>
            </>
          ) : null}
          <Button
            onClick={handlerLogOut}
            style={{
              margin: '10px',
              backgroundColor:
                'linear-gradient(90deg, #26293C 0%, #1A1B27 100%)',
              borderRadius: '19px',
              maxHeight: '30px',
              minWidth: '100px',
              border: '1px solid #30364E',
            }}
          >
            <h6 style={{ color: 'white' }}>Log out</h6>
            <LogoutIcon
              sx={{
                ml: 1,
                color: 'white',
                marginBottom: '5px !important',
                width: '20px',
              }}
            />
          </Button>
        </Grid>
      </Grid>
      <div id="filters">
        <Paper
          sx={{
            backgroundColor: '#26293C !important',
            color: 'white',
            marginBottom: '1em',
            maxHeight: '4em',
            border: 'none',
          }}
        >
          <Grid container spacing={1}>
            <Grid xs={2} sm={2} md={2}>
              <h5 className={componentStyle.h5}>Filters:</h5>
            </Grid>
            <Grid xs={2} sm={2} md={2}>
              <InputBase
                sx={{ ml: 2, flex: 2, mt: 1 }}
                placeholder="Search here ..."
                inputProps={{ 'aria-label': 'Search here ...' }}
                style={{ color: 'white', fontSize: '14px' }}
                onChange={handlerFinTransaction}
              />
            </Grid>
            <Grid xs={8} sm={8} md={8} sx={{ textAlign: 'right' }}>
              <div style={{ marginRight: '5px' }}>
                <Button
                  className={componentStyle.button}
                  style={buttonSelected?.ALL}
                  onClick={() => handleSelect('ALL')}
                  variant="text"
                >
                  ALL
                </Button>
                {userInformation.region === 'CO' ||
                userInformation.region === 'ALL' ? (
                  <Button
                    className={componentStyle.button}
                    style={buttonSelected?.CO}
                    onClick={() => handleSelect('CO')}
                    variant="text"
                  >
                    CO
                  </Button>
                ) : null}
                {userInformation.region === 'MX' ||
                userInformation.region === 'ALL' ? (
                  <Button
                    className={componentStyle.button}
                    style={buttonSelected?.MX}
                    onClick={() => handleSelect('MX')}
                    variant="text"
                  >
                    MX
                  </Button>
                ) : null}
              </div>
            </Grid>
          </Grid>
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
            <TableContainer sx={{ minHeight: '100%' }}>
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
                            borderBottom: 'none',
                          }}
                          key={column.id}
                          align={column.align}
                          style={{
                            minWidth: column.minWidth,
                            borderBottom: 'none !important',
                          }}
                        >
                          {column.label}
                        </TableCell>
                      ) : null;
                    })}
                  </TableRow>
                </TableHead>
                <TableBody
                  style={{
                    backgroundColor: '#2A2F45',
                    borderBottomStyle: 'none',
                  }}
                >
                  {findTransactions
                    .filter((o) => o.assigned === select)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return row.assigned === select ? (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.uuid}
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
                                style={{
                                  color: 'white',
                                  borderBottom: 'none',
                                  fontSize: '12px',
                                  margin: '.5em',
                                  padding: '5px',
                                }}
                              >
                                {value === 'ALL' ? (
                                  <Button
                                    variant="text"
                                    className={componentStyle.buttomAssigned}
                                    onClick={() =>
                                      handleModalTransactionOpen(row.uuid)
                                    }
                                  >
                                    <PersonAddAltIcon />
                                  </Button>
                                ) : value === select ? (
                                  <Button
                                    variant="text"
                                    className={componentStyle.buttonDeleted}
                                    onClick={() =>
                                      handlerUnassignTransaction(
                                        row.aggent,
                                        row.uuid
                                      )
                                    }
                                  >
                                    <GroupRemoveIcon
                                      sx={{ fontSize: '1.3em' }}
                                    />
                                  </Button>
                                ) : value === select ? (
                                  <Button
                                    variant="text"
                                    className={componentStyle.buttonDeleted}
                                    onClick={() =>
                                      handlerUnassignTransaction(
                                        row.aggent,
                                        row.uuid
                                      )
                                    }
                                  >
                                    <GroupRemoveIcon
                                      sx={{ fontSize: '1.3em' }}
                                    />
                                  </Button>
                                ) : (
                                  value
                                )}
                              </TableCell>
                            ) : null;
                          })}
                        </TableRow>
                      ) : null;
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[15, 30, 50]}
              component="div"
              count={
                transactions.filter(
                  (transactions) => transactions.assigned === select
                ).length
              }
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                backgroundColor: '#30364E !important',
                color: 'white',
                '.css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon': {
                  color: 'white',
                },
                '.css-zylse7-MuiButtonBase-root-MuiIconButton-root.Mui-disabled':
                  {
                    color: 'white',
                  },
              }}
            />
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              sx={{
                '.css-i9fmh8-MuiBackdrop-root-MuiModal-backdrop': {
                  backgroundColor: 'rgba(0, 0, 0, .5) !important',
                },
              }}
            >
              <Box sx={style}>
                <Grid container spacing={2}>
                  <Grid xs={12}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Assign transaction
                    </Typography>
                  </Grid>
                  <Grid xs={12}>
                    <Typography
                      component={'span'}
                      variant={'body2'}
                      id="modal-modal-description"
                      sx={{
                        mt: 1,
                        '.MuiOutlinedInput-notchedOutline': {
                          color: 'white',
                          borderColor: 'white !important',
                        },
                        '.css-md26zr-MuiInputBase-root-MuiOutlinedInput-root': {
                          color: 'white',
                          borderColor: 'white !important',
                        },
                        '.css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root': {
                          color: 'white',
                        },
                      }}
                    >
                      <FormControl fullWidth sx={{ mt: 1 }}>
                        <InputLabel sx={{ color: 'white' }} focused={false}>
                          Aggent Name
                        </InputLabel>
                        <OutlinedInput
                          type="text"
                          value={asignTransaction.name}
                          onChange={handlerAssignAgent('name')}
                          label="Aggent name"
                          sx={{
                            '.MuiOutlinedInput-notchedOutline': {
                              borderColor: 'white !important',
                            },
                            '.MuiInputBase-input': {
                              color: 'white !important',
                            },
                            '.Mui-focused': {
                              borderWidth: '1px !important',
                            },
                            '.css-1sumxir-MuiFormLabel-root-MuiInputLabel-root':
                              {
                                color: 'white !important',
                              },
                          }}
                        />
                      </FormControl>
                      <FormControl
                        fullWidth
                        sx={{
                          mt: 4,
                          '.MuiOutlinedInput-notchedOutline': {
                            color: 'white',
                            borderColor: 'white !important',
                          },
                          '.css-md26zr-MuiInputBase-root-MuiOutlinedInput-root':
                            {
                              color: 'white',
                              borderColor: 'white !important',
                            },
                          '.css-1sumxir-MuiFormLabel-root-MuiInputLabel-root': {
                            color: 'white',
                          },
                        }}
                      >
                        <InputLabel
                          id="country"
                          focused={false}
                          sx={{ color: 'white' }}
                        >
                          Country
                        </InputLabel>
                        <Select
                          labelId="country"
                          id="country"
                          label="country"
                          value={asignTransaction.country}
                          onChange={handleChangeSelect}
                          sx={{
                            color: 'white',
                            '.MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(228, 219, 233, 0.25)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(228, 219, 233, 0.25)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(228, 219, 233, 0.25)',
                            },
                            '.MuiSvgIcon-root ': {
                              fill: 'white !important',
                            },
                          }}
                        >
                          <MenuItem value={'MX'}>Mexico</MenuItem>
                          <MenuItem value={'CO'}>Colombia</MenuItem>
                        </Select>
                      </FormControl>
                    </Typography>
                  </Grid>
                  <Grid xs={12}>
                    <Box
                      sx={{
                        mt: 1,
                        textAlign: 'center',
                      }}
                    >
                      <Button
                        className={componentStyle.buttonModal}
                        onClick={handlerAssignAgentTransaction}
                      >
                        Asignar
                      </Button>
                      <Button
                        className={componentStyle.buttonModal}
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Modal>
            <Modal
              open={openUnassign}
              onClose={handleCloseUnassign}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              sx={{
                '.css-i9fmh8-MuiBackdrop-root-MuiModal-backdrop': {
                  backgroundColor: 'rgba(0, 0, 0, 0.5); !important',
                },
              }}
            >
              <Box sx={style}>
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  style={{ textAlign: 'center' }}
                >
                  Unassign agent transaction
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Are you sure you want to de-assign agent &nbsp;
                  {UnassignTransaction.name}?
                </Typography>
                <div
                  style={{
                    textAlign: 'center',
                    marginTop: '1em',
                  }}
                >
                  <Button
                    className={componentStyle.buttonModal}
                    onClick={() =>
                      handlerDesasigTransaction(UnassignTransaction.uuid)
                    }
                  >
                    Unassign
                  </Button>
                  <Button
                    className={componentStyle.buttonModal}
                    onClick={handleCloseUnassign}
                  >
                    Cancel
                  </Button>
                </div>
              </Box>
            </Modal>
          </Paper>
        </Paper>
      </div>
    </div>
  );
}
