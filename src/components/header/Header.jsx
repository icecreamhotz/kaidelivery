import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu'
import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Logout from '@material-ui/icons/ExitToApp';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux'
import * as actions from '../../actions/auth'
import { Color } from '../../variable/Color'
import Avatar from '@material-ui/core/Avatar';
import './loading.scss'
import { FormattedMessage, injectIntl } from 'react-intl'
import { NavLink } from 'react-router-dom';
import { setLocale } from '../../actions/locale'
import { updateRestaurantName } from '../../actions/restaurant'
import thailand from '../../resource/images/thailand.png'
import english from '../../resource/images/english.png'
import API from '../../helper/api'
import { updateData } from '../../actions/user'
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ContentLoader from "react-content-loader"

const styles = theme => ({
  root: {
    display: 'flex',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    padding: '0 8px',
    textAlign: 'center',
    ...theme.mixins.toolbar,
  },
  toolbarMenu: {
      padding: '0 20px'
  },
  name: {
    display: 'none', 
    marginBottom: 0, 
    color: 'white',
    [theme.breakpoints.up('sm')]: {
        display: 'inline-flex'
    }
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: Color.kaidelivery
  },
  appBarShift: {
    marginLeft: 240,
    width: `calc(100% - ${240}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -240,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
})

const LeftLoader = props => (
	<ContentLoader 
		rtl
		height={650}
		width={400}
		speed={2}
		primaryColor="#f3f3f3"
		secondaryColor="#ecebeb"
		{...props}
	>
		<rect x="98.31" y="50" rx="3" ry="3" width="270.28" height="12.06" /> 
		<circle cx="59.03" cy="50" r="21.62" />

        <rect x="98.31" y="130" rx="3" ry="3" width="270.28" height="12.06" /> 
		<circle cx="59.03" cy="130" r="21.62" />

        <rect x="98.31" y="220" rx="3" ry="3" width="270.28" height="12.06" /> 
		<circle cx="59.03" cy="220" r="21.62" />

        <rect x="98.31" y="310" rx="3" ry="3" width="270.28" height="12.06" /> 
		<circle cx="59.03" cy="310" r="21.62" />
        
        <rect x="98.31" y="400" rx="3" ry="3" width="270.28" height="12.06" /> 
		<circle cx="59.03" cy="400" r="21.62" />

        <rect x="45.31" y="500" rx="3" ry="3" width="322.28" height="12.06" /> 
	</ContentLoader>
)

const ResLoader = props => (
	<ContentLoader 
		rtl
		height={160}
		width={400}
		speed={2}
		primaryColor="#f3f3f3"
		secondaryColor="#ecebeb"
		{...props}
	>
		<rect x="98.31" y="30" rx="3" ry="3" width="290.28" height="12.06" /> 
		<circle cx="59.03" cy="28.03" r="21.62" />
	</ContentLoader>
)

class Header extends Component {

    state = {
        localeEl: null,
        user: [],
        avatar: '',
        loading: true,
        open: true,
        openRes: true,
        myRestaurants: [],
        loadingLeft: true,
        loadingRes: false,
    }

    async componentDidMount() {
        await this.fetchUserData()
        await this.fetchRestaurantUser()
        this.setState({
            loadingLeft: false
        })
    }

    fetchUserData = async () => {
        const user = await API.get(`users/info`)
        const { data } = await user
        this.setState({
            user: data.user,
            avatar: data.user.avatar,
            loading: false
        })
    }

    fetchRestaurantUser = async () => {
        const restaurants = await API.get('restaurants/owner')
        const { data } = await restaurants
        this.setState({
            myRestaurants: data.data,
            loadingRes: false
        })
    }

    async componentWillReceiveProps(nextProps) {
        if(nextProps.userStatus) {
            this.setState({
                loading: true
            })
            await this.fetchUserData()
            this.props.updateData(false)
        }
        if(nextProps.resStatus) {
            this.setState({
                loadingRes: true
            })
            await this.fetchRestaurantUser()
            this.props.updateRestaurantName(false)
        }
    }
    
    handleDrawerOpen = () => {
        this.setState({ open: true })
    }

    handleClick = () => {
        this.setState(state => ({ openRes: !state.openRes }));
    };

    handleDrawerClose = () => {
        this.setState({ open: false })
    }

    handleClickLocale = event => {
        this.setState({ localeEl: event.currentTarget });
    };

    handleCloseLocale = () => {
        this.setState({ localeEl: null });
    };

    render() {
        const { classes, locale, theme, logout } = this.props
        const { anchorEl, loading, avatar, localeEl, myRestaurants, loadingRes, loadingLeft} = this.state
        const open = Boolean(anchorEl)
        return(
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" 
                    className={classNames(classes.appBar, {
                    [classes.appBarShift]: this.state.open,})}
                >
                <Toolbar className={classes.toolbarMenu} disableGutters={!this.state.open}>
                    <IconButton 
                        color="inherit" 
                        aria-label="Open drawer"
                        onClick={this.handleDrawerOpen}
                        className={classNames(classes.menuButton, this.state.open && classes.hide)}
                        >
                        <MenuIcon />
                    </IconButton>
                    <Typography component={"span"} variant="h6" color="inherit" className={classes.grow}>
                        Kai delivery
                    </Typography> 
                    <div>
                        {
                            loading ?
                            <div class="animated">
                                <div class="parent"></div>
                            </div>
                            :
                            
                            <Typography component={"span"} variant="subtitle2" gutterBottom align="center" className={classes.name}>
                                {this.state.user.name + ' ' + this.state.user.lastname}
                            </Typography>
                        }
                        <IconButton
                                aria-owns={open ? 'menu-appbar' : undefined}
                                aria-haspopup="true"
                                onClick={this.handleMenu}
                                color="inherit"
                            >
                            <Avatar alt={this.state.user.name} src={`http://localhost:3000/users/${(avatar ? avatar : 'noimg.png')}`} className={classes.bigAvatar} />
                        </IconButton>
                    </div>
                    {
                         <img aria-owns={localeEl ? 'simple-menu' : undefined} aria-haspopup="true" onClick={this.handleClickLocale} src={(locale === 'th' ? thailand : english)} alt={(locale === 'th' ? thailand : english)} style={{verticalAlign: 'middle', cursor:'pointer'}}/>
                    }
                        <Menu
                            id="simple-menu"
                            anchorEl={localeEl}
                            open={Boolean(localeEl)}
                            onClose={this.handleCloseLocale}
                            >
                            <MenuItem onClick={() => this.props.setLocale('th')}>
                                <ListItemIcon className={classes.icon}>
                                    <img src={thailand} alt={thailand}/>
                                </ListItemIcon>
                                <ListItemText inset primary="TH" />
                            </MenuItem>
                            <MenuItem onClick={() => this.props.setLocale('en')}>
                                <ListItemIcon className={classes.icon}>
                                    <img src={english} alt={english}/>
                                </ListItemIcon>
                                <ListItemText inset primary="EN" />
                            </MenuItem>
                        </Menu>
                </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={this.state.open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    >
                    <div className={classes.toolbar}>
                        <Typography component="h2" variant="headline" style={{flex: '1'}}>
                            Menu
                        </Typography>
                        <IconButton onClick={this.handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </div>
                    <Divider />
                    { !loadingLeft ?
                    <div>
                        <List>
                            {[
                                {
                                    url: '/profile',
                                    text: <FormattedMessage id="menu.profile" />, 
                                },
                                {
                                    url: '/reset',
                                    text: <FormattedMessage id="menu.resetpassword" />, 
                                },
                                {
                                    url: '/myrestaurant',
                                    text: <FormattedMessage id="menu.createrestaurant" />, 
                                }
                            ].map((value, index) => (
                            <NavLink to={value.url} style={{ textDecoration: 'none', color: 'unset' }} > 
                                <ListItem button key={value}>
                                    <ListItemIcon>{index % 2 === 0 ? <Logout /> : <Logout />}</ListItemIcon>
                                    <ListItemText primary={value.text} />
                                </ListItem>
                            </NavLink>
                            ))}
                            {
                                !loadingRes ?
                                    myRestaurants.length > 0 &&
                                    <div>
                                    <ListItem button onClick={this.handleClick}>
                                    <ListItemIcon>
                                        <InboxIcon />
                                    </ListItemIcon>
                                    <ListItemText inset primary="Restaurants" />
                                    {this.state.openRes ? <ExpandLess /> : <ExpandMore />}
                                    </ListItem>
                                    <Collapse in={this.state.openRes} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                        {myRestaurants.map(item => {
                                            return  (
                                                    <ListItem button className={classes.nested}>
                                                        <ListItemIcon>
                                                            <StarBorder />
                                                        </ListItemIcon>
                                                        <ListItemText inset primary={item.res_name} /> 
                                                    </ListItem>
                                                )
                                            })
                                            }
                                        </List>
                                    </Collapse>
                                    </div>
                                :
                                <div>
                                    <ResLoader />
                                </div>
                            }
                        </List>
                        <Divider />
                        <List>
                            <ListItem button key="1" onClick={() => logout()} style={{backgroundColor: Color.danger}}>
                                <ListItemIcon style={{color: '#FFFFFF'}}><Logout /></ListItemIcon>
                                <ListItemText  
                                    disableTypography
                                    primary={<Typography type="body2" style={{ color: '#FFFFFF' }}><FormattedMessage id="menu.logout" /></Typography>}
                                />
                            </ListItem>
                        </List>
                    </div>
                    :
                        <LeftLoader />
                    }
                </Drawer>
                <main 
                className={classNames(classes.content, {
                    [classes.contentShift]: this.state.open,
                })}>
                    {this.props.component}
                </main>
                
            </div>
        )
    }
} 

Header.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    setLocale: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    userStatus: PropTypes.bool.isRequired,
    resStatus: PropTypes.bool.isRequired,
    updateData: PropTypes.func.isRequired,
    updateRestaurantName: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    return {
        locale: state.locale.lang,
        userStatus: state.update.userStatus,
        resStatus: state.update.resStatus
    }
}


export default injectIntl(connect(mapStateToProps, { logout: actions.logout, setLocale, updateData: updateData, updateRestaurantName: updateRestaurantName })(withStyles(styles, { withTheme: true })(Header)))