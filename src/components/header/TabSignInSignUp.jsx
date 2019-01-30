import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FingerPrintIcon from '@material-ui/icons/Fingerprint';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import TabSignIn from './TabSignIn'
import TabSignUp from './TabSignUp'


import { Color } from '../../variable/Color';
import { FormattedMessage } from 'react-intl'

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: 'auto'
    },
    indicator: {
        backgroundColor: Color.kaidelivery
    },
    selectTab: {
        color: Color.kaidelivery
    }
})

class TabSignInSignUp extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;

    return (
        <div>
        <Paper square className={classes.root}>
            <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            fullWidth
            classes={{indicator: classes.indicator}}
            >
            <Tab icon={<FingerPrintIcon />} label={<FormattedMessage id="popup.login" />} classes={{selected: classes.selectTab}}/>
            <Tab icon={<PersonAddIcon />} label={<FormattedMessage id="popup.register" />} classes={{selected: classes.selectTab}}/>
            </Tabs>
        </Paper>
        {this.state.value === 0 && <TabSignIn>Page One</TabSignIn>}
        {this.state.value === 1 && <TabSignUp>Page Two</TabSignUp>}
        </div>
    );
  }
}

TabSignInSignUp.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TabSignInSignUp);