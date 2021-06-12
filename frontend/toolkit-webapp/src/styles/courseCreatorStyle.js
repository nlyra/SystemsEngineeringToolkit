import { makeStyles } from '@material-ui/core/styles'

const courseStyles = makeStyles((theme) => ({

    Title:
    {
        fontWeight: "bold"
    },

    container: {
        height: "100%",
    },

    paper:
    {
        padding: '5px 40px 5px 40px',
        borderRadius: 15,
        marginTop: theme.spacing(15),
    },

    block:
    {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
        marginLeft: theme.spacing(2)
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

    darkOverlay:
    {
        // backgroundColor: 'rgba(0, 0, 0, 0.596)',
        position: 'absolute',
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1
    },

    categoryContainer: 
    {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0,
        maxWidth: '550px',
        minHeight: "40px"
    },

}))

export default courseStyles;