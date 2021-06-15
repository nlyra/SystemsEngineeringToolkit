import { makeStyles } from '@material-ui/core/styles'

const myCoursesStyle = makeStyles((theme) => ({

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
        width: "100%"
    },

    // buttonDiv:
    // {
    //     // paddingLeft: "30%"
    // }
}))

export default myCoursesStyle;