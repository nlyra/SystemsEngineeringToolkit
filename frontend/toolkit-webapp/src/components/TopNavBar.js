import React, { useState } from 'react'
import { fade, makeStyles, IconButton, AppBar, Typography, Toolbar, Tooltip, InputBase, Drawer, Divider, List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import AccountCircle from '@material-ui/icons/AccountCircle';
//import logo from '../img/peostrilogo.png';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import PostAddIcon from '@material-ui/icons/PostAdd';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import DescriptionIcon from '@material-ui/icons/Description';
//import {Link } from "react-router-dom"
import { Link } from '@material-ui/core';
import BookOutlinedIcon from '@material-ui/icons/BookOutlined';
import HomeIcon from '@material-ui/icons/Home';
import clsx from 'clsx';
const logo_url = "http://localhost:4000/misc_files/logo.jpg"

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({

    root:
    {
        display: 'flex',
    },

    dialog:
    {
        // display: 'flex',
        position: 'absolute'
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
        alignItems: 'center',
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

    const handleClickOpen = () => {
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
                                    <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                                        Modal title
                                </DialogTitle>
                                    <DialogContent dividers>
                                        <Typography gutterBottom>
                                            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
                                            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                                        </Typography>
                                        <Typography gutterBottom>
                                            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                                            lacus vel augue laoreet rutrum faucibus dolor auctor.
                                        </Typography>
                                        <Typography gutterBottom>
                                            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                                            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
                                            auctor fringilla.
                                        </Typography>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button autoFocus onClick={handleClose} color="primary">
                                            Save changes
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

                        <Link href="/ManageMyCourses" underline='none' color="inherit">
                        <Tooltip title="My Created Courses" enterDelay={500}>
                            <ListItem button>
                                <ListItemIcon><BookOutlinedIcon/></ListItemIcon>
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
