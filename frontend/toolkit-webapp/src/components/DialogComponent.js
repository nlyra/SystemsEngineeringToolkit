import { Dialog, DialogTitle, DialogActions, DialogContent, Button } from '@material-ui/core'
import myCoursesStyles from '../styles/myCoursesStyle'

export default function DialogComponent(props) {

    const classes = myCoursesStyles()

    return (
        <>
        { props.open === true ?

            <div className={classes.dialog}>
                <Dialog onClose={props.onClose} aria-labelledby="customized-dialog-title" classes={{ paper: classes.dialogPaper }} BackdropProps={{ style: { backgroundColor: 'rgba(193, 193, 187, 0.2)' } }} open={props.open}>
                    <div className={classes.dialogTitleDiv}>
                        <DialogTitle id="customized-dialog-title" className={classes.dialogTitle} onClose={props.onClose}>
                            {props.text}
                        </DialogTitle>
                    </div>
                    <DialogContent className={classes.dialogContent}>
                        {props.buttons.map((obj) => {
                            return (
                                <Button className={obj.style} size="small" variant="contained" type='submit' onClick={obj.onClick}>
                                    {obj.text}
                                </Button>
                            )
                        })}
                    </DialogContent>
                </Dialog>
            </div>

            : null}
        </>
    )

}