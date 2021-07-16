import { makeStyles } from '@material-ui/core/styles'

const myCoursesStyle = makeStyles((theme) => ({

    header:
    {
        fontSize: '20px',
        textAlign: "center",
        justifyContent: "center",
        paddingLeft: "33%"
    },

    divider:
    {
        margin: theme.spacing(3, 3),
        width: "100%"
    },

    div: {
        display: 'flex'
    },

    container:
    {
        marginTop: theme.spacing(10)
    },

    card:
    {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        // marginBottom: '50px'
    },

    cardGrid:
    {
        marginBottom: '5vh'
    },

    cardMedia:
    {
        // marginTop: '100px',
        paddingTop: '56.25%',
        size: '30%'
    },

    CardContent:
    {
        flexGrow: 1,
    },

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
    //   backgroundColor: 'yellow'
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
    },

    grow:
    {
        flexGrow: 1
    },
    
    removeButton:
    {
        width: "100%",
        // marginBottom: '50px'
    },

    // buttonDiv:
    // {
    //     marginBottom: '50px'
    // }

}))

export default myCoursesStyle;