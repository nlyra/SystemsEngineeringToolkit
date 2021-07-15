import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import config from '../config.json'
import DeleteIcon from '@material-ui/icons/Delete';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import dialogStyles from '../styles/dialogStyle'
import DialogComponent from '../components/DialogComponent'

const columns = [
  { id: '_id', label: 'Id' },
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'roleID', label: 'Role' },
  { id: 'delete', label: 'Delete' },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 600,
  },
  formControl: {
    margin: '1%',
    minWidth: 100,
  },
  selectEmpty: {
    marginTop: '2%',
  },

  select: {
    height: 50
  },

  submitDiv: {
    width: '100%',
    display: 'flex',
    justifyContent: "flex-end",
    paddingTop: '2vh'
  },

  search: {
    width: '20%',
    paddingBottom: '8px'
  },
});

const AdminUsersTab = (props) => {
  const classes = useStyles();
  const dialogClasses = dialogStyles()
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState([]);
  const [dialogText, setDialogText] = useState('')
  const [openDialog, setOpenDialog] = useState(false);

  // function that will run when page is loaded
  useEffect(() => {
    getUsers()
  }, []);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    }
    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

  const getUsers = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(config.server_url + config.paths.getUsers, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ "token": token })
    })

    const data = await res.json()
    
    if(data.newToken != undefined)
    localStorage.setItem("token", data.newToken)
    
    if (data.message === "unauthorized") {
      props.isUnauthorized()
    } else if (data.message === undefined) {
      setUsers(data.users)
    } else if (data.message === "wrong token") {
      localStorage.removeItem('token');
      // alert the user
      setDialogText("Unauthorized access. Please contact your system administrator.")
      handleOpenDialog()
      props.history.push('login');
    } else { // this is to check if there are errors not being addressed already
      console.log(data)
    }
  }

  const getSearch = async (query) => {
    setSearch(query)
    // console.log(query)
    const token = localStorage.getItem("token");

    const res = await fetch(config.server_url + config.paths.getUsersSearch, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ "token": token, "query": query })
    })

    const data = await res.json()
    
    if(data.newToken != undefined)
    localStorage.setItem("token", data.newToken)
    
    if (data.message === "unauthorized") {
      props.isUnauthorized()
    } else if (data.message === undefined) {
      setUsers(data.users)
    } else if (data.message === "wrong token") {
      localStorage.removeItem('token');
      // alert the user
      setDialogText("Unauthorized access. Please contact your system administrator.")
      handleOpenDialog()
      props.history.push('login');
    } else { // this is to check if there are errors not being addressed already
      console.log(data)
    }
  }

  const handleChangeRole = async (event, id) => {
    const roleValue = event.target.value;
    const token = localStorage.getItem("token");

    const res = await fetch(config.server_url + config.paths.changeUserRole, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ "token": token, "updateID": id, "updateValue": roleValue })
    })

    const data = await res.json()
    
    if(data.newToken != undefined)
    localStorage.setItem("token", data.newToken)
    
    if (data.message === "unauthorized") {
      props.isUnauthorized()
    } else if (data.message === "success") {
      // alert(`Successfully deleted user`)
    } else if (data.message === "wrong token") {
      localStorage.removeItem('token');
      // alert the user
      setDialogText("Unauthorized access. Please contact your system administrator.")
      handleOpenDialog()
      props.history.push('login');
    } else { // this is to check if there are errors not being addressed already
      console.log(data)
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(config.server_url + config.paths.deleteUser, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ "token": token, "deleteID": id })
    })

    const data = await res.json()
    
    if(data.newToken != undefined)
    localStorage.setItem("token", data.newToken)
    
    if (data.message === "unauthorized") {
      props.isUnauthorized()
    } else if (data.message === "success") {
      // localStorage.setItem("tab", 0);
    } else if (data.message === "wrong token") {
      localStorage.removeItem('token');
      // alert the user
      setDialogText("Unauthorized access. Please contact your system administrator.")
      handleOpenDialog()
      props.history.push('login');
      // probably alert the user
    } else { // this is to check if there are errors not being addressed already
      console.log(data)
    }

  };


  return (
    <div>
      <Paper className={classes.root}>
        <div className={classes.search}>
          <TextField color='primary'
            size='small'
            variant="outlined"
            label='Search'
            type="string"
            value={search}
            onChange={e => getSearch(e.target.value)}
            margin="normal"
            required={true}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <TableContainer className={classes.container}>
          <Table stickyHeader size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id}>
                          {(column.id === '_id' || column.id === 'email') && row[column.id]}
                          {column.id === 'name' && <>{row["first_name"]} {row["last_name"]}</>}
                          {column.id === 'roleID' &&
                            <FormControl variant="outlined" className={classes.formControl}>
                              <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                defaultValue={row[column.id]}
                                onChange={(e) => { window.confirm(`Are you sure you wish to change role of user: ${row.first_name} ${row.last_name}?`) && handleChangeRole(e, row._id) }}
                                label="role"
                                className={classes.select}
                              >
                                <MenuItem value={0}>Student</MenuItem>
                                <MenuItem value={1}>Creator</MenuItem>
                                <MenuItem value={2}>Admin</MenuItem>
                              </Select>
                            </FormControl>
                          }
                          {column.id === 'delete' &&
                            <Link
                              className={classes.deleteButton}
                              href="/admindashboard?tab=0"
                              onClick={() => { window.confirm(`Are you sure you wish to Delete user: ${row.first_name} ${row.last_name}?`) && handleDelete(row._id) }}
                            >
                              <DeleteIcon color="secondary" />
                            </Link>
                          }
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <DialogComponent
        open={openDialog}
        text={dialogText}
        onClose={handleCloseDialog}
        buttons={[
            {text: "Ok", style: dialogClasses.dialogButton1, onClick: handleCloseDialog}
        ]}
      />
    </div>
  );
}

export default AdminUsersTab;