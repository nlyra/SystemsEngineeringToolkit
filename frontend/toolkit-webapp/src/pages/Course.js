import React, { useState, useEffect } from 'react'
import config from '../config.json'
import TopNavBar from '../components/TopNavBar'
import { Divider, makeStyles, Grid, Typography } from '@material-ui/core'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const dashStyles = makeStyles((theme) => ({

  div: {
    display: 'flex'
  },

  title: {
    fontSize: '50px',
    textAlign: "center",
  },

  topItem: {
    // paddingTop: '5.36%',
    // paddingBottom: '8%',
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
    <div className={classes.div}>
      <TopNavBar>
      </TopNavBar>
      <Grid container direction="column" >
        <Grid item xs={12} >
          <Grid container className={classes.topItem}>
            <Grid item xs={3} sm={2} lg={1}>
              <img src={course.urlImage} className={classes.courseImageStyle} />
            </Grid>
            <Grid item xs={9} sm={10} lg={11}>
              <h1 className={classes.title} >{course.name} </h1>
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
          {/* <div className={classes.root}> */}
          <Accordion >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>Accordion 1</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                sit amet blandit leo lobortis eget.
          </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography className={classes.heading}>Accordion 2</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                sit amet blandit leo lobortis eget.
          </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography className={classes.heading}>Accordion 3</Typography>
            </AccordionSummary>
          </Accordion>
          {/* </div> */}
        </Grid>
      </Grid>
    </div>
  )
}

export default Course


{/* <Container className={classes.outerContainer}>
<Container className={classes.container}>
  <img src={course.urlImage} className={classes.courseImageStyle} />
  <h1 className={classes.title} >{course.name} </h1>
  <Typography className={classes.description}>{course.description}</Typography>
</Container>
</Container>
<Divider /> */}