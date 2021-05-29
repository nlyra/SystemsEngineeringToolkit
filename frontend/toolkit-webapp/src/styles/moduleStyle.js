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
        
        // Added these two fields 
        paddingTop: '5%',
        marginLeft: '10%'

        // paddingRight: '10%'
        // whiteSpace: 'nowrap'
    },

    paper:
    {
        padding: '5px 40px 5px 40px',
        borderRadius: 15,
        marginTop: theme.spacing(10),
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
        // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        fontSize: 10,
        paddingTop: theme.spacing(1)
    },

    button1:
    {
        marginRight: 25
        // fontSize: 10,
        // background: 'linear-gradient(45deg, #90a4ae 10%, #e0e0e0 90%)',
        // marginBottom: theme.spacing(2),
        // marginLeft:  theme.spacing(2),
        // paddingTop: theme.spacing(5)
    },

    button2:
    {
        // marginTop: theme.spacing(2),
        // marginBottom: theme.spacing(2),
        // marginRight: theme.spacing(35)
    },


}))

export default moduleStyles;