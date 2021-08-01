import { makeStyles } from '@material-ui/core/styles'

const dialogStyles = makeStyles((theme) => ({

    dialogComponent:
    {
        width: '60%',
        border: '5px solid gold',
        borderRadius: '5px'
    },

    dialogPaper:
    {
        border: '1.8px solid black',
        borderRadius: '8px',
        width: '380px',
        boxShadow: 'none'
    },

    dialogContent:
    {

        width: '100%',
        textAlign: 'center',
    },

    dialogButtons:
    {
        margin: 'auto',
    },

    dialogButton1:
    {
        backgroundColor: 'black',
        color: 'white',
        "&:hover": {
            backgroundColor: 'grey',
            color: 'white'
        },
        marginRight: '10px'
    },

    dialogButton2:
    {
        backgroundColor: 'black',
        color: 'white',
        "&:hover": {
            backgroundColor: 'grey',
            color: 'white'
        },
        marginLeft: '10px'
    }

}))

export default dialogStyles;