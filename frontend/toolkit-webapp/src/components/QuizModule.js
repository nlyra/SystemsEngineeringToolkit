import React, { useState } from 'react'
import PropTypes from 'prop-types';
import { IconButton, Toolbar, Button, Dialog, DialogActions, DialogContent, TextField, Table, TableBody, TableCell, TableContainer, TableHead,TablePagination, TableRow, TableSortLabel, Checkbox, Typography} from '@material-ui/core'
import useStyles from '../styles/moduleStyle'
import {Delete} from '@material-ui/icons'


const quiz = {
    questions : [],
    answers: [],
    fakes1: [],
    fakes2: [],
    fakes3: []
}

const QuizModule = (props) => {

    //const [quizTitle, setQuizTitle] = useState('')
    //const [type, setType] = useState('')
    const [open, setOpen] = React.useState(false)
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [fake1, setFake1] = useState('')
    const [fake2, setFake2] = useState('')
    const [fake3, setFake3] = useState('')
    const [selected, setSelected] = React.useState([]);

    const classes = useStyles()

    const isSelected = (question) => selected.indexOf(question) !== -1

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
          const newSelecteds = quiz.questions.map((n) => n.question);
          setSelected(newSelecteds);
          return;
        }
        setSelected([]);
    }

    function addQuestion() {

        if(question === '' || answer === ''){
            alert("Requires a question and an answer.")
        }else{
            quiz.questions.push(question)
            quiz.answers.push(answer)
            quiz.fakes1.push(fake1)
            quiz.fakes2.push(fake2)
            quiz.fakes3.push(fake3)

            setQuestion('')
            setAnswer('')
            setFake1('')
            setFake2('')
            setFake3('')
        }
    }

    const handleClick = (event, question) => {
        const selectedIndex = selected.indexOf(question);
        let newSelected = [];
    
        if (selectedIndex === -1) {
          newSelected = newSelected.concat(selected, question);
        } else if (selectedIndex === 0) {
          newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
          newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
          );
        }
    
        setSelected(newSelected)
    }

    const handleDelete = () => {
        for(var i = 0; i < quiz.questions.length; i++){
            if(isSelected(quiz.questions[i])){
                selected.splice(selected.indexOf(quiz.questions[i]), 1);

                quiz.questions.splice(i, 1);
                quiz.answers.splice(i, 1);
                quiz.fakes1.splice(i, 1);
                quiz.fakes2.splice(i, 1);
                quiz.fakes3.splice(i, 1);
            }
        }
    }

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const headCells = [
        { id: 'question', numeric: false, disablePadding: false, label: 'Question' },
        { id: 'answer', numeric: false, disablePadding: false, label: 'Answer' },
        { id: 'fake1', numeric: false, disablePadding: false, label: 'Fake Answer 1' },
        { id: 'fake2', numeric: false, disablePadding: false, label: 'Fake Answer 2' },
        { id: 'fake3', numeric: false, disablePadding: false, label: 'Fake Answer 3' },
    ]


    

    //const handleChange = (event) => {
    //    setType(event.target.type);
        // handleDisplayedContent(type)
    //}

  return (
    <div>
        {/*
        <TextField color='primary'
            size='small'
            variant="filled"
            label='Quiz Title'
            type="quizTitle"
            defaultValue = "Quiz Title"
            value={quizTitle}
            onChange={e => setQuizTitle(e.target.value)}
            margin="normal"
            required={true}
            fullWidth
        />

        }
        <FormControl required className={classes.formControl} fullWidth={true}>
            <InputLabel htmlFor="category-native-required">Question Type</InputLabel>
            <Select
                native
                value={type}
                onChange={handleChange}
                name="Question Type"
                inputProps={{
                    id: 'category-native-required',
                }}
                onChange={e => setType(e.target.value)}
            >
                <option aria-label="None" value="" />
                <option value={"Multiple Choice"}>Multiple Choice</option>
                <option value={"Free Response"}>Free Response</option>
            </Select>
            <FormHelperText>Required</FormHelperText>
        </FormControl>
        */}

        {//type === 'Multiple Choice' &&
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

                <Button variant="contained" color="grey" size="small" 
                    onClick={addQuestion}
                >
                        
                    Add Question
                </Button>

                <Button variant="contained" color="grey" size="small"
                    onClick={handleClickOpen}
                >
                    View Questions
                </Button>

                <Dialog
                    open={open}
                    onClose={handleClose}
                >
                    <Toolbar>
                        {selected.length > 0 ? (
                            <Typography className={classes.title} color='inherit' variant='subtitle1' component='div'>
                                {selected.length} selected
                            </Typography>
                        ) : (
                            <Typography className={classes.title} variant='h6' id="tableTitle" component="div">
                                Quiz Questions
                            </Typography>
                        )}

                            
                        <IconButton aria-label='delete' onClick={handleDelete}>
                            <Delete />
                        </IconButton>
                        
                    </Toolbar>
                    <DialogContent>
                    <TableContainer>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={selected.length > 0 && selected.length < quiz.questions.length}
                                        checked={quiz.questions.length > 0 && selected.length === quiz.questions.length}
                                        onChange={handleSelectAllClick}
                                        inputProps={{ 'aria-label': 'select all questions' }}
                                    />
                                </TableCell>
                                {headCells.map((headCell) => (
                                    <TableCell
                                        key={headCell.id}
                                        align={headCell.numeric ? 'right' : 'left'}
                                        padding={headCell.disablePadding ? 'none' : 'default'}
                                    >
                                        {headCell.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {quiz.questions.map((next, index) => {
                                const isItemSelected = isSelected(next);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, next)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={next.question}
                                        selected={isItemSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={isItemSelected}
                                                inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                        </TableCell>
                                        <TableCell component="th" id={labelId} scope="row" padding="none">
                                            {next}
                                        </TableCell>
                                        <TableCell align="right">{quiz.answers[index]}</TableCell>
                                        <TableCell align="right">{quiz.fakes1[index]}</TableCell>
                                        <TableCell align="right">{quiz.fakes2[index]}</TableCell>
                                        <TableCell align="right">{quiz.fakes3[index]}</TableCell>
                                    </TableRow>
                                );
                            })}
                            
                        </TableBody>

                    </TableContainer>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="grey" size="small" onClick={handleClose}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        }
        
        {/*type === 'Free Response' &&
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
                <Button type='submit' className={classes.button1} size="small" variant="contained" 
                    onClick={quiz.questions.push({ 
                        question: question,
                        correct: answer
                })}>
                    Add Question
                </Button>
            </div>
            */}

    </div>
  )
}

export default QuizModule

