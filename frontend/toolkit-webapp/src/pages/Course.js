import React, { useState, useEffect } from 'react'
import config from '../config.json'
import TopNavBar from '../components/TopNavBar'
import { IconButton, Chip, FormControlLabel, Divider,  Grid, Typography, Button } from '@material-ui/core'
import { Link as ReactLink } from 'react-router-dom';
import VideoModule from '../components/VideoModule'
import PdfModule from '../components/PdfModule'
import QuizModule from '../components/QuizModule'
import FileModule from '../components/FileModule'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ModuleInfoEditButton from '../components/ModuleInfoEditButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import courseStyles from '../styles/courseStyle';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { green, grey } from '@material-ui/core/colors';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

const Course = (props) => {
  const [course, setCourse] = useState({})
  const [modules, setModules] = useState([])
  const [courseID, setCourseID] = useState('')
  const [isCreator, setIsCreator] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const classes = courseStyles()

  // function that will run when page is loaded
  useEffect(() => {
    const pathname = window.location.pathname.split('/') //returns the current path
    const id = pathname[pathname.length - 1]

    const getAuthorization = async () => {
      const token = localStorage.getItem("token");
  
      const res = await fetch(config.server_url + config.paths.getIsCreator, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          "token": token
        })
      })
  
      const data = await res.json()
  
      if (data.newToken !== undefined)
        localStorage.setItem("token", data.newToken)
  
      if (data.message === "yes") {
        setIsCreator(true);
      } else
        setIsCreator(false);
    }

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
  
      if (data.newToken !== undefined)
        localStorage.setItem("token", data.newToken)
  
      if (data.message === undefined) {
        setCourse(data.course);
        setCourseID(id);
        // setOldCourseImage(data.course.urlImage);
        // setCurrCourseImage(data.course.urlImage);
        // setCourseTitle(data.course.name);
        // setCourseDescription(data.course.description);
        // setSkillLevel(data.course.skillLevel);
        // setIntendedAudience(data.course.intendedAudience);
        // setPrerequisite(data.course.prerequisite);
        setModules(data.course.modules);
        setIsEnabled(data.course.isEnabled);
        if (data.course.author === "yes")
          setIsOwner(true);
      } else if (data.message === "wrong token") {
        localStorage.removeItem('token');
        props.history.push('login');
        // probably alert the user
      } else if (data.message === "course not available") {
        props.history.push('/dashboard');
        // probably alert the user
      } else { // this is to check if there are errors not being addressed already
        console.log(data)
      }
    }

    getCourse(id)
    getAuthorization();

  }, [props]);


  const addModule = () => {
    sessionStorage.clear()
    props.history.push(`/newModule/${courseID}`)
  }


  const deleteModule = async (module) => {
    const token = localStorage.getItem("token");
    const res = await fetch(config.server_url + config.paths.deleteModule, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        'token': token,
        'courseID': course._id,
        // 'moduleID': indexOf(module),
        'title': module.title,
        'description': module.description,
      })
    })

    const data = await res.json()

    if (data.newToken !== undefined)
      localStorage.setItem("token", data.newToken)


    if (data.message === "unauthorized")
      props.history.push('/dashboard');
    else
      window.location.reload();
  }


  const isDisabled = (index) => {
    if (index >= 3) {
      if (modules[index - 1].completed === 1) {
        return false
      }
      return true
    }
    return false
  }

  const enableCourse = async (val) => {


    // send change to backend
    const token = localStorage.getItem("token");
    const res = await fetch(config.server_url + config.paths.changeEnabled, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        "token": token,
        "courseID": courseID,
        "isEnabled": val
      })
    })

    const data = await res.json()

    if (data.message === "unauthorized")
      props.history.push('/dashboard');
    else if (data.message === undefined) {
      setIsEnabled(val);
    } else if (data.message === "wrong token") {
      localStorage.removeItem('token');
      props.history.push('login');
      // probably alert the user

    } else { // this is to check if there are errors not being addressed already
      console.log(data)
    }

  }

  const handleComplete = async (index) => {
    // send the completed news to db
    const token = localStorage.getItem("token");
    const res = await fetch(config.server_url + config.paths.completedModule, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        "courseID": courseID,
        "token": token,
        "moduleID": index
      })
    })

    const data = await res.json()

    if (data.newToken !== undefined)
      localStorage.setItem("token", data.newToken)

    if (data.message === undefined) {
      let temp = modules;
      temp[index]["completed"] = 1
      setModules(temp)
      window.location.reload();

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
        <div maxWidth>
          <Grid item alignItems="center" xs={12}>
            <Grid container className={classes.topItem}>
              <Grid item xs={3} sm={2} lg={1} >
                <img src={config.server_url + course.urlImage} className={classes.currCourseImageStyle} />
              </Grid>
              <Grid item xs={8} sm={9} lg={9}>
                <h1
                  className={classes.title}>{course.name}
                </h1>
              </Grid>
            </Grid>
          </Grid>
          {(isCreator && isOwner) &&
            <Grid item xs={12} className={classes.enableButton}>
              <div>
                {isEnabled ?
                  <Button variant="outlined" color="secondary" onClick={() => enableCourse(false)}>Hide</Button>
                  :
                  <Button variant="outlined" color="primary" onClick={() => enableCourse(true)}>Show</Button>
                }
              </div>
              <div>
                <Button component={ReactLink} to={{ pathname: `/editCourse/${courseID}`, course: course }} type='submit' variant="contained" color="primary">
                  Edit course info
                </Button>
              </div>
            </Grid>
          }
          <Grid item xs={12} >
            <Typography className={classes.description}>{course.description}</Typography>
          </Grid>
        </div>

        <br></br>
          <Grid item xs={12}>
            <div className={classes.statsDiv}>
              <Chip label={"Skill Level: " + course.skillLevel} variant="outlined" />
              <Chip label={"Audience: " + course.intendedAudience} variant="outlined" />
              <Chip label={"Pre Requisite: " + course.prerequisite} variant="outlined" />
            </div>
          </Grid>
        <Grid item xs={12}>
          <Divider className={classes.divider} />
        </Grid>
        {(isCreator && isOwner) &&
          <Grid item xs={12} lg={3}>
            <Button
              variant="contained"
              color="primary"
              className={classes.addButton}
              startIcon={<AddIcon />}
              onClick={addModule}
            >
              Add Module
            </Button>
          </Grid>
        }
        <Grid item xs={12} className={classes.accordion}>
          {/* modules starts here */}
          {modules.map((module) => (
            <div>
              {((!isCreator || !isOwner) && isDisabled(modules.indexOf(module))) ?
                <Accordion key={modules.indexOf(module)} disabled >

                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    {module.completed !== 1 &&
                      <RadioButtonUncheckedIcon
                        style={{
                          color: grey[500],
                          marginRight: '20px'
                        }}
                      />
                    }

                    <Typography className={classes.heading}>Module {modules.indexOf(module) + 1}: {module.title}</Typography>
                  </AccordionSummary>
                </Accordion>
                :
                <Accordion key={modules.indexOf(module)} >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    {module.completed === 1 &&
                      <CheckCircleIcon
                        style={{
                          color: green[500],
                          marginRight: '20px'
                        }}
                      />
                    }
                    {module.completed !== 1 &&
                      <RadioButtonUncheckedIcon
                        style={{
                          color: grey[500],
                          marginRight: '20px'
                        }}
                      />
                    }
                    {(isCreator && isOwner) &&
                      <div>
                        <FormControlLabel
                          aria-label="Acknowledge"
                          onClick={(event) => event.stopPropagation()}
                          onFocus={(event) => event.stopPropagation()}
                          control={<ModuleInfoEditButton moduleIndex={modules.indexOf(module)} courseID={courseID} module={module} hideComponent={false} />}
                        />
                        <FormControlLabel
                          aria-label="Acknowledge"
                          onClick={(event) => event.stopPropagation()}
                          onFocus={(event) => event.stopPropagation()}
                          control={
                            <IconButton
                              type='submit'
                              className={classes.deleteButton}
                              variant="contained"
                              color="secondary"
                              onClick={() => window.confirm('Are you sure you wish to delete this module: ' + (modules.indexOf(module) + 1) + '?') && deleteModule(module)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          }
                        />
                      </div>
                    }
                    <Typography className={classes.heading}>Module {modules.indexOf(module) + 1}: {module.title}</Typography>
                  </AccordionSummary>
                  <AccordionDetails className={classes.accordionDetails}>
                    <div className={classes.accordionDiv}>
                      <Typography >

                        {/* Type: {module.type} */}
                        {module.type === "Quiz" &&
                          <div>
                            <Typography >Grade: {module.grade}/{module.quiz.length}</Typography>
                            <Typography>Grade needed to pass: {module.gradeToPass}/{module.quiz.length}</Typography>
                          </div>
                        }
                        <br />
                        {module.description}
                      </Typography>
                      <br />
                      <br />
                      <div className={classes.fileDiv}>
                        {module.type === "Video" && <VideoModule videoUrl={config.server_url + module.urlVideo} />}
                        {module.type === "PDF" && <PdfModule fileUrl={config.server_url + module.urlFile} />}
                        {module.type === "File" && <FileModule fileUrl={config.server_url + module.urlFile} />}
                        {module.type === "Quiz" && <QuizModule quiz={module.quiz} moduleIndex={modules.indexOf(module)} courseID={courseID} grade={module.grade} />}
                      </div>
                      <br />
                      {module.type !== "Quiz" &&
                        <div className={classes.completeDiv}>
                          {/* {module.completed === 1 ?
                            <Button disabled>Complete!</Button> */}
                          {/* : */}
                          <Button
                            variant="contained"
                            onClick={() => handleComplete(modules.indexOf(module))}
                            disabled={module.completed === 1}
                          >
                            Complete!
                          </Button>
                          {/* } */}
                        </div>
                      }
                    </div>
                  </AccordionDetails>
                </Accordion>}
            </div>
          ))}
        </Grid>
      </Grid>
    </div >
  )
}

export default Course