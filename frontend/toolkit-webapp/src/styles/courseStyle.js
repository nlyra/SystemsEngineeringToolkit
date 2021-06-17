import { makeStyles } from '@material-ui/core/styles'

const dashStyles = makeStyles((theme) => ({
  div: {
    display: 'flex',
    position: 'relative'
  },

  title: {
    fontSize: '50px',
    textAlign: "center",
    justify: "center",
  },

  topItem: {
    paddingTop: '4.9vh',
    paddingBottom: '5%',
  },

  currCourseImageStyle: {
    paddingTop: '3vh',
    maxWidth: '35vh',
    maxHeight: '35vh',
    // marginBottom: "5px"
  },

  description: {
    fontSize: '25px',
    textAlign: "right",
    paddingRight: '2%',
    float: 'right',
    maxWidth: "90%",

  },

  divider: {
    margin: theme.spacing(3, 3),
  },

  accordion: {
    padding: '3%',
  },

  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },

  heading2: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    align: 'right',
    // position: 'right'
  },

  accordionDetails: {
    paddingLeft: '5%',
    paddingRight: '5%'
  },
}))

export default dashStyles;