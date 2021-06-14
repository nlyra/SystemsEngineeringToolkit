import React, { useState } from 'react'
import { IconButton, Toolbar, Button, Dialog, DialogActions, DialogContent, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Typography, FormControl, Select, InputLabel, FormHelperText} from '@material-ui/core'
import useStyles from '../styles/moduleStyle'
import { Delete, Edit, ArrowUpward, ArrowDownward } from '@material-ui/icons'
import MultipleChoice from './MultipleChoiceCreator'
import TorF from './TrueOrFalseCreator'


const quiz = {
    questions : [],
    types : [],
    answers: [],
    fakes1: [],
    fakes2: [],
    fakes3: []
}

const QuizModule = () => {
    const [type, setType] = useState('')
    const [open, setOpen] = React.useState(false)
    const [editOpen, setEdit] = React.useState(false)
    const [selected, setSelected] = React.useState([]);

    sessionStorage.setItem('editing', '')

    if(sessionStorage.getItem('questions')!== null){
        quiz.questions=JSON.parse(sessionStorage.getItem('questions'));
        if(sessionStorage.getItem('types')!== null){
            quiz.types=JSON.parse(sessionStorage.getItem('types'));
        }
        if(sessionStorage.getItem('answers')!== null){
            quiz.answers=JSON.parse(sessionStorage.getItem('answers'));
        }
        if(sessionStorage.getItem('fakes1')!== null){
            quiz.fakes1=JSON.parse(sessionStorage.getItem('fakes1'));
        }
        if(sessionStorage.getItem('fakes2')!== null){
            quiz.fakes2=JSON.parse(sessionStorage.getItem('fakes2'));
        }
        if(sessionStorage.getItem('fakes3')!== null){
            quiz.fakes3=JSON.parse(sessionStorage.getItem('fakes3'));
        }
    }
    
    const classes = useStyles()

    const isSelected = (question) => selected.indexOf(question) !== -1

    function addQuestion() {
        if(sessionStorage.getItem('question') === '' || sessionStorage.getItem('answer') === ''){
            alert("Requires a question and an answer.")
        }else if(quiz.questions.indexOf(sessionStorage.getItem('question')) !== -1){
            alert("No Duplicate questions")
        }else{
            quiz.questions.push(sessionStorage.getItem('question'))
            quiz.types.push(type)
            quiz.answers.push(sessionStorage.getItem('answer'))
            quiz.fakes1.push(sessionStorage.getItem('fake1'))
            quiz.fakes2.push(sessionStorage.getItem('fake2'))
            quiz.fakes3.push(sessionStorage.getItem('fake3'))

            sessionStorage.setItem('questions', JSON.stringify(quiz.questions))
            sessionStorage.setItem('types', JSON.stringify(quiz.types))
            sessionStorage.setItem('answers', JSON.stringify(quiz.answers))
            sessionStorage.setItem('fakes1', JSON.stringify(quiz.fakes1))
            sessionStorage.setItem('fakes2', JSON.stringify(quiz.fakes2))
            sessionStorage.setItem('fakes3', JSON.stringify(quiz.fakes3))
            
            setType('')
            sessionStorage.removeItem('question')
            sessionStorage.removeItem('answer')
            sessionStorage.removeItem('fake1')
            sessionStorage.removeItem('fake2')
            sessionStorage.removeItem('fake3')
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
                quiz.types.splice(i, 1);
                quiz.answers.splice(i, 1)
                quiz.fakes1.splice(i, 1);
                quiz.fakes2.splice(i, 1);
                quiz.fakes3.splice(i, 1);

                sessionStorage.setItem('questions', JSON.stringify(quiz.questions))
                sessionStorage.setItem('types', JSON.stringify(quiz.types))
                sessionStorage.setItem('answers', JSON.stringify(quiz.answers))
                sessionStorage.setItem('fakes1', JSON.stringify(quiz.fakes1))
                sessionStorage.setItem('fakes2', JSON.stringify(quiz.fakes2))
                sessionStorage.setItem('fakes3', JSON.stringify(quiz.fakes3))
                i=i-1
            }
        }
    }

    const handleEdit = () => {
        sessionStorage.setItem('editing', 'yes')
        if(selected.length > 1){
            alert("Select only one question.")
        }else if(selected.length < 1){
            alert("Please select a question.")
        }else{
            for(var i = 0; i < quiz.questions.length; i++){
                if(isSelected(quiz.questions[i])){
                    sessionStorage.setItem('question', quiz.questions[i])
                    setType(quiz.types[i])
                    sessionStorage.setItem('answer', quiz.answers[i])
                    sessionStorage.setItem('fake1', quiz.fakes1[i])
                    sessionStorage.setItem('fake2', quiz.fakes2[i])
                    sessionStorage.setItem('fake3', quiz.fakes3[i])
                    sessionStorage.setItem('index', i)

                    i=quiz.questions.length
                    setEdit(true)
                }
            }
        }
    }

    const submitEdit = () => {
        if(quiz.questions.indexOf(sessionStorage.getItem('question')) !== -1 && quiz.questions.indexOf(sessionStorage.getItem('question')) !== parseInt(sessionStorage.getItem('index'))){
            alert('No Duplicate Questions')
        }else{
            for(var i = 0; i < quiz.questions.length; i++){
                if(isSelected(quiz.questions[i])){
                    quiz.questions.splice(i, 1, sessionStorage.getItem('question'));
                    quiz.types.splice(i, 1, type);
                    quiz.answers.splice(i, 1, sessionStorage.getItem('answer'));
                    quiz.fakes1.splice(i, 1, sessionStorage.getItem('fake1'));
                    quiz.fakes2.splice(i, 1, sessionStorage.getItem('fake2'));
                    quiz.fakes3.splice(i, 1, sessionStorage.getItem('fake3'));

                    i=quiz.questions.length

                    sessionStorage.setItem('questions', JSON.stringify(quiz.questions))
                    sessionStorage.setItem('types', JSON.stringify(quiz.types))
                    sessionStorage.setItem('answers', JSON.stringify(quiz.answers))
                    sessionStorage.setItem('fakes1', JSON.stringify(quiz.fakes1))
                    sessionStorage.setItem('fakes2', JSON.stringify(quiz.fakes2))
                    sessionStorage.setItem('fakes3', JSON.stringify(quiz.fakes3))
                    

                    sessionStorage.removeItem('question')
                    setType('')
                    sessionStorage.removeItem('answer')
                    sessionStorage.removeItem('fake1')
                    sessionStorage.removeItem('fake2')
                    sessionStorage.removeItem('fake3')

                    setSelected([])
                    setEdit(false)
                }
            }
        }
    }

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleEditClose = () => {
        sessionStorage.removeItem('question')
        setType('')
        sessionStorage.removeItem('answer')
        sessionStorage.removeItem('fake1')
        sessionStorage.removeItem('fake2')
        sessionStorage.removeItem('fake3')

        setEdit(false)
    }

    const headCells = [
        { id: 'question', numeric: false, disablePadding: false, label: 'Question' },
        //{ id: 'type', numeric: false, disablePadding: false, label: 'Type'},
        { id: 'answer', numeric: false, disablePadding: false, label: 'Answer' },
        { id: 'fake1', numeric: false, disablePadding: false, label: 'Incorrect' },
        { id: 'fake2', numeric: false, disablePadding: false, label: 'Incorrect' },
        { id: 'fake3', numeric: false, disablePadding: false, label: 'Incorrect' },
    ]


    

    const handleChange = (event) => {
        setType(event.target.type);
    }

  return (
    <div>
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
                <option value={"True or False"}>True or False</option>
                <option value={"Submit"}>Submit</option>
            </Select>
            <FormHelperText>Required</FormHelperText>
        </FormControl>
        

        {type === 'Multiple Choice' &&
            <MultipleChoice></MultipleChoice>    
        }
        
        {type === 'True or False'  &&
            <TorF></TorF>
        }

            <Button variant="contained" color="default" size="small" 
                onClick={addQuestion}
            >
                        
                Add Question
            </Button>

            <Button variant="contained" color="default" size="small"
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
                    <IconButton aria-label='delete' onClick={handleEdit}>
                        <Edit />
                    </IconButton>
                    <IconButton aria-label='delete' onClick={handleDelete}>
                        <ArrowUpward />
                    </IconButton>
                    <IconButton aria-label='delete' onClick={handleDelete}>
                        <ArrowDownward />
                    </IconButton>
                        
                </Toolbar>
                <DialogContent>
                <TableContainer>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
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
                    <Button variant="contained" color="default" size="small" onClick={handleClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={editOpen}
                onClose={handleEditClose}
            >
                <DialogContent>
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
                        <option value={"True or False"}>True or False</option>
                    </Select>
                    <FormHelperText>Required</FormHelperText>
                </FormControl>

                {type === 'Multiple Choice' &&
                    <MultipleChoice></MultipleChoice>
                }
                {type === 'True or False' &&
                    <TorF></TorF>
                }
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="default" size="small" onClick={handleEditClose}>
                    Close
                </Button>
                <Button variant="contained" color="default" size="small" onClick={submitEdit}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    </div>
  )
}

export default QuizModule

