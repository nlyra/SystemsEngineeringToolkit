import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({

    Title:
    {
        fontWeight: "bold"
    },
    container: {
        height: "100vh",
        width: "100vw",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    paper:
    {
        padding: '5px 40px 5px 40px',
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.7)'
    },
    block:
    {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '22%',
        minWidth: '250px'
    },
    button:
    {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
    },

    button2:
    {
        fontSize: 10,
        background: 'linear-gradient(45deg, #90a4ae 10%, #e0e0e0 90%)',
        marginBottom: theme.spacing(2),
        marginLeft:  theme.spacing(2)
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
    }

}))

export default useStyles;