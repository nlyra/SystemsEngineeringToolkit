import React, { useState, useEffect } from 'react'
import config from '../config.json'
import TopNavBar from '../components/TopNavBar'
import { Divider, makeStyles, Grid, Typography } from '@material-ui/core'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CourseInfoEditButton from '../components/CourseInfoEditButton';
import ModuleInfoEditButton from '../components/ModuleInfoEditButton';

const dashStyles = makeStyles((theme) => ({

  div: {
    display: 'flex',
    position: 'relative'
  },

  title: {
    fontSize: '50px',
    textAlign: "center",
  },

  topItem: {
    paddingTop: '4.9vh',
    paddingBottom: '6%',
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
    margin: theme.spacing(3, 3),
  },

  accordion: {
    padding: '3%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },

}))

const Course = (props) => {
  const [course, setCourse] = useState({})
  const [modules, setModules] = useState([])

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
      setModules(data.course.modules);
      //console.log(data.course)
    } else if (data.message === "wrong token") {
      localStorage.removeItem('token');
      props.history.push('login');
      // probably alert the user
    } else { // this is to check if there are errors not being addressed already
      console.log(data)
    }
  }

  return (
    <div className={classes.div}>
      <TopNavBar >
      </TopNavBar>
      <Grid container direction="column" className={classes.div}>
        <Grid item xs={12} >
          <Grid container className={classes.topItem}>
            <Grid item xs={3} sm={2} lg={1}>
              <img src={course.urlImage} className={classes.courseImageStyle} />
            </Grid>
            <Grid item xs={9} sm={10} lg={11}>
              <h1 className={classes.title}>{course.name}<CourseInfoEditButton hideComponent={false}/></h1>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} >
          <Typography className={classes.description}>{course.description}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider className={classes.divider} />
        </Grid>
        <Grid item xs={12} className={classes.accordion}>


          {/* modules starts here */}
          {modules.map((module) => (
            <Accordion key={modules.indexOf(module)} >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>Module {modules.indexOf(module) + 1}: {module.title} <ModuleInfoEditButton hideComponent={false}/></Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Type: {module.type}
                  <br />
                  <br />
                  {module.description}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}


        </Grid>
      </Grid>
    </div>
  )
}

export default Course

