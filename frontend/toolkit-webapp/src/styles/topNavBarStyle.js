import { fade, makeStyles } from "@material-ui/core";
import { deepPurple, grey, amber } from '@material-ui/core/colors';
const drawerWidth = 240;

const topNavBarStyles = makeStyles((theme) => ({

  root:
  {
  },

  dialog:
  {
    position: 'absolute',
    minWidth: '30%'

  },

  dialogContent:
  {
    width: '40vh'
  },

  divider:
  {
    border: '1px solid grey',
    borderRadius: '10px',
    backgroundColor: 'grey'
  },

  dialogTitle:
  {
    textAlign: 'center',
    verticalAlign: 'middle',
    backgroundColor: grey[900],
    border: '2px solid white'
  },

  avatar:
  {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
    height: '6vh',
    width: '6vh',
    margin: 'auto'
  },


  statContent:
  {
    verticalAlign: 'right',
    margin: 'auto',
    width: '100%',
    alignSelf: 'center'
  },


  statsTitle:
  {
    textAlign: 'center',
    verticalAlign: 'middle',
    textDecoration: 'underline'
  },

  statsAvi:
  {
    color: theme.palette.getContrastText(amber[600]),
    backgroundColor: amber[600],
    border: '1px solid black',
    margin: 'auto'
  },

  roleDescription:
  {

    width: '100%',
    color: 'black',
    fontSize: '2.4vh',
    fontWeight: '500',
    marginTop: '3%'

  },

  roleStatContent:
  {
    width: '100%'
  },

  roleText:
  {
    width: '100%',
    textAlign: 'center'

  },

  roleGrid:
  {
    justifyContent: 'center'
  },

  statText:
  {
    width: '100%',
    textAlign: 'center'
  },

  closeButton:
  {
  },

  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
  },

  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchIcon2: {
    padding: theme.spacing(0, 5),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  logoStyle: {
    maxWidth: '10%',
    textAlign: 'center',
    margin: 'auto'
  },
  horizontalCenteringLogo: {
    position: 'absolute',
    left: '66%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  },
  test: {
    display: 'flex',
    alignItems: 'space-between'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    }
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  appBar: {
    background: 'black',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },

  logoutDialogTitle: {
    textAlign: 'center',
    verticalAlign: 'middle',
    backgroundColor: grey[50],
    border: '2px solid white'
  },

}))


export default topNavBarStyles;