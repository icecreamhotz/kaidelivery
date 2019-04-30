import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TabSignInSignUp from './TabSignInSignUp'

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { triggerLoginSignupHeader } from "../../actions/header.js";

const styles = theme => ({
  root: {
    padding: 0,
    '&:first-child': {
      paddingTop: 0
    }
  }
});

class ModalLogin extends React.Component {
  state = {
    open: false,
    value: 0
  };

  componentWillReceiveProps(nextProps) {
    if(nextProps.status !== this.props.status) {
        this.setState({
          open: nextProps.status.alertlogin,
          value: nextProps.status.alerttabindex
        })
    }
  }

  handleOpen = () => {
    this.setState({ open: true });
    this.props.triggerLoginSignupHeader({
      alertlogin: true,
      alerttabindex: 0
    })
  };

  handleClose = () => {
    this.setState({ open: false });
    this.props.triggerLoginSignupHeader({
      alertlogin: false,
      alerttabindex: 0
    })
  };

  render() {
    const { classes } = this.props;
    const { open, value } = this.state;
    return (
      <div>
        <Button color="inherit" onClick={this.handleOpen}>
          <span style={{color: '#ff9100'}}>
            <FormattedMessage id="header.login" />
          </span> 
          <span style={{margin: '0 5px'}}><FormattedMessage id="header.or" /></span> 
          <span style={{color: '#33eb91'}}>
            <FormattedMessage id="header.signup" />
          </span>
        </Button>
        <Dialog open={open} onClose={this.handleClose}>
          <DialogContent className={classes.root}>
            <DialogContentText component={'div'}><TabSignInSignUp setClose={this.handleClose} value={value}/></DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

ModalLogin.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    status: state.header.status
  }
}

export default withStyles(styles)(connect(mapStateToProps, {
  triggerLoginSignupHeader: triggerLoginSignupHeader
})(ModalLogin));
