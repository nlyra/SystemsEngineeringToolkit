import React, { useState } from 'react'
import { fade, makeStyles, IconButton, useTheme, Menu, AppBar, Toolbar, InputBase, Badge, Drawer, Divider, List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import MailIcon from '@material-ui/icons/Mail'
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications'
import logo from '../img/peostrilogo.png';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import PostAddIcon from '@material-ui/icons/PostAdd';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import DescriptionIcon from '@material-ui/icons/Description';
import clsx from 'clsx';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root:
    {
        display: 'flex',
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
        left: '50%', 
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
          background: "grey",
        }),
      },
      drawerClose: {
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
          background: "grey",
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
        background : 'black',
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
}))

export default function TopNavBar({search}) {

    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
      };
    
    const handleDrawerClose = () => {
        setOpen(false);
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
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon></SearchIcon>
                        </div>
                        <InputBase 
                            placeholder="Search..."
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={e => search(e.target.value)}
                        />
                    </div>
                    <div className={classes.horizontalCenteringLogo}>
                        <img src={logo} alt="logo" className={classes.logoStyle}/>
                    </div>
                    <div>
                        {/*(<IconButton aria-label="show 4 new mails" color="inherit">
                            <Badge badgeContent={4} color="secondary">
                                <MailIcon />
                            </Badge>
                        </IconButton>
                        <IconButton aria-label="show 17 new notifications" color="inherit">
                            <Badge badgeContent={17} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>*/}
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            //aria-controls={menuId}
                            aria-haspopup="true"
                            //onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
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
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem button>
                        <ListItemIcon><PostAddIcon/></ListItemIcon>
                        <ListItemText primary="Create Course" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon><MenuBookIcon/></ListItemIcon>
                        <ListItemText primary="My Courses" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon><DescriptionIcon/></ListItemIcon>
                        <ListItemText primary="My Files" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon><CalendarTodayIcon/></ListItemIcon>
                        <ListItemText primary="Calendar" />
                    </ListItem>
                </List>
            </Drawer>
        </div>
    )

}