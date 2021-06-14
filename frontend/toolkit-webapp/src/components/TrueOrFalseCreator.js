import React, { useState } from 'react'
import { TextField, FormControl, InputLabel, Select} from '@material-ui/core'
import useStyles from '../styles/moduleStyle'

const TorF = () => {
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [edit, setEdit] = useState('')

    const classes = useStyles()

    const handleChange = (event) => {
        setAnswer(event.target.type);
    }

    if(edit === ''){
        if(sessionStorage.getItem('question')){
            setQuestion(sessionStorage.getItem('question'))
        }
        if(sessionStorage.getItem('answer') === 'True' || sessionStorage.getItem('answer') === 'False'){
            setAnswer(sessionStorage.getItem('answer'))
        }
        setEdit("no")
    }

    sessionStorage.setItem('question', question)
    sessionStorage.setItem('answer', answer)
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

            <FormControl required className={classes.formControl} fullWidth={true}>
                <InputLabel htmlFor="category-native-required">Answer</InputLabel>
                <Select
                    native
                    value={answer}
                    onChange={handleChange}
                    name="Answer"
                    inputProps={{
                        id: 'category-native-required',
                    }}
                    onChange={e => setAnswer(e.target.value)}
                >
                    <option aria-label="None" value="" />
                    <option value={"True"}>True</option>
                    <option value={"False"}>False</option>
                </Select>
            </FormControl>
            
        </div>
    )
}


export default TorF