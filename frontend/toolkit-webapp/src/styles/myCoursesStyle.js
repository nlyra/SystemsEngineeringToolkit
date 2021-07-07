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
        marginTop: theme.spacing(15)
    },

    card:
    {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
        // marginBottom: '0px'
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
    
    removeButton:
    {
        width: "100%",
        marginTop: '10px'
    },

    // buttonDiv:
    // {
    //     // paddingLeft: "30%"
    // }
}))

export default myCoursesStyle;