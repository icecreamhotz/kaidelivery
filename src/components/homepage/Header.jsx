import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import ModalLogin from "../header/ModalLogin";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { setLocale } from "../../actions/locale";
import thailand from "../../resource/images/thailand.png";
import english from "../../resource/images/english.png";
import API from "../../helper/api";
import Avatar from "@material-ui/core/Avatar";
import * as actions from "../../actions/auth";
import { Link } from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  appbar: {
    boxShadow: "none"
  },
  toolbar: {
    [theme.breakpoints.up("lg")]: {
      width: 1170,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  name: {
    display: "none",
    marginBottom: 0,
    color: "white",
    [theme.breakpoints.up("sm")]: {
      display: "inline-flex"
    }
  }
});

const linkLeftDrawerAuth = [
  {
    title: "Restaurants",
    link: ""
  },
  {
    title: "Tracking",
    link: "/tracking"
  },
  {
    title: "History",
    link: "/history"
  }
];
const linkLeftDrawerNAuth = [
  {
    title: "Restaurants",
    link: ""
  },
  {
    title: "Tracking",
    link: "/tracking"
  }
];

class Header extends Component {
  state = {
    anchorEl: null,
    localeEl: null,
    loading: true,
    user: [],
    avatar: "",
    open: true,
    left: false
  };

  async componentDidMount() {
    if (this.props.isAuthenticated) {
      await this.fetchUserData();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAuthenticated) {
      this.fetchUserData();
    }
  }

  fetchUserData = async () => {
    const user = await API.get(`users/info`);
    const { data } = await user;
    this.setState({
      user: data.user,
      avatar: data.user.avatar,
      loading: false
    });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = page => {
    this.setState({ anchorEl: null }, () => {
      if (page === "logout") {
        this.props.logout();
        this.props.history.push("/");
        return;
      }
    });
  };

  handleClickLocale = event => {
    this.setState({ localeEl: event.currentTarget });
  };

  handleCloseLocale = () => {
    this.setState({ localeEl: null });
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open
    });
  };

  render() {
    const { classes, locale, isAuthenticated } = this.props;
    const { localeEl, loading, open, avatar, anchorEl } = this.state;
    const openEl = Boolean(anchorEl);
    const bgColorAppbar =
      this.props.location.pathname === "/" ? "transparent" : "#88888c";
    const linkLeftDrawer = isAuthenticated
      ? linkLeftDrawerAuth
      : linkLeftDrawerNAuth;
    const sideList = (
      <div style={{ width: 250 }}>
        <List>
          {linkLeftDrawer.map((text, index) => (
            <Link
              to={text.link}
              style={{
                outline: "none",
                textDecoration: "none",
                display: "block"
              }}
              key={index}
            >
              <ListItem button key={text.title}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text.title} />
              </ListItem>
            </Link>
          ))}
        </List>
      </div>
    );
    return (
      <div className={classes.root}>
        <AppBar
          position="fixed"
          className={classes.appbar}
          style={{ backgroundColor: bgColorAppbar }}
        >
          <Toolbar className={classes.toolbar}>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={this.toggleDrawer("left", true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              open={this.state.left}
              onClose={this.toggleDrawer("left", false)}
            >
              <div
                tabIndex={0}
                role="button"
                onClick={this.toggleDrawer("left", false)}
                onKeyDown={this.toggleDrawer("left", false)}
              >
                {sideList}
              </div>
            </Drawer>
            <Typography
              component={"span"}
              variant="h6"
              color="inherit"
              className={classes.grow}
            >
              <Link to="/" style={{ textDecoration: "none", color: "unset" }}>
                <FormattedMessage id="header.home" />
              </Link>
            </Typography>
            {isAuthenticated ? (
              <div>
                {loading ? (
                  <div className="animated">
                    <div className="parent" />
                  </div>
                ) : (
                  <Typography
                    component={"span"}
                    variant="subtitle2"
                    gutterBottom
                    align="center"
                    className={classes.name}
                  >
                    {this.state.user.name + " " + this.state.user.lastname}
                  </Typography>
                )}
                <IconButton
                  aria-owns={openEl ? "menu-appbar" : undefined}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  <Avatar
                    alt={this.state.user.name}
                    src={`https://kaidelivery-api.herokuapp.com/users/${
                      avatar ? avatar : "noimg.png"
                    }`}
                    className={classes.bigAvatar}
                  />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  open={openEl}
                  onClose={this.handleClose}
                >
                  <Link
                    to="/profile"
                    style={{
                      outline: "none",
                      textDecoration: "none",
                      display: "block"
                    }}
                  >
                    <MenuItem>Profile</MenuItem>
                  </Link>
                  <MenuItem onClick={() => this.handleClose("logout")}>
                    Log out
                  </MenuItem>
                </Menu>
              </div>
            ) : (
              <ModalLogin />
            )}
            {
              <img
                aria-owns={localeEl ? "simple-menu" : undefined}
                aria-haspopup="true"
                onClick={this.handleClickLocale}
                src={locale === "th" ? thailand : english}
                alt={locale === "th" ? thailand : english}
                style={{ verticalAlign: "middle", cursor: "pointer" }}
              />
            }
            <Menu
              id="simple-menu"
              anchorEl={localeEl}
              open={Boolean(localeEl)}
              onClose={this.handleCloseLocale}
            >
              <MenuItem onClick={() => this.props.setLocale("th")}>
                <ListItemIcon className={classes.icon}>
                  <img src={thailand} alt={thailand} />
                </ListItemIcon>
                <ListItemText inset primary="TH" />
              </MenuItem>
              <MenuItem onClick={() => this.props.setLocale("en")}>
                <ListItemIcon className={classes.icon}>
                  <img src={english} alt={english} />
                </ListItemIcon>
                <ListItemText inset primary="EN" />
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  setLocale: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    locale: state.locale.lang,
    isAuthenticated: !!state.user.token
  };
}

export default injectIntl(
  connect(
    mapStateToProps,
    { logout: actions.logout, setLocale }
  )(withStyles(styles)(withRouter(Header)))
);
