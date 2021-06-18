import React, { useState, useEffect } from 'react'
import config from '../config.json'
import TopNavBar from '../components/TopNavBar'
import { Link, FormControlLabel, Divider, makeStyles, Grid, Typography, TextField, Button, Container } from '@material-ui/core'
import VideoModule from '../components/VideoModule'
import PdfModule from '../components/PdfModule'
import QuizModule from '../components/QuizModule'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CourseInfoEditButton from '../components/CourseInfoEditButton';
import ModuleInfoEditButton from '../components/ModuleInfoEditButton';
import AddIcon from '@material-ui/icons/Add';
import courseStyles from '../styles/courseStyle';
import jwt_decode from "jwt-decode";


const Course = (props) => {
  const [course, setCourse] = useState({})
  const [modules, setModules] = useState([])
  const [oldCourseImage, setOldCourseImage] = useState('')
  const [currCourseImage, setCurrCourseImage] = useState('')
  const [courseTitle, setCourseTitle] = useState('')
  const [courseDescription, setCourseDescription] = useState('')
  const [editCourseInfo, setEditCourseInfo] = useState(false)
  const [courseID, setCourseID] = useState('')

  let validImageTypes = ["png", "PNG", "jpeg", "jpg"]

  const classes = courseStyles()

  const onEditCourseTitle = (e) => {
    setEditCourseInfo(true);
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
      setOldCourseImage(data.course.urlImage);
      setCurrCourseImage(data.course.urlImage);
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
    const token = localStorage.getItem("token");

    const res = await fetch(config.server_url + config.paths.updateCourseInfo, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        'token' : token,
        'courseID': courseID,
        "name": courseTitle,
        "description": courseDescription,
      })
    })

    const data = await res.json()

    // We have a new image being passed in so delete old file
    if ((oldCourseImage !== null) && (oldCourseImage !== currCourseImage)) {

      const res = await fetch(config.server_url + config.paths.removeFile, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          'token': token,
          'courseID': courseID,
          'imageName': oldCourseImage
        })
      })
    }


    const imageData = new FormData();
    imageData.append('file', currCourseImage)


    // Checking to see if the file inputted is not an actual image
    const imageTypePath = currCourseImage.name.split('.') 
    const imageType = imageTypePath[imageTypePath.length - 1]
    const validInput = validImageTypes.includes(imageType);

    if(!validInput)
    {
      alert('Invalid file type. Please upload an image with the extension .jpg or .png')
      return
    }

    if (currCourseImage.name !== oldCourseImage.name) {

      if(currCourseImage)
      if (data.message === undefined) {
        const res = await fetch(config.server_url + config.paths.fileUpload + "?token=" + token + "&courseID=" + courseID + "&imageName=" + currCourseImage.name, {
          method: 'POST',
          body: imageData
        })
        const data2 = await res.json()

      }
      else { // this is to check if there are errors not being addressed already
        console.log(data)
      }
    }
    else {
      const res = await fetch(config.server_url + config.paths.updateCourseImage, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          'token': token,
          'courseID': courseID,
          "imageLink": currCourseImage,
        })
      })
    }
       
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
                <Grid item xs={3} sm={2} lg={1} >
                  <img src={course.urlImage} className={classes.currCourseImageStyle} />
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
                  <img src={course.urlImage} className={classes.currCourseImageStyle} />
                </Grid>
                <Grid item xs={9} sm={10} lg={11} align={"center"}>
                  <TextField
                    color='primary'
                    size='medium'
                    variant="outlined"
                    inputProps={{ style: {textAlign: 'center'} }}
                    label='Title'
                    type="text"
                    defaultValue={course.name}
                    onChange={e => setCourseTitle(e.target.value)}
                    margin="normal"
                  //fullWidth
                  //style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                  />
                </Grid>
                  <input type="file" name="picture" accept="image/*" className={classes.currCourseImageStyle} onChange={e => setCurrCourseImage(e.target.files[0])} />
              </Grid>
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                color='primary'
                size='medium'
                variant='filled'
                label='Description'
                type="text"
                defaultValue={course.description}
                onChange={e => setCourseDescription(e.target.value)}
                margin="normal"
                required={true}
                fullWidth
                multiline
                rows={4}
                rowsMax={10}
              />
            </Grid>
            <Button variant="contained" onClick={onEditSubmit}>Submit</Button>
          </div>
        }
      
      <br></br>
        <Grid item xs={12}>
          <Divider className={classes.divider} />
        </Grid>
        <Grid item xs={12} lg={3}>
          <Link href={`/newModule/${courseID}`} underline={'none'}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<AddIcon />}
            >
              Add Module
            </Button>
          </Link>
        </Grid> 
         <Grid item xs={12} className={classes.accordion}>
          {/* modules starts here */}
           {modules.map((module) => (
            <Accordion key={modules.indexOf(module)} onClick={e => enroll(module)} >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <FormControlLabel
                  aria-label="Acknowledge"
                  onClick={(event) => event.stopPropagation()}
                  onFocus={(event) => event.stopPropagation()}
                  control={<ModuleInfoEditButton moduleIndex={modules.indexOf(module)} courseID={courseID} module={module} hideComponent={false} />}
                /> 
                 <Typography className={classes.heading}>Module {modules.indexOf(module) + 1}: {module.title}</Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.accordionDetails}>
                <Typography > 
                  Type: {module.type} 
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

