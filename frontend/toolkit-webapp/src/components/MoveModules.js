import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DialogActions, DialogTitle, DialogContent, Dialog, } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import config from '../config.json';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
  },
  list: {
    width: 200,
    height: 230,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}));

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export default function MoveModules(props) {
  const classes = useStyles();
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState(props.moduleTitles);
  const [right, setRight] = useState([]);

  const [move, setMove] = useState(props.move);
  const [modules, setModules] = useState(props.modules)

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  useEffect(() => {
    setNewModules()
  }, []);

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const setNewModules = () => {
    sessionStorage.setItem('newModules', JSON.stringify(right))
  }

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
    // setNewModules()
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
    // setNewModules()
  };



  const handleClickClose = () => {
    setMove(false)
  }

  const saveModules = () => {
    let temparray = []
    // console.log(right.length + " " + modules.length)
    for (let i = 0; i < right.length; i++) {
      for (let j = 0; j < modules.length; j++) {
        if (right[i] === modules[j].title)
          temparray[i] = modules[j]
      }
    }
    console.log(temparray)
    setModules(temparray)
    console.log(modules)
    // handleClickSave()
  }

  const handleClickSave = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(config.server_url + config.paths.reorderModules, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        'token': token,
        'courseID': props.course._id,
        'modules': modules
      })
    })

    const data = await res.json()

    // setMove(false)
  }




  const customList = (title, items) => (
    <Card>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
            inputProps={{ 'aria-label': 'all items selected' }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List className={classes.list} dense component="div" role="list">
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value}`} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>

  );

  return (
    // { move === true ?
        <Dialog
          // open={move}
          onClose={handleClickClose}
        >
          <DialogTitle>Reorder Modules</DialogTitle>
          <DialogContent>
            {/* <MoveModules modules={modules} moduleTitles={getTitles}></MoveModules> */}
            <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
              <Grid item>{customList('Choices', left)}</Grid>
              <Grid item>
                <Grid container direction="column" alignItems="center">
                  <Button
                    variant="outlined"
                    size="small"
                    className={classes.button}
                    onClick={handleCheckedRight}
                    disabled={leftChecked.length === 0}
                    aria-label="move selected right"
                  >
                    &gt;
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    className={classes.button}
                    onClick={handleCheckedLeft}
                    disabled={rightChecked.length === 0}
                    aria-label="move selected left"
                  >
                    &lt;
                  </Button>
                </Grid>
              </Grid>
              <Grid item>{customList('Chosen', right)}</Grid>
              {/* <Grid item><Button onClick={setNewModules}>Hello There</Button></Grid> */}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="default" size="small" onClick={saveModules}>
              Save Changes
            </Button>
            {/* <Button variant="contained" color="default" size="small" onClick={handleClickClose}>
            Close
          </Button> */}
          </DialogActions>
        </Dialog>
      // : null}
  );
}
