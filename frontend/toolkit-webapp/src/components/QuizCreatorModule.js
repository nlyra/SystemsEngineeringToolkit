import React, { useState, useEffect } from 'react'
import { TextField, IconButton, Toolbar, Button, Dialog, DialogActions, DialogContent, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Typography, FormControl, Select, InputLabel, FormHelperText } from '@material-ui/core'
import useStyles from '../styles/moduleStyle'
import { Delete, Edit, ArrowUpward, ArrowDownward } from '@material-ui/icons'
import MultipleChoice from '../components/MultipleChoiceCreator'
import TorF from '../components/TrueOrFalseCreator'
import dialogStyles from '../styles/dialogStyle'
import DialogComponent from '../components/DialogComponent'


var questions = {
    question: String,
    type: String,
    answers: [
        { answerText: String, isCorrect: true },
        { answerText: String, isCorrect: false },
        { answerText: String, isCorrect: false },
        { answerText: String, isCorrect: false },
    ]
}

var quiz = []

const QuizCreator = (props) => {
    const [type, setType] = useState('')
    const [open, setOpen] = React.useState(false)
    const [editOpen, setEdit] = React.useState(false)
    const [selected, setSelected] = React.useState([]);
    const [dialogText, setDialogText] = useState('')
    const [openDialog, setOpenDialog] = useState(false);

    const classes = useStyles()
    const dialogClasses = dialogStyles()

    sessionStorage.setItem('editing', '')

    useEffect(() => {
        if (sessionStorage.getItem('quiz')) {
            //this is causing the quiz creator to not load properly inside of the newModule creator
            quiz = JSON.parse(sessionStorage.getItem('quiz'))
        }
    }, []);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    }
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const isSelected = (question) => selected.indexOf(question) !== -1

    function addQuestion() {
        if(type === ''){
            alert("Select a question type")
        } else{
            questions = JSON.parse(sessionStorage.getItem('question'))
            var dup = 0
            for (var i = 0; i < quiz.length; i++) {
                if (questions.question === quiz[i].question) {
                    dup = 1
                    i = quiz.length
                }
            }

        if (type === '') {
            setDialogText("Select a question type")
            handleOpenDialog()
            //alert("Select a question type")
        } else if (questions.question === '' || questions.answers[0].answerText === '') {
            setDialogText("Requires a question and an answer.")
            handleOpenDialog()
            //alert("Requires a question and an answer.")
        } else if (dup === 1) {
            setDialogText("No duplicate questions allowed.")
            handleOpenDialog()
            //alert("No Duplicate questions")
        } else {
            quiz.push(questions)

                sessionStorage.setItem('quiz', JSON.stringify(quiz))

                setType('')
                sessionStorage.removeItem('question')
            }
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
        for (var i = 0; i < quiz.length; i++) {
            if (isSelected(quiz[i].question)) {
                selected.splice(selected.indexOf(quiz[i].question), 1);

                quiz.splice(i, 1);

                sessionStorage.setItem('quiz', JSON.stringify(quiz))
                i = i - 1
                setSelected([])
            }
        }
    }

    const handleUp = () => {
        if (selected.length > 1) {
            setDialogText("Please select only one question at a time.")
            handleOpenDialog()
            //alert("Select only one question.")
        } else if (selected.length < 1) {
            setDialogText("Please make a question selection.")
            handleOpenDialog()
            //alert("Please select a question.")
        } else {
            for (var i = 0; i < quiz.length; i++) {
                if (isSelected(quiz[i].question)) {
                    var questions = quiz[i]

                    quiz.splice(i, 1);

                    quiz.splice(i - 1, 0, questions);

                    sessionStorage.setItem('quiz', JSON.stringify(quiz))
                    setSelected([])
                }
            }
        }
    }

    const handleDown = () => {
        if (selected.length > 1) {
            setDialogText("Please select only one question.")
            handleOpenDialog()
            //alert("Select only one question.")
        } else if (selected.length < 1) {
            setDialogText("Please make a question selection.")
            handleOpenDialog()
            //alert("Please select a question.")
        } else {
            for (var i = 0; i < quiz.length; i++) {
                if (isSelected(quiz[i].question)) {
                    var questions = quiz[i]

                    quiz.splice(i, 1);

                    quiz.splice(i + 1, 0, questions);

                    sessionStorage.setItem('quiz', JSON.stringify(quiz))
                    i=quiz.length
                    setSelected([])
                }
            }
        }
    }

    const handleEdit = () => {
        sessionStorage.setItem('editing', 'yes')
        if (selected.length > 1) {
            setDialogText("Please select only one question.")
            handleOpenDialog()
            //alert("Select only one question.")
        } else if (selected.length < 1) {
            setDialogText("Please make a question selection.")
            handleOpenDialog()
            //alert("Please select a question.")
        } else {
            for (var i = 0; i < quiz.length; i++) {
                if (isSelected(quiz[i].question)) {
                    sessionStorage.setItem('question', JSON.stringify(quiz[i]))
                    sessionStorage.setItem('index', JSON.stringify(i))
                    setType(quiz[i].type)

                    i = quiz.length
                    setEdit(true)
                }
            }
        }
    }

    const submitEdit = () => {
        questions = JSON.parse(sessionStorage.getItem('question'))
        var dup = 0
        for (var i = 0; i < quiz.length; i++) {
            if (questions.question === quiz[i].question) {
                dup = 1
                var check = i
                i = quiz.length
            }
        }

        if (questions.question === '' || questions.answers[0].answerText === '') {
            setDialogText("Please ensure that there is both a question and an answer.")
            handleOpenDialog()
            //alert('Ensure there is a question and an Answer.')
        } else if (dup === 1 && check !== parseInt(sessionStorage.getItem('index'))) {
            setDialogText("No duplicate questions allowed.")
            handleOpenDialog()
            //alert('No Duplicate Questions')
        } else {
            for (i = 0; i < quiz.length; i++) {
                if (isSelected(quiz[i].question)) {
                    quiz.splice(i, 1, questions)

                    i = quiz.length

                    sessionStorage.setItem('quiz', JSON.stringify(quiz))

                    sessionStorage.removeItem('question')
                    setType('')
                    setSelected([])
                    setEdit(false)
                }
            }
            sessionStorage.removeItem('index')
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
        setEdit(false)
    }

    const headCells = [
        { id: 'question', numeric: false, disablePadding: false, label: 'Question' },
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
            <TextField color='primary'
                size='small'
                variant="filled"
                type="number"
                label='Grade to pass'
                defaultValue=""
                value={props.gradeToPass}
                onChange={e => props.setGradeToPass(e.target.value)}
                margin="normal"
                required={true}
                fullWidth
            />
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
                    required={false}
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
                    <IconButton aria-label='delete' onClick={handleUp}>
                        <ArrowUpward />
                    </IconButton>
                    <IconButton aria-label='delete' onClick={handleDown}>
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
                            {quiz.map((question, index) => {
                                const isItemSelected = isSelected(question.question);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, question.question)}
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
                                            {question.question}
                                        </TableCell>

                                        <TableCell align="right">{question.answers[0].answerText}</TableCell>
                                        <TableCell align="right">{question.answers[1].answerText}</TableCell>
                                        <TableCell align="right">{question.answers[2].answerText}</TableCell>
                                        <TableCell align="right">{question.answers[3].answerText}</TableCell>
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
            <DialogComponent
                open={openDialog}
                text={dialogText}
                onClose={handleCloseDialog}
                buttons={[
                    { text: "Ok", style: dialogClasses.dialogButton1, onClick: handleCloseDialog }
                ]}
            />
        </div>
    )
}

export default QuizCreator;
