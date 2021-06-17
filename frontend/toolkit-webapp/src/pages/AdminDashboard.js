import React, { useState } from 'react'
import TopNavBar from '../components/TopNavBar'
import { Divider, makeStyles, Grid, Button, Container } from '@material-ui/core'
import AdminUsersTab from '../components/AdminUsersTab'
import AdminCoursesTab from '../components/AdminCoursesTab'
import AdminCategoriesTab from '../components/AdminCategoriesTab'

const adminStyles = makeStyles((theme) => ({
  div: {
    position: 'center',
    paddingTop: '2vh',
    paddingLeft: '5vh',
    paddingRight: '1vh'

  },

  outerDiv: {
  },

  topItem: {
    paddingTop: '4.9vh',
    paddingBottom: '5%',
    justifyContent: 'center'
  },

  divider: {
    margin: theme.spacing(1, 3),
  },

  button: {
    fontWeight: 'bold',
  },

  innerGrid: {
    paddingLeft: '0px',
    marginLeft: '0px',
  },

  innerDiv: {
    paddingBottom: '100px',
  },

}))
const AdminDashboard = (props) => {
  const [currTab, setCurrTab] = useState(Number(new URLSearchParams(props.location.search).get('tab')) || 0)

  const classes = adminStyles()


  return (
    <div className={classes.div}>
      <TopNavBar />
      <div className={classes.outerDiv}>
        <Grid container direction="column" className={classes.div}>
          <Grid item xs={12} >
            <Grid container className={classes.topItem}>
              <Grid item xs={12} sm={2} lg={1} classeName={classes.innerGrid}>
                <Button className={classes.button} onClick={() => setCurrTab(0)} >users</Button>
              </Grid>

              <Grid item xs={3} sm={2} lg={1} classeName={classes.innerGrid}>
                <Button className={classes.button} onClick={() => setCurrTab(1)} >Courses</Button>
              </Grid>
              <Grid item xs={3} sm={2} lg={1} classeName={classes.innerGrid}>
                <Button className={classes.button} onClick={() => setCurrTab(2)} >Categories</Button>
              </Grid>

            </Grid>
          </Grid>
          <Grid item xs={12} >

          </Grid>
          <Grid item xs={12}>
            <Divider className={classes.divider} />
            <br />
          </Grid>
          <Grid item xs={12}>
            <div className={classes.innerDiv}>
              {currTab === 0 && <AdminUsersTab setCurrTab={setCurrTab}/>}
              {currTab === 1 && <AdminCoursesTab setCurrTab={setCurrTab}/>}
              {currTab === 2 && <AdminCategoriesTab setCurrTab={setCurrTab}/>}
            </div>
          </Grid>

        </Grid>
      </div>

    </div>
  )
}

export default AdminDashboard
