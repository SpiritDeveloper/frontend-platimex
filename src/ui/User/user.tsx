import React, { useEffect } from 'react';
import componentStyle from './user.module.css';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import EditIcon from '@mui/icons-material/Edit';
import TablePagination from '@mui/material/TablePagination';
import {
  Box,
  Button,
  FormControl,
  InputBase,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  Typography,
} from '@mui/material';
import storage from '../../utils/storage';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  createNewUser,
  updateRegisterUser,
  Getusers,
} from './services/user.services';

interface Column {
  id: 'user' | 'email' | 'password' | 'permissions' | 'edit';
  label: string;
  minWidth?: number;
  align?: 'center';
  show?: boolean;
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'user', label: 'User', minWidth: 150, show: true },
  { id: 'email', label: 'Email', minWidth: 150, show: true },
  { id: 'password', label: 'Password', minWidth: 150, show: true },
  { id: 'permissions', label: 'Permissions', minWidth: 150, show: true },
  {
    id: 'edit',
    label: 'Edit',
    minWidth: 80,
    show: true,
  },
];

interface Data {
  uuid: string;
  user: string;
  email: string;
  password: string;
  permissions: string;
  edit?: any;
}

interface newUser {
  uuid: string;
  name: string;
  email: string;
  password: string;
  area: string;
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

export function User({ history }: any) {
  const [users, setUsers] = React.useState<Data[]>([]);

  const [usersFind, setUsersFind] = React.useState<Data[]>([]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openUpdate, setOpenUpdate] = React.useState(false);
  const handleOpenUpdate = () => setOpenUpdate(true);
  const handleCloseUpdate = () => setOpenUpdate(false);

  const [newUser, setNewUser] = React.useState<newUser>({
    uuid: '',
    name: '',
    email: '',
    password: '',
    area: '',
  });

  useEffect(() => {
    (async () => {
      const getUsers = await Getusers();

      if (getUsers) {
        const formatUser = getUsers.map((user: any) => {
          const userRegister: Data = {
            uuid: user.id,
            user: user.name,
            email: user.email,
            password: user.password,
            permissions: user.region,
            edit: '',
          };

          return userRegister;
        });

        setUsers(formatUser);
        setUsersFind(formatUser);
        return;
      }

      setUsers([]);
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

  const handlerFinTransaction = (event: any) => {
    const search = event.target.value.toLowerCase();

    if (search === '') {
      setUsersFind(users);
      return;
    }

    const searchByName = usersFind.filter((o) =>
      o.user.toString().toLowerCase().includes(search)
    );

    const searchByEmail = usersFind.filter((o) =>
      o.email.toLowerCase().includes(search)
    );

    const searchByPermissions = usersFind.filter((o) =>
      o.permissions.toLowerCase().includes(search)
    );

    let findResults = [
      ...searchByName,
      ...searchByEmail,
      ...searchByPermissions,
    ];

    if (!findResults) {
      setUsersFind(users);
      return;
    }

    findResults = findResults.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.uuid === value.uuid)
    );

    setUsersFind(findResults);
    return;
  };

  const handlerLogOut = () => {
    storage.clearToken();
    history.push('/');
  };

  const handlerTransactions = () => {
    history.push('/dashboard');
  };

  const handlerCreateUser = async () => {
    handleClose();
    const user = await createNewUser(newUser);

    if (user) {
      setUsers([
        ...users,
        {
          uuid: user,
          user: newUser.name,
          email: newUser.email,
          password: newUser.password,
          permissions: newUser.area,
          edit: '',
        },
      ]);
      setNewUser({
        uuid: '',
        name: '',
        password: '',
        email: '',
        area: '',
      });
    }
  };

  const handlerUpdateUser = async () => {
    handleCloseUpdate();
    const update = await updateRegisterUser(newUser);

    if (update) {
      const updateUser = users.map((user) => {
        if (user.uuid === newUser.uuid) {
          user.email = newUser.email;
          user.password = newUser.password;
          user.permissions = newUser.area;
          user.user = newUser.name;
        }
        return user;
      });

      setUsers(updateUser);

      setNewUser({
        uuid: '',
        name: '',
        password: '',
        email: '',
        area: '',
      });
    }
  };

  const handlerNewUser =
    (prop: keyof newUser) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewUser({ ...newUser, [prop]: event.target.value });
    };

  const handleChangeSelect = (event: any) => {
    setNewUser({
      ...newUser,
      area: event.target.value,
    });
  };

  const handlerUpdate = (row: Data) => {
    handleOpenUpdate();
    setNewUser({
      uuid: row.uuid,
      name: row.user,
      email: row.email,
      password: row.password,
      area: row.permissions,
    });
  };

  return (
    <div>
      <Grid container>
        <Grid xs={4} sm={4} md={4}>
          <h1 className={componentStyle.h1}>Admin</h1>
        </Grid>
        <Grid xs={8} sm={8} md={8} sx={{ textAlign: 'right' }}>
          <Button
            onClick={handleOpen}
            style={{
              margin: '5px',
              backgroundColor:
                'linear-gradient(90deg, #26293C 0%, #1A1B27 100%)',
              borderRadius: '19px',
              maxHeight: '30px',
              minWidth: '100px',
              border: '1px solid #30364E',
            }}
          >
            <h6 style={{ color: 'white' }}>new user</h6>
            <SupervisedUserCircleIcon
              sx={{
                ml: 1,
                color: 'white',
                marginBottom: '5px !important',
                width: '20px',
              }}
            />
          </Button>
          <Button
            onClick={handlerTransactions}
            style={{
              margin: '5px',
              backgroundColor:
                'linear-gradient(90deg, #26293C 0%, #1A1B27 100%)',
              borderRadius: '19px',
              maxHeight: '30px',
              minWidth: '100px',
              border: '1px solid #30364E',
            }}
          >
            <h6 style={{ color: 'white' }}>Transactions</h6>
            <DashboardIcon
              sx={{
                ml: 1,
                color: 'white',
                marginBottom: '5px !important',
                width: '20px',
              }}
            />
          </Button>
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
              <InputBase
                sx={{ ml: 2, flex: 2, mt: 1 }}
                placeholder="Search here ..."
                inputProps={{ 'aria-label': 'Search here ...' }}
                style={{ color: 'white', fontSize: '14px' }}
                onChange={handlerFinTransaction}
              />
            </Grid>
            <Grid xs={2} sm={2} md={2}></Grid>
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
                  {usersFind
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
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
                                  padding: '7px',
                                }}
                              >
                                {column.id === 'edit' ? (
                                  <Button
                                    onClick={() => handlerUpdate(row)}
                                    style={{
                                      background: '#2B3840',
                                      borderRadius: '15px',
                                      maxHeight: '25px',
                                    }}
                                  >
                                    <EditIcon
                                      style={{
                                        color: '#6DC995',
                                        width: '17px',
                                      }}
                                    />
                                  </Button>
                                ) : column.id === 'permissions' ? (
                                  value === 'MX' ? (
                                    <Button
                                      sx={{
                                        background: '#2B3840',
                                        borderRadius: '15px',
                                        maxHeight: '25px',
                                      }}
                                    >
                                      <h6 style={{ color: '#426B5D' }}>
                                        {value}
                                      </h6>
                                    </Button>
                                  ) : value === 'CO' ? (
                                    <Button
                                      sx={{
                                        background: '#3C3135',
                                        borderRadius: '15px',
                                        maxHeight: '25px',
                                      }}
                                    >
                                      <h6 style={{ color: '#837460' }}>
                                        {value}
                                      </h6>
                                    </Button>
                                  ) : (
                                    <Button
                                      sx={{
                                        background: '#332634',
                                        borderRadius: '15px',
                                        maxHeight: '25px',
                                      }}
                                    >
                                      <h6 style={{ color: '#7B536B' }}>
                                        {value}
                                      </h6>
                                    </Button>
                                  )
                                ) : (
                                  value
                                )}
                              </TableCell>
                            ) : null;
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[15, 30, 50]}
              component="div"
              count={users.length}
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
          </Paper>
        </Paper>
      </div>
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
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Add a new user
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
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel sx={{ color: 'white' }} focused={false}>
                    Name
                  </InputLabel>
                  <OutlinedInput
                    onChange={handlerNewUser('name')}
                    type="text"
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
                      '.css-1sumxir-MuiFormLabel-root-MuiInputLabel-root': {
                        color: 'white !important',
                      },
                    }}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel sx={{ color: 'white' }} focused={false}>
                    Email
                  </InputLabel>
                  <OutlinedInput
                    onChange={handlerNewUser('email')}
                    type="text"
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
                      '.css-1sumxir-MuiFormLabel-root-MuiInputLabel-root': {
                        color: 'white !important',
                      },
                    }}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel sx={{ color: 'white' }} focused={false}>
                    Password
                  </InputLabel>
                  <OutlinedInput
                    onChange={handlerNewUser('password')}
                    type="text"
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
                      '.css-1sumxir-MuiFormLabel-root-MuiInputLabel-root': {
                        color: 'white !important',
                      },
                    }}
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  sx={{
                    mt: 2,
                    '.MuiOutlinedInput-notchedOutline': {
                      color: 'white',
                      borderColor: 'white !important',
                    },
                    '.css-md26zr-MuiInputBase-root-MuiOutlinedInput-root': {
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
                    Area
                  </InputLabel>
                  <Select
                    labelId="country"
                    id="country"
                    label="country"
                    value={newUser.area}
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
                    <MenuItem value={'ALL'}>ALL</MenuItem>
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
                  onClick={handlerCreateUser}
                >
                  create
                </Button>
                <Button
                  className={componentStyle.buttonModal}
                  onClick={handleClose}
                >
                  cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <Modal
        open={openUpdate}
        onClose={handleCloseUpdate}
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
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Update user
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
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel sx={{ color: 'white' }} focused={false}>
                    Name
                  </InputLabel>
                  <OutlinedInput
                    value={newUser.name}
                    onChange={handlerNewUser('name')}
                    type="text"
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
                      '.css-1sumxir-MuiFormLabel-root-MuiInputLabel-root': {
                        color: 'white !important',
                      },
                    }}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel sx={{ color: 'white' }} focused={false}>
                    Email
                  </InputLabel>
                  <OutlinedInput
                    value={newUser.email}
                    onChange={handlerNewUser('email')}
                    type="text"
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
                      '.css-1sumxir-MuiFormLabel-root-MuiInputLabel-root': {
                        color: 'white !important',
                      },
                    }}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel sx={{ color: 'white' }} focused={false}>
                    Password
                  </InputLabel>
                  <OutlinedInput
                    value={newUser.password}
                    onChange={handlerNewUser('password')}
                    type="text"
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
                      '.css-1sumxir-MuiFormLabel-root-MuiInputLabel-root': {
                        color: 'white !important',
                      },
                    }}
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  sx={{
                    mt: 2,
                    '.MuiOutlinedInput-notchedOutline': {
                      color: 'white',
                      borderColor: 'white !important',
                    },
                    '.css-md26zr-MuiInputBase-root-MuiOutlinedInput-root': {
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
                    Area
                  </InputLabel>
                  <Select
                    labelId="country"
                    id="country"
                    label="country"
                    value={newUser.area}
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
                    <MenuItem value={'ALL'}>ALL</MenuItem>
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
                  onClick={handlerUpdateUser}
                >
                  update
                </Button>
                <Button
                  className={componentStyle.buttonModal}
                  onClick={handleCloseUpdate}
                >
                  cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}
