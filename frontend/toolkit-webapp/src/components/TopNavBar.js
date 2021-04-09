import React, { useState } from 'react'
import { fade, makeStyles, IconButton, Menu, AppBar, Toolbar, InputBase } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import logo from '../img/peostrilogo.png'

const useStyles = makeStyles((theme) => ({

    toolBarColor:
    {
        background: "black"
    },
    grow:
    {
        flexGrow: 1
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
      horizontalCentering: {
        position: 'absolute', 
        left: '50%', 
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }
}))

export default function TopNavBar() {

    const classes = useStyles()

    return (
        <div className={classes.grow}>
        <AppBar position="static" className={classes.toolBarColor}>
            <Toolbar>
                <IconButton>
                    <MenuIcon style={{color: "white"}}></MenuIcon>
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
                    />
                </div>
                <div className={classes.horizontalCentering}>
                    <img src={logo} alt="logo" className={classes.logoStyle}/>
                </div>
            </Toolbar>
        </AppBar>
    </div>
    )

}