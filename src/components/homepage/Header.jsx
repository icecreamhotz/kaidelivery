import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu'
import ModalLogin from '../header/ModalLogin'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import { setLocale } from '../../actions/locale'
import thailand from '../../resource/images/thailand.png'
import english from '../../resource/images/english.png'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  appbar: {
      backgroundColor: 'transparent',
     boxShadow: 'none'
  },
  toolbar: {
    [theme.breakpoints.up("lg")]: {
        width: 1170,
        marginLeft: 'auto',
        marginRight: 'auto'
    }
  },
  
})

class Header extends Component {

    state = {
        anchorEl: null,
        localeEl: null,
    }

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget })
    }

    handleClose = () => {
        this.setState({ anchorEl: null })
    }

    handleClickLocale = event => {
        this.setState({ localeEl: event.currentTarget });
    };

    handleCloseLocale = () => {
        this.setState({ localeEl: null });
    };

    render() {
        const { classes, locale } = this.props
        const { localeEl } = this.state
        return(
            <div className={classes.root}>
                <AppBar position="fixed" className={classes.appbar}>
                <Toolbar className={classes.toolbar}>
                    <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                    <MenuIcon />
                    </IconButton>
                    <Typography component={"span"} variant="h6" color="inherit" className={classes.grow}>
                        <FormattedMessage id="header.home" />
                    </Typography>

                    <ModalLogin />
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
            </div>
        )
    }
} 

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  setLocale: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired
};

function mapStateToProps(state) {
    return {
        locale: state.locale.lang
    }
}

export default injectIntl(connect(mapStateToProps, { setLocale })(withStyles(styles)(withRouter(Header))))