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
  { id: 'name', label: 'Name' },
  { id: 'author', label: 'Author' },
  { id: 'currStudents', label: 'Current students' },
  { id: 'totalStudents', label: 'Started students' },
  { id: 'totalCompletedStudents', label: 'Completed students' },
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

const AdminCoursesTab = (props) => {
  const classes = useStyles();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState([]);

  // function that will run when page is loaded
  useEffect(() => {
    getCourses()
  }, []);

  const getCourses = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(config.server_url + config.paths.getCourses, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ "token": token })
    })

    const data = await res.json()
    if (data.message === "unauthorized") {
      props.isUnauthorized()
    } else if (data.message === undefined) {
      setCourses(data.courses)
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

    const res = await fetch(config.server_url + config.paths.getCoursesSearch, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ "token": token, "query": query })
    })

    const data = await res.json()
    if (data.message === "unauthorized") {
      props.isUnauthorized()
    } else if (data.message === undefined) {
      setCourses(data.courses)
    } else if (data.message === "wrong token") {
      localStorage.removeItem('token');
      props.history.push('login');
      // probably alert the user
    } else { // this is to check if there are errors not being addressed already
      console.log(data)
    }
  }

  const handleDelete = async (id, author) => {
    const token = localStorage.getItem("token");

    const res = await fetch(config.server_url + config.paths.adminDeleteCourse, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ "token": token, "deleteID": id, "author": author })
    })

    const data = await res.json()
    // console.log(data)
    if (data.message === "unauthorized") {
      props.isUnauthorized()
    } else if (data.message === undefined) {
      // localStorage.setItem("tab", 1);
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
              {courses.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id}>
                          {(column.id === '_id' ||
                            column.id === 'name' ||
                            column.id === 'author' ||
                            column.id === 'totalStudents' ||
                            column.id === 'totalCompletedStudents' ||
                            column.id === 'currStudents') && row[column.id]}
                          {column.id === 'delete' &&
                            <Link
                              className={classes.deleteButton}
                              href="/admindashboard?tab=1"
                              onClick={() => { window.confirm(`Are you sure you wish to Delete user: ${row.name}`) && handleDelete(row._id, row.author) }}
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

export default AdminCoursesTab;