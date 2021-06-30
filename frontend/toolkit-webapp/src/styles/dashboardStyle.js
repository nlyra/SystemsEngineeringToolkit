import { makeStyles } from '@material-ui/core/styles'

const dashStyles = makeStyles((theme) => ({

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
        flexDirection: 'column',
        border: '2px solid purple',
        borderRadius: '10px'
    },

    cardTitle:
    {
        textAlign: 'center'
    },
    cardMedia:
    {
        paddingTop: '56.25%',
        size: '30%'
    },

    CardContent:
    {
        flexGrow: 1,
        marginTop: '5px',
        padding: 0,
        "&:last-child": {
        paddingBottom: 0
        },
        marginTop: '3%',
        marginLeft: '5%',
        marginRight: '2%'
    },
    grow:
    {
        flexGrow: 1
    },
}))

export default dashStyles;