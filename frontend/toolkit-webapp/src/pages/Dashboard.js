import React, { useState } from 'react'
import {AppBar, Toolbar, Button, Card, CardActions, Container, CssBaseline, 
        Divider, makeStyles, Grid, CardMedia, CardContent, Typography, Paper,
        IconButton, Menu} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import '../css/dashboard.css'
import '../components/TopNavBar'
import TopNavBar from '../components/TopNavBar'

const useStyles = makeStyles((theme) => ({

    container:
    {
        marginTop: theme.spacing(15)
    },

    card:
    {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },

    cardMedia:
    {
        paddingTop: '56.25%',
        size: '30%'
    },

    CardContent:
    {
        flexGrow: 1,
    },
    grow:
    {
        flexGrow: 1
    },
}))

const cards = [1, 2, 3, 4, 5, 6]
const Dashboard = () => {

    const classes = useStyles()
    return (
        <div>
            <TopNavBar>
            </TopNavBar>
            <CssBaseline />
            <Container maxWidth="lg" className={classes.container}>
                <div className='createModules'>
                    <Grid container spacing={3} justify="center">
                        <Grid item>
                            <Button variant="contained">
                                Create Course
                            </Button>
                        </Grid>

                        <Grid item>
                            <Button variant="contained">
                                My Courses
                            </Button>
                        </Grid>

                        <Grid item>
                            <Button variant="contained">
                                My Files
                            </Button>
                        </Grid>

                        <Grid item>
                            <Button variant="contained">
                                Calendar
                        </Button>
                        </Grid>

                    </Grid>
                </div>

                <div className='modules'>
                    <Grid container spacing={3}>
                        {cards.map((card) => (

                            <Grid item key={card} xs={12} sm={4} md={3}>
                                <Card className={classes.card}>
                                    <CardMedia
                                        className={classes.cardMedia}
                                        image="https://source.unsplash.com/random"
                                        title="Title"
                                    />
                                    <CardContent className={classes.CardContent}>
                                        <Typography variant="h5">
                                            Module Name
                                        </Typography>
                                        <Typography gutterBottom>
                                            Placeholder for the module content.
                                        </Typography>
                                        <CardActions>
                                            <Button variant="outlined" size="small">
                                                View Module
                                            </Button>
                                            <Button variant="outlined" size="small">
                                                Edit
                                            </Button>
                                        </CardActions>
                                    </CardContent>
                                </Card>
                            </Grid>

                        ))}
                    </Grid>
                </div>
            </Container>
        </div>
    )
}

export default Dashboard
