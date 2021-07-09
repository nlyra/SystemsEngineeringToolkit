import { makeStyles } from '@material-ui/core/styles'

const dashStyles = makeStyles((theme) => ({

    div: {
        display: 'flex',
        overflowY: 'hidden'
    },
    
    container:
    {
        // backgroundColor: 'grey',
        marginTop: theme.spacing(15),
        marginBottom: theme.spacing(8),

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

    scrollListener:
    {
        offset: 200,
        debounce: 1000,
        triggerOnNoScroll: false
    }
}))

export default dashStyles;