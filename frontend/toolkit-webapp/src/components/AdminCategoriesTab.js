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
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

const columns = [
  { id: '_id', label: 'Id' },
  { id: 'label', label: 'Label' },
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

  courseImageStyle: {
    maxHeight: '30px',
  },

  search: {
    width: '20%',
    paddingBottom: '8px'
  },
});

const AdminCategoriesTab = (props) => {
  const classes = useStyles();
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState([]);

  // function that will run when page is loaded
  useEffect(() => {
    getCategories()
  }, []);

  const getCategories = async () => {
    const token = localStorage.getItem("token");

    // console.log(typeof(new URLSearchParams(window.location.search).get('tab')))

    const res = await fetch(config.server_url + config.paths.getCategories, {
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
      setCategories(data.categories)
    } else if (data.message === "wrong token") {
      localStorage.removeItem('token');
      props.history.push('login');
      // probably alert the user
    } else { // this is to check if there are errors not being addressed already
      console.log(data)
    }
  }

  const getSearch = async (query) => {
    setSearch(query)
    // console.log(query)
    const token = localStorage.getItem("token");

    const res = await fetch(config.server_url + config.paths.getCategoriesSearch, {
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
      setCategories(data.categories)
    } else if (data.message === "wrong token") {
      localStorage.removeItem('token');
      props.history.push('login');
      // probably alert the user
    } else { // this is to check if there are errors not being addressed already
      console.log(data)
    }
  }

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(config.server_url + config.paths.adminDeleteCategory, {
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
    } else if (data.message === undefined) {
      // localStorage.setItem("tab", 2);
    } else if (data.message === "wrong token") {
      localStorage.removeItem('token');
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
              {categories.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id}>
                          {(column.id === '_id' ||
                            column.id === 'label') && row[column.id]}
                          {column.id === 'delete' &&
                            <Link
                              className={classes.deleteButton}
                              href="/admindashboard?tab=2"
                              onClick={() => { window.confirm(`Are you sure you wish to Delete label: ${row.label}`) && handleDelete(row._id) }}
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
    </div>
  );
}

export default AdminCategoriesTab;