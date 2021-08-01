import { makeStyles } from '@material-ui/core/styles'

const dashStyles = makeStyles((theme) => ({
  outerDiv: {
    width: '70vw',
    paddingBottom: '2vh'
  },

  buttonDiv: {
    width: '100%',
    display: 'flex',
    justifyContent: "center",
  },

  quizDiv: {
    width: '100%',
    paddingLeft: '5vw'
  },

  questionDiv: {
    paddingBottom: '3vh'
  },

  submitDiv: {
    width: '100%',
    display: 'flex',
    justifyContent: "flex-end",
  },

  afterSubmitDiv: {
    width: '100%',
    display: 'flex',
    justifyContent: "center",
  },

  answersDiv: {
    backgroundColor: 'grey',
  }

}))

export default dashStyles;