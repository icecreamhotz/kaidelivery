import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TabSignInSignUp from './TabSignInSignUp'

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import { FormattedMessage } from 'react-intl'

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
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    const { open } = this.state;
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
            <DialogContentText component={'div'}><TabSignInSignUp setClose={this.handleClose}/></DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

ModalLogin.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ModalLogin);
