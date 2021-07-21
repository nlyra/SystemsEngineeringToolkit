import React, { useState, useEffect } from 'react'
import { IconButton, AppBar, TextField, Typography } from "@material-ui/core";
import { Toolbar, Tooltip, InputBase, Drawer, Divider, List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import { Avatar, Dialog, DialogTitle, DialogActions, DialogContent, Grid } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu'
import config from '../config.json'
import SearchIcon from '@material-ui/icons/Search'
import AccountCircle from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PostAddIcon from '@material-ui/icons/PostAdd';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import BookOutlinedIcon from '@material-ui/icons/BookOutlined';
import HomeIcon from '@material-ui/icons/Home';
import HelpIcon from '@material-ui/icons/Help';
import styles from '../styles/topNavBarStyle'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import clsx from 'clsx';
import { Link } from '@material-ui/core';
const logo_url = config.server_url + "/misc_files/logo.jpg"



export default function TopNavBar(props) {


  const classes = styles();
  const [open, setOpen] = React.useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [user, setUser] = useState({})
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [roleInfo, setRoleInfo] = useState(-1)
  const [numUsers, setNumUsers] = useState(0)
  const [numCourses, setNumCourses] = useState(0)
  const [loggingout, setLoggingout] = useState(false)

  let roles = ['Student', 'Creator', 'Admin']

  // function that will run when page is loaded
  useEffect(() => {
    const getAuthorization = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(config.server_url + config.paths.getIsAdmin, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          "token": token
        })
      })

      const data = await res.json()

      if (data.message === "yes")
        setIsAdmin(true);
      else
        setIsAdmin(false);

      const res2 = await fetch(config.server_url + config.paths.getIsCreator, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          "token": token
        })
      })

      const data2 = await res2.json()

      if (data2.message === "yes")
        setIsCreator(true);
      else
        setIsCreator(false);

    }
    if (props.hideComponents !== true)
      getAuthorization();
  }, [props]);





  const handleClickOpen = async () => {

    // Retrieve token, then feed topNavBar with information about the current user
    const token = localStorage.getItem("token");

    const res = await fetch(config.server_url + config.paths.getUserInfo, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        "token": token
      })
    })

    const data = await res.json()

    setUser(data.user)
    setFirstName(data.user.first_name)
    setLastName(data.user.last_name)
    setNewEmail(data.user.email)
    setRoleInfo(data.user.roleID)

    if (data.user.roleID === 2) {
      setNumUsers(data.numUsers)
      setNumCourses(data.numCourses)
    }
    setOpenDialog(true)


  }

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleChanges = async () => {

    if (user.email !== newEmail) {
      if (newEmail.indexOf('@') === -1) {
        alert('Please input a valid email format.')
        return
      }

      if (!window.confirm("Are you sure you would like to save your changes?")) {
        setOpenDialog(false)
        return
      }

      const token = localStorage.getItem("token");

      const res = await fetch(config.server_url + config.paths.updateUserInfo, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          "token": token,
          "email": newEmail
        })
      })

      const data = await res.json()

      if (data.message === "wrong token") {
        localStorage.removeItem('token');
        props.history.push('login');
      }

    }
    setOpenDialog(false);
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const logout = () => {
    localStorage.clear()
    sessionStorage.clear()
  }

  const handleOpenDialog = () => {
    setLoggingout(true);
  }

  const handleCloseDialog = () => {
    setLoggingout(false);
  };

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          {props.hideComponents !== true ?
            <>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, {
                  [classes.hide]: open,
                })}
              >

                <MenuIcon style={{ color: "white" }}></MenuIcon>
              </IconButton>
              {window.location.pathname === "/dashboard" ||
                window.location.pathname === "/MyCourses" ||
                window.location.pathname === "/ManageMyCourses" ?
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon></SearchIcon>
                  </div>

                  < InputBase
                    placeholder="Search..."
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                    onChange={e => props.search(e.target.value)}
                  />
                </div>
                :
                <Link href="/dashboard" underline='none' color="inherit">
                  <SearchIcon></SearchIcon>
                </Link>
              }
            </>
            : null}
          <div className={classes.horizontalCenteringLogo}>
            <img src={logo_url} alt="logo" className={classes.logoStyle} />
          </div>
          <div>
            {props.hideComponents !== true ?
              <Tooltip title="My Profile" >
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  onClick={handleClickOpen}
                  color="inherit"
                  className={classes.iconbutton}
                >
                  <AccountCircle />
                </IconButton>
              </Tooltip>

              : null}



            {openDialog === true ?

              <div className={classes.dialog}>
                <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={openDialog}>
                  <div className={classes.dialogTitleDiv}>
                    <DialogTitle id="customized-dialog-title" className={classes.dialogTitle} onClose={handleClose}>
                      <Avatar className={classes.avatar}>{(firstName.charAt(0).concat(lastName.charAt(0))).toUpperCase()}</Avatar>
                    </DialogTitle>
                  </div>
                  <DialogContent className={classes.dialogContent}>
                    {roleInfo === 0 ?
                      <form autoComplete="off">
                        <div className={classes.TextBox} alignItems="center">
                          <TextField color='primary'
                            alignContent="center"
                            size='small'
                            variant="outlined"
                            label='First Name'
                            inputProps={{ min: 0, readOnly: true, style: { textAlign: 'center' } }}
                            type="text"
                            defaultValue={user.first_name}
                            margin="normal"
                            required={false}
                            fullWidth
                          />
                          <br />
                          <TextField color='primary'
                            size='small'
                            variant="outlined"
                            inputProps={{ min: 0, readOnly: true, style: { textAlign: 'center' } }}
                            label='Last Name'
                            type="text"
                            defaultValue={user.last_name}
                            margin="normal"
                            required={false}
                            fullWidth
                          />
                          <br />
                          <TextField color='primary'
                            size='small'
                            variant="outlined"
                            inputProps={{ min: 0, style: { textAlign: 'center' } }}
                            label="Email"
                            type="email"
                            defaultValue={user.email}
                            onChange={e => setNewEmail(e.target.value)}
                            margin="normal"
                            required={true}
                            fullWidth
                          />
                          <Grid container direction="row" alignItems='center' className={classes.roleGrid}>
                            <Grid item xs={6} sm={6} lg={6} >
                              <div className={classes.roleStatContent}>
                                <div className={classes.roleText}>
                                  <h3>User Role</h3>
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={6} sm={6} lg={6} >
                              <Typography className={classes.roleDescription}>
                                {roles[user.roleID]}
                                <Tooltip
                                  title={
                                    <React.Fragment>
                                      <Typography align="center" color="inherit">User Role Information</Typography>
                                      {"The student role allows the user to take courses but does not given them access to course or module creation"}
                                    </React.Fragment>
                                  }
                                  placement="top"
                                  enterDelay={200}
                                  arrow
                                >
                                  <IconButton size='small'><HelpIcon /></IconButton>
                                </Tooltip>
                              </Typography>
                            </Grid>
                          </Grid>

                          <Grid item xs={12}>
                            <Divider variant='fullWidth' className={classes.divider} />
                          </Grid>
                          <div className={classes.statsTitle}>
                            <h1>Stats</h1>
                          </div>

                          <Grid container direction="row" >
                            <Grid item xs={6} sm={6} lg={6} >
                              <div className={classes.statContent}>
                                <div className={classes.statText}>
                                  <h5>Enrolled Courses</h5>
                                </div>
                                <Avatar className={classes.statsAvi}>{user.enrolledClasses.length}</Avatar>
                              </div>
                            </Grid>
                            <Grid item xs={6} sm={6} lg={6} >
                              <div className={classes.statContent}>
                                <div className={classes.statText}>
                                  <h5>Completed Courses</h5>
                                </div>
                                <Avatar className={classes.statsAvi}>{user.completedCourses.length}</Avatar>
                              </div>
                            </Grid>
                          </Grid>
                        </div>
                      </form>
                      : null}

                    {roleInfo === 1 ?
                      <form autoComplete="off">
                        <div className={classes.TextBox} alignItems="center">
                          <TextField color='primary'
                            alignContent="center"
                            size='small'
                            variant="outlined"
                            label='First Name'
                            inputProps={{ min: 0, readOnly: true, style: { textAlign: 'center' } }}
                            type="text"
                            defaultValue={user.first_name}
                            margin="normal"
                            required={false}
                            fullWidth
                          />
                          <br />
                          <TextField color='primary'
                            size='small'
                            variant="outlined"
                            inputProps={{ min: 0, readOnly: true, style: { textAlign: 'center' } }}
                            label='Last Name'
                            type="text"
                            defaultValue={user.last_name}
                            margin="normal"
                            required={false}
                            fullWidth
                          />
                          <br />
                          <TextField color='primary'
                            size='small'
                            variant="outlined"
                            inputProps={{ min: 0, style: { textAlign: 'center' } }}
                            label='Email'
                            type="email"
                            defaultValue={user.email}
                            onChange={e => setNewEmail(e.target.value)}
                            margin="normal"
                            required={true}
                            fullWidth
                          />
                          <Grid container direction="row" alignItems='center' className={classes.roleGrid}>
                            <Grid item xs={6} sm={6} lg={6} >
                              <div className={classes.roleStatContent}>
                                <div className={classes.roleText}>
                                  <h3>User Role</h3>
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={6} sm={6} lg={6} >
                              <Typography className={classes.roleDescription}>
                                {roles[user.roleID]}
                                <Tooltip
                                  title={
                                    <React.Fragment>
                                      <Typography align="center" color="inherit">User Role Information</Typography>
                                      {"The creator role allows the user to create and manage courses. This role also allows the user to create and manage modules within courses they have made. The following options are available for management of both courses and modules: Add, Edit, and Delete. Creators can also take courses as a student would"}
                                    </React.Fragment>
                                  }
                                  placement="top"
                                  enterDelay={200}
                                  arrow
                                >
                                  <IconButton size='small'><HelpIcon /></IconButton>
                                </Tooltip>
                              </Typography>
                            </Grid>
                          </Grid>

                          <Grid item xs={12}>
                            <Divider variant='fullWidth' className={classes.divider} />
                          </Grid>
                          <div className={classes.statsTitle}>
                            <h1>Stats</h1>
                          </div>

                          <Grid container direction="row" >
                            <Grid item xs={4} sm={4} lg={4} >
                              <div className={classes.statContent}>
                                <div className={classes.statText}>
                                  <h5>Courses Enrolled In</h5>
                                </div>
                                <Avatar className={classes.statsAvi}>{user.enrolledClasses.length}</Avatar>
                              </div>
                            </Grid>
                            <Grid item xs={4} sm={4} lg={4} >
                              <div className={classes.statContent}>
                                <div className={classes.statText}>
                                  <h5>Courses Completed</h5>
                                </div>
                                <Avatar className={classes.statsAvi}>{user.completedCourses.length}</Avatar>
                              </div>
                            </Grid>
                            <Grid item xs={4} sm={4} lg={4} >
                              <div className={classes.statContent}>
                                <div className={classes.statText}>
                                  <h5>Courses Created</h5>
                                </div>
                                <Avatar className={classes.statsAvi}>{user.createdCourses.length}</Avatar>
                              </div>
                            </Grid>
                          </Grid>
                        </div>
                      </form>
                      : null}

                    {roleInfo === 2 ?
                      <form autoComplete="off">
                        <div className={classes.TextBox} alignItems="center">
                          <TextField color='primary'
                            alignContent="center"
                            size='small'
                            variant="outlined"
                            label='First Name'
                            inputProps={{ min: 0, readOnly: true, style: { textAlign: 'center' } }}
                            type="text"
                            defaultValue={user.first_name}
                            margin="normal"
                            required={false}
                            fullWidth
                          />
                          <br />
                          <TextField color='primary'
                            size='small'
                            variant="outlined"
                            inputProps={{ min: 0, readOnly: true, style: { textAlign: 'center' } }}
                            label='Last Name'
                            type="text"
                            defaultValue={user.last_name}
                            margin="normal"
                            required={false}
                            fullWidth
                          />
                          <br />
                          <TextField color='primary'
                            size='small'
                            variant="outlined"
                            inputProps={{ min: 0, style: { textAlign: 'center' } }}
                            label='Email'
                            type="email"
                            defaultValue={user.email}
                            onChange={e => setNewEmail(e.target.value)}
                            margin="normal"
                            required={true}
                            fullWidth
                          />
                          <Grid container direction="row" alignItems='center' className={classes.roleGrid}>
                            <Grid item xs={6} sm={6} lg={6} >
                              <div className={classes.roleStatContent}>
                                <div className={classes.roleText}>
                                  <h3>User Role</h3>
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={6} sm={6} lg={6} >
                              <Typography className={classes.roleDescription}>                                                                {roles[user.roleID]}
                                <Tooltip
                                  title={
                                    <React.Fragment>
                                      <Typography align="center" color="inherit">User Role Information</Typography>
                                      {"The Admin role allows the user to have full access to the application. The Admin can access the admin dashboard which gives them the access to: edit user roles, delete users, delete courses, delete categories, and see a whole host of statistics. The Admin is also able to create courses and take courses as a creator and student would respectively"}
                                    </React.Fragment>
                                  }
                                  placement="top"
                                  enterDelay={200}
                                  arrow
                                >
                                  <IconButton size='small'><HelpIcon /></IconButton>
                                </Tooltip>
                              </Typography>
                            </Grid>
                          </Grid>

                          <Grid item xs={12}>
                            <Divider variant='fullWidth' className={classes.divider} />
                          </Grid>
                          <div className={classes.statsTitle}>
                            <h2>Database Info</h2>
                          </div>
                          <Grid container direction="row" >
                            <Grid item xs={6} sm={6} lg={6} >
                              <div className={classes.statContent}>
                                <div className={classes.statText}>
                                  <h5>Users In System</h5>
                                </div>
                                <Avatar className={classes.statsAvi}>{numUsers}</Avatar>
                              </div>
                            </Grid>
                            <Grid item xs={6} sm={6} lg={6} >
                              <div className={classes.statContent}>
                                <div className={classes.statText}>
                                  <h5>Total Courses</h5>
                                </div>
                                <Avatar className={classes.statsAvi}>{numCourses}</Avatar>
                              </div>
                            </Grid>
                          </Grid>
                          <br />
                          <Grid item xs={12}>
                            <Divider variant='fullWidth' className={classes.divider} />
                          </Grid>
                          <div className={classes.statsTitle}>
                            <h2>My Stats</h2>
                          </div>
                          <Grid container direction="row" >
                            <Grid item xs={4} sm={4} lg={4} >
                              <div className={classes.statContent}>
                                <div className={classes.statText}>
                                  <h5>Courses Enrolled In</h5>
                                </div>
                                <Avatar className={classes.statsAvi}>{user.enrolledClasses.length}</Avatar>
                              </div>
                            </Grid>
                            <Grid item xs={4} sm={4} lg={4} >
                              <div className={classes.statContent}>
                                <div className={classes.statText}>
                                  <h5>Courses Completed</h5>
                                </div>
                                <Avatar className={classes.statsAvi}>{user.completedCourses.length}</Avatar>
                              </div>
                            </Grid>
                            <Grid item xs={4} sm={4} lg={4} >
                              <div className={classes.statContent}>
                                <div className={classes.statText}>
                                  <h5>Courses Created</h5>
                                </div>
                                <Avatar className={classes.statsAvi}>{user.createdCourses.length}</Avatar>
                              </div>
                            </Grid>
                          </Grid>
                        </div>
                      </form>
                      : null}


                  </DialogContent>
                  <DialogActions>
                    <Grid container>
                      <Grid item xs={6} sm={6} lg={6}>
                        <Button className={classes.closeButton} color="primary" onClick={handleClose}>
                          Close
                        </Button>
                      </Grid>
                      <Grid item xs={6} sm={6} lg={6}>
                        {newEmail !== user.email &&
                          <Button color="primary" onClick={handleChanges}>
                            Save Changes
                          </Button>
                        }
                      </Grid>
                    </Grid>
                  </DialogActions>

                </Dialog>
              </div>

              : null}

            {window.location.pathname !== "/" &&
              window.location.pathname !== "/registration" &&
              window.location.pathname !== "/forgot" &&
              window.location.pathname !== "/reset/" + props.tokenProp &&
              window.location.pathname !== "/reset/" &&
              window.location.pathname !== "/login" ?
              <Link href="/dashboard" underline='none' color="inherit">
                <Tooltip title="Home Screen" >
                  <IconButton
                    edge="end"
                    aria-label="homescreen"
                    aria-haspopup="true"
                    color="inherit"
                  >
                    <HomeIcon />
                  </IconButton>
                </Tooltip>
              </Link>

              : null}
          </div>
        </Toolbar>
      </AppBar>


      {props.hideComponents !== true ?
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>

            {(isCreator || isAdmin) &&
              <Link href="/newCourse" underline='none' color="inherit">
                <Tooltip title="Create Course" enterDelay={500}>
                  <ListItem button>
                    <ListItemIcon><PostAddIcon /></ListItemIcon>
                    <ListItemText primary="Create Course" />
                  </ListItem>
                </Tooltip>
              </Link>
            }

            <Link href="/MyCourses" underline='none' color="inherit">
              <Tooltip title="My Courses" enterDelay={500}>
                <ListItem button>
                  <ListItemIcon><MenuBookIcon /></ListItemIcon>
                  <ListItemText primary="My Courses" />
                </ListItem>
              </Tooltip>
            </Link>


            {isAdmin &&
              <Tooltip title="Admin Dashboard" enterDelay={500}>
                <Link href="/admindashboard" underline='none' color="inherit">
                  <ListItem button>
                    <ListItemIcon><VerifiedUserIcon /></ListItemIcon>
                    <ListItemText primary="Admin Dashboard" />
                  </ListItem>
                </Link>
              </Tooltip>
            }

            {(isCreator || isAdmin) &&
              <Link href="/ManageMyCourses" underline='none' color="inherit">
                <Tooltip title="My Created Courses" enterDelay={500}>
                  <ListItem button>
                    <ListItemIcon><BookOutlinedIcon /></ListItemIcon>
                    <ListItemText primary="My Created Courses" />
                  </ListItem>
                </Tooltip>
              </Link>
            }
            <Link onClick={handleOpenDialog} underline='none' color="inherit" >
              <Tooltip title="Log out" enterDelay={500}>
                <ListItem button>
                  <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                  <ListItemText primary="Log out" />
                </ListItem>
              </Tooltip>
            </Link>
            <div className={classes.dialog}>
              <Dialog onClose={handleCloseDialog} aria-labelledby="customized-dialog-title" open={loggingout}>
                <div className={classes.dialogTitleDiv}>
                  <DialogTitle id="customized-dialog-title" className={classes.logoutDialogTitle} onClose={handleCloseDialog}>
                    Are you sure you wish to log out of your account?
                  </DialogTitle>
                </div>
                <DialogContent className={classes.dialogContent}>
                  <Button href='\' type='submit' size="small" color="inherit" variant="contained" onClick={logout}>
                    Yes
                  </Button>
                  <Button type='submit' size="small" color="inherit" variant="contained" onClick={handleCloseDialog}>
                    No
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </List>
        </Drawer>
        : null}
    </div>




  )

}