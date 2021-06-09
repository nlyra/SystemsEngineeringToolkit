import React, { useState } from 'react'
import { TextField } from '@material-ui/core'

const MultipleChoice = () => {
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [fake1, setFake1] = useState('')
    const [fake2, setFake2] = useState('')
    const [fake3, setFake3] = useState('')
    const [edit, setEdit] = useState('')

    if(edit === ''){
        if(sessionStorage.getItem('question')){
            setQuestion(sessionStorage.getItem('question'))
        }
        if(sessionStorage.getItem('answer')){
            setAnswer(sessionStorage.getItem('answer'))
        }
        if(sessionStorage.getItem('fake1')){
            setFake1(sessionStorage.getItem('fake1'))
        }
        if(sessionStorage.getItem('fake2')){
         setFake2(sessionStorage.getItem('fake2'))
        }
        if(sessionStorage.getItem('fake3')){
            setFake3(sessionStorage.getItem('fake3'))
        }
        setEdit("no")
    }

    sessionStorage.setItem('question', question)
    sessionStorage.setItem('answer', answer)
    sessionStorage.setItem('fake1', fake1)
    sessionStorage.setItem('fake2', fake2)
    sessionStorage.setItem('fake3', fake3)
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