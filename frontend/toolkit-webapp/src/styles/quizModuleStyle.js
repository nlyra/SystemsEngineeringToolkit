import { makeStyles } from '@material-ui/core/styles'

const dashStyles = makeStyles((theme) => ({
  app: {
    backgroundColor: '#eceff1',
    width: '450px',
    minHeight: '200px',
    height: 'min-content',
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '10px 10px 42px 0px rgba(0, 0, 0, 0.75)',
    justifyContent: 'space-evenly',
    marginBottom: '15px'
  },

  app2: {
    display: 'flex',
    marginBottom: '15px',
    // height: '80%',
  },

  scoreSection: {
    display: 'flex',
    fontSize: '24px',
    alignItems: 'center',
    // top: '80%',
    paddingTop: '15%',
    paddingLeft: '20%',
    paddingBottom: '10%',
  },

  questionSection: {
    width: '100%',
    position: 'relative',
  },

  questionCount: {
    marginBottom: '20px',
  },

  questionCountSpan: {
    fontSize: '28px',
  },

  questionText: {
    marginBottom: '12px',
  },

  answerSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  button: {
    width: '100%',
    fontSize: '16px',
    color: '#eceff1',
    backgroundColor: '#90a4ae',
    "&:focus": {
      backgroundColor: "#69f0ae",
      border: '5px solid #69f0ae',
    },
    borderRadius: '15px',
    border: '5px solid #90a4ae',
    display: 'flex',
    padding: '5px',
    justifyContent: 'flex-start',
    alignItems: 'center',
    cursor: 'pointer',
    marginBottom: '4%',
  },

  buttonBack: {
    width: '100%',
    fontSize: '16px',
    color: '#90a4ae',
    fontWeight: 'bold',
    backgroundColor: '#eceff1',
    borderRadius: '15px',
    padding: '5px',
    alignItems: 'center',
    border: '5px solid #90a4ae',
    cursor: 'pointer',
    margin: '1%'
  },

  buttons: {
    display: 'flex',
  }
}))

export default dashStyles;