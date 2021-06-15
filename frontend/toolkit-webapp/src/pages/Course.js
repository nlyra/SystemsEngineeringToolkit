import React, { useState, useEffect } from 'react'
import config from '../config.json'
import TopNavBar from '../components/TopNavBar'
import { Divider, makeStyles, Grid, Typography, TextField, Button, Container } from '@material-ui/core'
import VideoModule from '../components/VideoModule'
import PdfModule from '../components/PdfModule'
import QuizModule from '../components/QuizModule'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CourseInfoEditButton from '../components/CourseInfoEditButton';
import ModuleInfoEditButton from '../components/ModuleInfoEditButton';
import courseStyles from '../styles/courseStyle'
import jwt_decode from "jwt-decode";


const Course = (props) => {
  const [course, setCourse] = useState({})
  const [modules, setModules] = useState([])
  const [courseTitle, setCourseTitle] = useState('')
  const [courseDescription, setCourseDescription] = useState('')
  const [editCourseInfo, setEditCourseInfo] = useState(false)
  const [courseID, setCourseID] = useState('')

  const classes = courseStyles()

  const onEditCourseTitle = (e) => {
    setEditCourseInfo(true);
  };

  const onEditModule = (e) => {
    //alert("you have pressed the edit button the course ID is = " + courseID)
    props.history.push(`/ModuleManager/${courseID}`);
  };

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
      setCourseID(id);
      setCourseTitle(data.course.name);
      setCourseDescription(data.course.description);
      setModules(data.course.modules);
    } else if (data.message === "wrong token") {
      localStorage.removeItem('token');
      props.history.push('login');
      // probably alert the user
    } else { // this is to check if there are errors not being addressed already
      console.log(data)
    }
  }

  const onEditSubmit = async (e) => {

    setEditCourseInfo(false);
    console.log("this is the title:" + course.name)
    console.log(courseDescription)
    console.log(config.server_url + config.paths.updateCourseInfo)
    if (courseTitle == '') { setCourseTitle(course.name) }
    const res = await fetch(config.server_url + config.paths.updateCourseInfo, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        'courseID': courseID,
        "name": courseTitle,
        "description": courseDescription,
      })
    })

    window.location.reload();
  }

  const enroll = async (module) => {

    if (modules.indexOf(module) === 0) {

      const token = localStorage.getItem("token");

      const res = await fetch(config.server_url + config.paths.enrollment, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          "courseID": course._id,
          "token": token
          // "userID": decoded.id
        })
      })
    }

  }

  return (
    <div className={classes.div}>
      <TopNavBar >
      </TopNavBar>
      <Grid container direction="column" className={classes.div}>
        {editCourseInfo !== true ?
          <div maxWidth>
            <Grid item alignItems="center" xs={12}>
              <Grid container className={classes.topItem}>
                <Grid item xs={3} sm={2} lg={1}>
                  <img src={course.urlImage} className={classes.courseImageStyle} />
                </Grid>
                <Grid item xs={8} sm={9} lg={9}>
                  <h1
                    className={classes.title}>{course.name}
                  </h1>
                </Grid>
                <Grid item xs={1} sm={1} lg={2}>
                  <CourseInfoEditButton
                    hideComponent={false}
                    edit={onEditCourseTitle}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} >
              <Typography className={classes.description}>{course.description}</Typography>
            </Grid>
          </div>
          :
          <div maxWidth>
            <Grid item xs={12} >
              <Grid container className={classes.topItem}>
                <Grid item xs={3} sm={2} lg={1}>
                  <img src={course.urlImage} className={classes.courseImageStyle} />
                </Grid>
                <Grid item xs={9} sm={10} lg={11} align={"center"}>
                  <TextField
                    color='primary'
                    size='medium'
                    variant="filled"
                    label='Title'
                    type="text"
                    defaultValue={course.name}
                    onChange={e => setCourseTitle(e.target.value)}
                    margin="normal"
                  //fullWidth
                  //style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} >
              <TextField
                color='primary'
                size='medium'
                variant="filled"
                label='Description'
                type="text"
                defaultValue={course.description}
                //value={course.description}
                onChange={e => setCourseDescription(e.target.value)}
                margin="normal"
                required={true}
                fullWidth
                multiline
                rows={10}
                rowsMax={15}
              //style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
              />
            </Grid>
            <Button onClick={onEditSubmit}>Submit</Button>
          </div>
        }
        <Grid item xs={12}>
          <Divider className={classes.divider} />
        </Grid>
        <ModuleInfoEditButton edit={onEditModule} id={courseID} hideComponent={false} />
        <Grid item xs={12} className={classes.accordion}>

          {/* modules starts here */}
          {modules.map((module) => (
            <Accordion key={modules.indexOf(module)} onClick={e => enroll(module)} >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>Module {modules.indexOf(module) + 1}: {module.title}</Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.accordionDetails}>
                <Typography >
                  {/* Type: {module.type} */}
                  {module.type == "Quiz" &&
                    <div>
                      <Typography >Grade: {module.grade}/{module.quiz.length}</Typography>
                      <Typography>Grade needed to pass: {module.gradeToPass}/{module.quiz.length}</Typography>
                    </div>
                  }
                  <br />
                  {module.description}
                  <br />
                  <br />
                  <div >
                    {module.type === "Video" && <VideoModule fileUrl={module.fileUrl} />}
                    {module.type === "Pdf" && <PdfModule fileUrl={module.fileUrl} />}
                    {module.type === "Quiz" && <QuizModule quiz={module.quiz} moduleIndex={modules.indexOf(module)} courseID={courseID} />}
                  </div>
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>
      </Grid>
    </div >
  )
}

export default Course

