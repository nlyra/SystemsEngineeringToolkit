import {makeStyles} from '@material-ui/core/styles'

const loginStyles = makeStyles((theme) => ({

    Title:
    {
        fontWeight: "bold",
        textAlign: "center"
    },

    container: {
        height: "100vh",
        width: "100vw",
        backgroundColor: "rgba(0,0,0,0.9)",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    paper: 
    {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '5px 40px 5px 40px',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        justifyContent: 'center',
        borderRadius: 15
    },
    block:
    {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '22%',
        minWidth: '250px',
    },
    button:
    {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        backgroundColor: 'black',
        color: 'white',
        "&:hover": {
            color: 'black'
        }
    },

    resetPassButton:
    {
        marginTop: theme.spacing(2),
        textAlign: "center",
        backgroundColor: 'black',
        color: 'white',
        "&:hover": {
            color: 'black'
        }
    },

    button2:
    {
        fontSize: 10,
        backgroundColor: 'light-grey',
        marginBottom: theme.spacing(2),
        marginLeft:  theme.spacing(2)
    },

    button3:
    {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        marginRight: theme.spacing(35)
    },

    button4:
    {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        marginLeft: theme.spacing(10)
    },
    video: 
    {
        objectFit: 'cover',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -2
    },

    darkOverlay:
    {
        backgroundColor: 'rgba(0, 0, 0, 0.596)',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
    },
    avatar: 
    {
        margin: theme.spacing(2),
        backgroundColor: 'black'
    },

}))

export default loginStyles;