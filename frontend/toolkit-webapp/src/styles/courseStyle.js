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
    marginTop: '3vh',
    maxWidth: '35vh',
    maxHeight: '35vh',
    // marginRight: "10%"
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
  },

  accordionDetails: {
    paddingLeft: '5%',
    paddingRight: '5%',
  },

  deleteButton: {
    height: 0.5,
  },

  fileDiv: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },

  accordionDiv: {
    width: '100%'
  },

  completeDiv: {
    display: 'flex',
    justifyContent: 'flex-end'
  },

  statsDiv: {
    display: 'flex',
    justifyContent: 'center',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },

  skillSelector: {
    width: '130px',
    marginTop: "1.5vh",
    marginBottom: '20px'
  }

}))

export default dashStyles;