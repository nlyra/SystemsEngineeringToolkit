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

export default dashStyles;