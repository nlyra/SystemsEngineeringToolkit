import { Paper, TextField, Button, Grid, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import quizStyles from '../styles/quizModuleStyle'
import config from '../config.json'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const QuizModule = (props) => {
  const classes = quizStyles()

  const [state, setState] = useState(0);  // 0 == start button, 1 == quiz, 2 == score and again
  const [questions, setQuestions] = useState(props.quiz);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState({});
  const [value, setValue] = React.useState({});

  const handleSubmit = () => {
    let temp = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === 1) {
        temp += 1
      }
    }
    setScore(temp);
    saveScore(temp);
    setState(2)
  }


  const handleAgain = () => {
    setScore(0)
    setAnswers({})
    setValue({})
    setState(1)
  }

  const saveScore = async (temp) => {
    const token = localStorage.getItem("token");
    const res = await fetch(config.server_url + config.paths.sendScore, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        "token": token,
        "courseID": props.courseID,
        "moduleID": props.moduleIndex,
        "score": temp
      })
    })

    const data = await res.json()
    if (data.message === undefined) {
      //maybe do something in the future
    } else if (data.message === "wrong token") {
      localStorage.removeItem('token');
      props.history.push('login');
      // probably alert the user
    } else { // this is to check if there are errors not being addressed already
      console.log(data)
    }
  }

  const handleChange = (e, index) => {

    let temp = value;
    temp[index] = e.target.value
    setValue(temp);

    let temp2 = answers;
    for (let i = 0; i < questions[index].answers.length; i++) {
      if (questions[index].answers[i].isCorrect) {
        if (questions[index].answers[i].answerText === e.target.value) {
          temp2[index] = 1
        } else {
          temp2[index] = 0
        }
        setAnswers(temp2)
      }
    }
  };

  return (
    <div className={classes.outerDiv}>
      {state === 0 &&
        <div className={classes.buttonDiv}>
          <Button variant="contained" onClick={() => setState(1)}>Start!</Button>
        </div>
      }
      {state === 1 &&
        <div className={classes.quizDiv}>
          <FormControl component="fieldset">
            {questions.map((question) => (
              <div key={questions.indexOf(question)} className={classes.questionDiv}>
                <FormLabel component="legend">{question.question}</FormLabel>
                <RadioGroup aria-label="gender" name="gender1" value={value[questions.indexOf(question)]} onChange={(e) => handleChange(e, questions.indexOf(question))}>
                  {question.type === "Multiple Choice" &&
                    <>
                      {question.answers.map((answer) => (
                        <FormControlLabel value={answer.answerText} control={<Radio />} label={answer.answerText} />
                      ))}
                    </>
                  }
                  {question.type === "True or False" &&
                    <>
                      <FormControlLabel value={question.answers[0].answerText} control={<Radio />} label={question.answers[0].answerText} />
                      <FormControlLabel value={question.answers[0].answerText === "True" ? "False" : "True"} control={<Radio />} label={question.answers[0].answerText === "True" ? "False" : "True"} />
                    </>
                  }

                </RadioGroup>
              </div>
            ))}
          </FormControl>
          <div className={classes.submitDiv}>
            <Button variant="contained" onClick={() => window.confirm('Are you sure you wish to submit?') && handleSubmit()}>Submit</Button>
          </div>
        </div>
      }
      {state === 2 &&
        <div className={classes.afterSubmitDiv}>
          <div >
            <Typography>Your score is: {score}/{questions.length}</Typography>
            <br />
            <Button variant="contained" onClick={() => window.confirm('Are you sure you wish to try again?') && handleAgain()}>Try again?</Button>
            <Button variant="contained" onClick={() => window.confirm('Are you sure you wish to try again?') && handleAgain()}>Show answers</Button>
          </div>
        </div>
      }

    </div>
  );
}

export default QuizModule
