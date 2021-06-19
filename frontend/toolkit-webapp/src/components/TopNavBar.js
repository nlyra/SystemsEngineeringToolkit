import React, { useState } from 'react'
import { fade, makeStyles, IconButton, AppBar, Paper, TextField, Typography } from "@material-ui/core";
import { Toolbar, Tooltip, InputBase, Drawer, Divider, List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import {Avatar, Dialog, DialogTitle, DialogActions, DialogContent, Grid} from "@material-ui/core";

import MenuIcon from '@material-ui/icons/Menu'
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import config from '../config.json'
import SearchIcon from '@material-ui/icons/Search'
import AccountCircle from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PostAddIcon from '@material-ui/icons/PostAdd';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import DescriptionIcon from '@material-ui/icons/Description';
import BookOutlinedIcon from '@material-ui/icons/BookOutlined';
import HomeIcon from '@material-ui/icons/Home';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

import clsx from 'clsx';
import { Link } from '@material-ui/core';

const logo_url = "http://localhost:4000/misc_files/logo.jpg"

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({

    root:
    {
        // display: 'flex',
        // height: '5vh',
    },

    dialog:
    {
        position: 'absolute',

    },

    divider:
    {
        border: '2px solid teal',
    },

    dialogTitle:
    {
        textAlign: 'center',
        verticalAlign: 'middle',
        backgroundColor: 'silver',
        border: '2px solid white'
  
    },

    avatar:
    {
        color: theme.palette.getContrastText(deepPurple[500]),
        backgroundColor: deepPurple[500],
        height: '6vh',
        width: '6vh',
        margin: 'auto'
    },

    statsDiv:
    {
        width: '100%',
        margin: 'auto',
    },

    statsTitle:
    {
        textAlign: 'center',
        verticalAlign: 'middle',
        textDecoration: 'underline'
    },

    orange: 
    {
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
    },

    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        // backgroundColor: 'white',
        // color: 'white',
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    searchIcon2: {
        padding: theme.spacing(0, 5),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    logoStyle: {
        maxWidth: '10%',
        textAlign: 'center',
        margin: 'auto'
    },
    horizontalCenteringLogo: {
        position: 'absolute',
        left: '66%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
    },
    test: {
        display: 'flex',
        alignItems: 'space-between'
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        }
    },
    toolbar: {
        display: 'flex',
        // alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    appBar: {
        background: 'black',
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    // iconbutton:{
    //     position:'relative',
    //     paddingLeft:theme.spacing(0,2)
    // }
}))


export default function TopNavBar(props) {


    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [user, setUser] = useState({})
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')

    const handleClickOpen = async () => {

        if(firstName !== '')
        {
            setOpenDialog(true)
            return
        }

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
        setEmail(data.user.email)
        setOpenDialog(true)


    }

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const test = (val) => {
        props.history.push(`/dashboard`);
    };

    // const onSubmit = (e) => {
        
    //     e.preventDefault()
    //     if (firstName === user.first_name && lastName === user.last_name) {
    //         alert('No update made!')
    //         return
    //     }

    //     updateUserInfo({ firstName, lastName})
    //     // setFirstName('')
    //     // setLastName('')
    //     // setEmail('')
    //     // setPassword('')
    //     // setPasswordCopy('')
    // }

    // const updateUserInfo = async (creds) => {

    //     const res = await fetch(config.server_url + config.paths.updateUserInfo, {
    //         method: 'POST',
    //         headers: {
    //             'Content-type': 'application/json'
    //         },
    //         body: JSON.stringify({ 
    //         "first_name": creds.firstName, 
    //         "last_name": creds.lastName, 
    //         "email": creds.email, 
    //         "password": creds.password, 
    //         "password_copy": creds.passwordCopy,
    //         "classesEnrolled": [] })
    //     })

    //     const data = await res.json()

    //     if (data.message == "added user") {
    //         alert("Success, user Created!!");
    //         props.history.push('login')

    //     } else if (data.message === "email already connected to an account") {
    //         alert("email already connected to an account, please try again.");
    //     } else { // this is to check if there are errors not being addressed already
    //         console.log(data)
    //     }
    // }
    return (
        <div className={classes.root}>
            <AppBar
                // variant="permanent"
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
                                    {/* <div className={classes.searchIcon2}> */}
                                    <SearchIcon></SearchIcon>
                                    {/* </div> */}
                                </Link>
                            }
                        </>
                        : null}
                    <div className={classes.horizontalCenteringLogo}>
                        <img src={logo_url} alt="logo" className={classes.logoStyle} />
                    </div>
                    <div>
                        {/* <IconButton aria-label="show 4 new mails" color="inherit"> */}
                        {/* <Badge badgeContent={4} color="secondary"> */}
                        {/* <MailIcon /> */}
                        {/* </Badge> */}
                        {/* </IconButton> */}
                        {/* <IconButton aria-label="show 17 new notifications" color="inherit"> */}
                        {/* <Badge badgeContent={17} color="secondary"> */}
                        {/* <NotificationsIcon /> */}
                        {/* </Badge> */}
                        {/* </IconButton> */}
                        {props.hideComponents !== true ?
                            <IconButton
                                edge="end"
                                aria-label="account of current user"
                                //aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleClickOpen}
                                color="inherit"
                                className={classes.iconbutton}
                            >
                                <AccountCircle />
                            </IconButton>

                            : null}

                        {openDialog === true ?

                            <div className={classes.dialog}>
                                <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={openDialog}>
                                    <div className={classes.dialogTitleDiv}>
                                        <DialogTitle id="customized-dialog-title" className={classes.dialogTitle} onClose={handleClose}>
                                                Your Profile                                
                                        </DialogTitle>
                                    </div>
                                    <DialogContent >
                                        <form autoComplete="off">
                                                <Avatar className={classes.avatar}>{(firstName.charAt(0).concat(lastName.charAt(0))).toUpperCase()}</Avatar>
                                                <div className={classes.TextBox} alignItems="center">
                                                    <TextField color='primary'
                                                        alignContent="center"
                                                        disabled
                                                        size='small'
                                                        variant="outlined"
                                                        label='First Name'
                                                        inputProps={{min: 0, style: { textAlign: 'center' }}}
                                                        type="text"
                                                        defaultValue={user.first_name}
                                                        // onChange={e => setFirstName(e.target.value)}
                                                        margin="normal"
                                                        required={false}
                                                        // fullWidth
                                                        // style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                                                    />
                                                    <br/>
                                                    <TextField color='primary'
                                                        disabled
                                                        size='small'
                                                        variant="outlined"
                                                        inputProps={{min: 0, style: { textAlign: 'center' }}}
                                                        label='Last Name'
                                                        type="name"
                                                        defaultValue={user.last_name}
                                                        onChange={e => setLastName(e.target.value)}
                                                        margin="normal"
                                                        required={false}
                                                        // fullWidth
                                                        // style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                                                    />
                                                    <br/>
                                                    <TextField color='primary'
                                                        disabled
                                                        size='small'
                                                        variant="outlined"
                                                        inputProps={{min: 0, style: { textAlign: 'center' }}}
                                                        label='Email'
                                                        type="name"
                                                        defaultValue={user.email}
                                                        // onChange={e => setEmail(e.target.value)}
                                                        margin="normal"
                                                        required={false}
                                                        // fullWidth
                                                        // style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                                                    />
                                                    <br/><br/>
                                                    <Grid item xs={12}>
                                                        <Divider variant= 'fullWidth' className={classes.divider} />
                                                    </Grid>
                                                    <div className={classes.statsTitle}>
                                                        <h1>Stats</h1>
                                                    </div>
                                
                                                    <Grid container direction="row" >
                                                        <Grid item xs={6} sm={6} lg={4}>
                                                            <h6>Enrolled Courses </h6>
                                                            <Avatar className= {classes.orange}>{user.enrolledClasses.length}</Avatar>
                                                        </Grid>
                                                        <Grid item xs={6} sm={6} lg={4} >
                                                            <h6>Courses Created</h6>
                                                            <Avatar className= {classes.orange}>{user.createdCourses.length}</Avatar>
                                                        </Grid>
                                                        {/* <Grid item xs={6} sm={6} lg={4} >
                                                            <h6>Role ID</h6>
                                                            <Avatar className= {classes.orange}>{user.roleID}</Avatar>
                                                        </Grid> */}
                                                    </Grid>

                                                </div>
                                            {/* </Paper> */}
                                        </form>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button autoFocus onClick={handleClose} color="primary">
                                            Close Page
                                        </Button>
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
                                <IconButton
                                    edge="end"
                                    aria-label="homescreen"
                                    aria-haspopup="true"
                                    color="inherit"
                                >
                                    <HomeIcon />
                                </IconButton>
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
                        <Link href="/newCourse" underline='none' color="inherit">
                            <Tooltip title="Create Course" enterDelay={500}>
                                <ListItem button>
                                    <ListItemIcon><PostAddIcon /></ListItemIcon>
                                    <ListItemText primary="Create Course" />
                                </ListItem>
                            </Tooltip>
                        </Link>

                        <Link href="/MyCourses" underline='none' color="inherit">
                            <Tooltip title="My Courses" enterDelay={500}>
                                <ListItem button>
                                    <ListItemIcon><MenuBookIcon /></ListItemIcon>
                                    <ListItemText primary="My Courses" />
                                </ListItem>
                            </Tooltip>
                        </Link>

                        <Link href="/MyFiles" underline='none' color="inherit">
                            <Tooltip title="My Files" enterDelay={500}>
                                <ListItem button>
                                    <ListItemIcon><DescriptionIcon /></ListItemIcon>
                                    <ListItemText primary="My Files" />
                                </ListItem>
                            </Tooltip>
                        </Link>

                        <Tooltip title="Admin Dashboard" enterDelay={500}>
                            <Link href="/admindashboard" underline='none' color="inherit">
                                <ListItem button>
                                    <ListItemIcon><VerifiedUserIcon /></ListItemIcon>
                                    <ListItemText primary="Admin Dashboard" />
                                </ListItem>
                            </Link>
                        </Tooltip>

                        {/* <Tooltip title="Calendar" enterDelay={500}>*/}
                        <Link href="/ManageMyCourses" underline='none' color="inherit">
                            <Tooltip title="My Created Courses" enterDelay={500}>
                                <ListItem button>
                                    <ListItemIcon><BookOutlinedIcon /></ListItemIcon>
                                    <ListItemText primary="My Created Courses" />
                                </ListItem>
                            </Tooltip>
                        </Link>
                    </List>
                </Drawer>
                : null}
        </div>
    )

}
