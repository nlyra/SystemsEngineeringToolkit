import React, { useState, useEffect } from 'react'
import config from '../config.json'
import TopNavBar from '../components/topNavBar'
import { Divider, Box, makeStyles, Grid, Paper, Container, Typography } from '@material-ui/core'
import { borders } from '@material-ui/system';
import { red } from '@material-ui/core/colors';

const dashStyles = makeStyles((theme) => ({

  outerContainer: {
    maxWidth: '100%',
    padding: '0',
    // flex: true

  },
  container: {
    backgroundColor: 'grey',
    maxWidth: '100%',
    padding: '0',
    height: 'child'
    // position: 'relative'
  },


  title: {
    fontSize: '50px',
    position: 'absolute',
    left: '50%',
    top: '7%',
    transform: 'translate(-50%, -50%)'
  },

  courseImageStyle: {
    maxWidth: '260px',
    marginBottom: "15px"
  },

  description: {
    fontSize: '25px',
    textAlign: "right",
    paddingRight: '2%',
    float: 'right',
    maxWidth: "90%"
  },

  divider: {
    margin: theme.spacing(0, 3),
    flexItem: true
  },

}))

const Course = (props) => {
  const [course, setCourse] = useState([])

  const classes = dashStyles()

  // function that will run when page is loaded
  useEffect(() => {
    const pathname = window.location.pathname.split('/') //returns the current path
    const id = pathname[pathname.length - 1]
    getCourse(id)
  }, []);

  const getCourse = async (id) => {
    const token = localStorage.getItem("token");
    let res = undefined

    res = await fetch(config.server_url + config.paths.course, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ "token": token, "id": id })
    })

    const data = await res.json()
    if (data.message === undefined) {
      setCourse(data.course);


    } else if (data.message === "wrong token") {
      localStorage.removeItem('token');
      props.history.push('login');
      // probably alert the user
    } else { // this is to check if there are errors not being addressed already
      console.log(data)
    }
  }

  return (
    <>
      <TopNavBar>
      </TopNavBar>
      {/* <Container className={classes.outerContainer}> */}
      <Container className={classes.container}>
        <img src={course.urlImage} className={classes.courseImageStyle} />
        <h1 className={classes.title} >{course.name} </h1>
        <Typography className={classes.description}>{course.description}</Typography>
      </Container>
      {/* </Container> */}
      <Divider />
    </>
  )
}

export default Course

