import { Grid } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import dashStyles from '../styles/quizModuleStyle'
import config from '../config.json'


const QuizModule = (props) => {
  const classes = dashStyles()

  const [questions, setQuestions] = useState(props.quiz)
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleAnswerOptionClick = (isCorrect) => {
    let temp = answers
    if (isCorrect) {
      temp[currentQuestion.toString()] = 1
    } else {
      temp[currentQuestion.toString()] = 0
    }
    setAnswers(temp)

    // const nextQuestion = currentQuestion + 1;
    // if (nextQuestion < questions.length) {
    //   setCurrentQuestion(nextQuestion);
    // }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0)
      setCurrentQuestion(currentQuestion - 1)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1)
      setCurrentQuestion(currentQuestion + 1)

    // console.log(currentQuestion)
  }

  const handleSubmit = () => {
    let temp = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === 1) {
        temp += 1
      }
    }
    setScore(temp);

    setShowScore(true);

    saveScore(temp);
  }


  const handleAgain = () => {
    setCurrentQuestion(0)
    setScore(0)
    setAnswers({})
    setShowScore(false)
  }

  const saveScore = async (temp) => {
    const token = localStorage.getItem("token");
    // console.log(props.courseID)
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
      console.log('works')
    } else if (data.message === "wrong token") {
      localStorage.removeItem('token');
      props.history.push('login');
      // probably alert the user
    } else { // this is to check if there are errors not being addressed already
      console.log(data)
    }
  }

  return (
    <div className={classes.app}>
      {/* <div className={classes.app2}> */}
      {showScore ? (
        <>
          <div className={classes.scoreSection}>
            You scored {score} out of {questions.length}
          </div>
          <button className={classes.buttonBack} onClick={() => handleAgain()}>Again?</button>
        </>
      ) : (
        <>
          <div className={classes.app2}>
            <div className={classes.questionSection}>
              <div className={classes.questionCount}>

                <span className={classes.questionCountSpan}>Question {currentQuestion + 1}</span>/{questions.length}
              </div>
              <div className={classes.questionText}>{questions[currentQuestion].question}</div>
            </div>
            {questions[currentQuestion].type === "Multiple Choice" &&
              <div className={classes.answerSection}>
                {questions[currentQuestion].answers.map((answers) => (
                  <button className={classes.button} onClick={() => handleAnswerOptionClick(answers.isCorrect)}>{answers.answerText}</button>
                ))}
              </div>
            }
            {questions[currentQuestion].type === "True or False" &&
              <div className={classes.answerSection}>
                <button className={classes.button} onClick={() => handleAnswerOptionClick(questions[currentQuestion].answers[0].isCorrect)}>{questions[currentQuestion].answers[0].answerText}</button>
                <button className={classes.button} onClick={() => handleAnswerOptionClick(!questions[currentQuestion].answers[0].isCorrect)}>{questions[currentQuestion].answers[0].answerText === "True" ? "False" : "True"}</button>
              </div>
            }
          </div>
          <div className={classes.buttons}>
            <button className={classes.buttonBack} onClick={() => handlePrevious()}>Previous</button>
            <button className={classes.buttonBack} onClick={() => handleNext()}>Next</button>
            <button className={classes.buttonBack} onClick={() => handleSubmit()}>Submit</button>
          </div>
        </>
      )}
      {/* </div> */}

    </div>
  );
}

export default QuizModule
