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
  { id: 'urlImage', label: 'Image' },
  { id: '_id', label: 'Id' },
  { id: 'name', label: 'Name' },
  { id: 'author', label: 'Author' },
  { id: 'totalStudents', label: 'Total Students' },
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

const AdminCoursesTab = (props) => {
  const classes = useStyles();
  const [courses, setCourses] = useState([]);

  // function that will run when page is loaded
  useEffect(() => {
    getCourses()
  }, []);

  const getCourses = async (props) => {
    const token = localStorage.getItem("token");

    const res = await fetch(config.server_url + config.paths.getCourses, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ "token": token })
    })

    const data = await res.json()
    if (data.message === undefined) {
      setCourses(data.courses)
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
    if (data.message === undefined) {
      props.setCurrTab(1)
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
              {courses.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id}>
                          {column.id === 'urlImage' && <img src={row.urlImage} className={classes.courseImageStyle} />}
                          {(column.id === '_id' ||
                            column.id === 'name' ||
                            column.id === 'author' ||
                            column.id === 'totalStudents') && row[column.id]}
                          {column.id === 'delete' &&
                            <Link
                              className={classes.deleteButton}
                              href="/admindashboard"
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