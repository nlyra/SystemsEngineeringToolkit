import {makeStyles} from '@material-ui/core/styles'

const moduleStyles = makeStyles((theme) => ({

    Title:
    {
        fontWeight: "bold",
        alignItems: 'center'
    },
    h5: 
    {
        align: 'center'
    },

    container: {
        height: "100%",
        paddingTop: '5%',
        marginLeft: '10%'
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

    buttonGroup:
    {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        fontSize: 10,
        paddingTop: theme.spacing(1)
    },

    button1:
    {
        marginRight: 25
    },

    button2:
    {
    },


}))

export default moduleStyles;