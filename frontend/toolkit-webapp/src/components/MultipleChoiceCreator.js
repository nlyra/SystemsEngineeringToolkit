import React, { useState } from 'react'
import { TextField } from '@material-ui/core'

const MultipleChoice = () => {
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [fake1, setFake1] = useState('')
    const [fake2, setFake2] = useState('')
    const [fake3, setFake3] = useState('')
    const [edit, setEdit] = useState('')

    var questions={
        question: String,
        type: String,
        answers: [
            {answerText: String, isCorrect: true},
            {answerText: String, isCorrect: false},
            {answerText: String, isCorrect: false},
            {answerText: String, isCorrect: false},
        ]
    }

    if(edit === ''){
        if(sessionStorage.getItem('question')){
            questions=JSON.parse(sessionStorage.getItem('question'))
            setQuestion(questions.question)
            setAnswer(questions.answers[0].answerText)
            setFake1(questions.answers[1].answerText)
            setFake2(questions.answers[2].answerText)
            setFake3(questions.answers[3].answerText)
        }
        setEdit("no")
    }

    questions.question=question
    questions.type='Multiple Choice'
    questions.answers[0]={answerText: answer, isCorrect: true}
    questions.answers[1]={answerText: fake1, isCorrect: false}
    questions.answers[2]={answerText: fake2, isCorrect: false}
    questions.answers[3]={answerText: fake3, isCorrect: false}

    sessionStorage.setItem('question', JSON.stringify(questions))


    return(
        <div>
            <TextField
                size='small'
                variant="filled"
                multiline
                rows={1}
                rowsMax={15}
                label='Question'
                type="question"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                margin="normal"
                required={true}
                fullWidth
            />

            <TextField
                size='small'
                variant="filled"
                multiline
                rows={1}
                rowsMax={15}
                label='Answer'
                type="answer"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                margin="normal"
                required={true}
                fullWidth
            />

            <TextField
                size='small'
                variant="filled"
                multiline
                rows={1}
                rowsMax={15}
                label='Fake Answer 1'
                type="fake1"
                value={fake1}
                onChange={e => setFake1(e.target.value)}
                margin="normal"
                required={true}
                fullWidth
            />

            <TextField
                size='small'
                variant="filled"
                multiline
                rows={1}
                rowsMax={15}
                label='Fake Answer 2'
                type="fake2"
                value={fake2}
                onChange={e => setFake2(e.target.value)}
                margin="normal"
                required={true}
                fullWidth
            />

            <TextField
                size='small'
                variant="filled"
                multiline
                rows={1}
                rowsMax={15}
                label='Fake Answer 3'
                type="fake3"
                value={fake3}
                onChange={e => setFake3(e.target.value)}
                margin="normal"
                required={true}
                fullWidth
            />
        </div>
    )
}


export default MultipleChoice