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
  }
});

const AdminCategoriesTab = (props) => {
  const classes = useStyles();
  const [categories, setCategories] = useState([]);

  // function that will run when page is loaded
  useEffect(() => {
    getCategories()
  }, []);

  const getCategories = async (props) => {
    const token = localStorage.getItem("token");

    const res = await fetch(config.server_url + config.paths.getCategories, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ "token": token })
    })

    const data = await res.json()
    if (data.message === undefined) {
      setCategories(data.categories)
    } else if (data.message === "wrong token") {
      localStorage.removeItem('token');
      props.history.push('login');
      // probably alert the user
    } else if (data.message === "unauthorized") {
      // eventually do something
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
      body: JSON.stringify({ "token": token, "deleteID": id})
    })

    const data = await res.json()
    // console.log(data)
    if (data.message === undefined) {
      props.setCurrTab(2)
      // alert(`Successfully deleted user`)
    } else if (data.message === "wrong token") {
      localStorage.removeItem('token');
      props.history.push('login');
      // probably alert the user
    } else if (data.message === "unauthorized") {
      // eventually do something
    } else { // this is to check if there are errors not being addressed already
      console.log(data)
    }

  };


  return (
    <div>
      <Paper className={classes.root}>
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
                              href="/admindashboard"
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