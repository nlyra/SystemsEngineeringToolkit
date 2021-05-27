import {makeStyles} from '@material-ui/core/styles'

const registerStyles = makeStyles((theme) => ({

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
        marginTop: theme.spacing(25),
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
        // marginLeft: theme.spacing(2)
        // marginRight: theme.spacing(3) 
    }

}))

export default registerStyles;