import React, { useState, useEffect } from 'react'
import config from '../config.json'
import TopNavBar from '../components/TopNavBar'
import { Divider, Box, makeStyles } from '@material-ui/core'
import { borders } from '@material-ui/system';

const dashStyles = makeStyles((theme) => ({

  div1: {
    display: 'flex',
    margin: '0px',
    padding: '0px',
    // alignContent: 'center'
  },

  title: {
    fontSize: '50px',
    position: 'absolute',
    left: '50%',
    top: '8%',
    transform: 'translate(-50%, -50%)'
  },

  courseImageStyle: {
    maxWidth: '250px',
    display: 'flex',
    marginLeft: '0px',
    paddingLeft: '0px'
  },

  description: {
    fontSize: '25px',
    position: 'absolute',
    textAlign: "right",
    right: '4%',
    top: '15%',
    maxWidth: "70%"
    // transform: 'translate(-50%, -50%)'
  },

  boxDivider: {
    marginTop: '10%',
    boxSizing: '3px'

  }


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
    <div>
      <topNavBar>
      </topNavBar>
      <div className={classes.div1}>
        <img src={course.urlImage} className={classes.courseImageStyle} />
        <h1 className={classes.title} >{course.name} </h1>
        {/* <p className={classes.description}>{course.description}</p> */}
        <p className={classes.description}>{course.description}</p>

        {/* <Divider className={classes.divider} /> */}
      </div>
      <Box borderTop={1} borderColor="primary.main" className={classes.boxDivider}></Box>
    </div>
  )
}

export default Course
