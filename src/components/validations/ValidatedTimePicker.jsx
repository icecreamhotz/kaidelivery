import React from 'react';
import { ValidatorComponent } from 'react-material-ui-form-validator';
import { TimePicker } from 'material-ui-pickers';
import { Color, ValidateError } from '../../variable/Color';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  underline: {
    '&:before': {
      // The source seems to use this but it doesn't work
      borderBottom: `2px solid ${Color.red300}`,
    },
    '&:after': {
      // The source seems to use this but it doesn't work
      borderBottom: `2px solid ${Color.red300}`,
    },
    "&&&&:hover:before": {
        borderBottom: `2px solid ${Color.red300}`,
    },
    "&&&&:hover:after": {
        borderBottom: `2px solid ${Color.red300}`,
    }
  }
});
class ValidatedTimePicker extends ValidatorComponent {

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.errorMessages !== nextProps.errorMessages) {
            return true
        }
        if (this.props.validators !== nextProps.validators) {
            return true
        }
        if (this.props.requiredError !== nextProps.requiredError) {
            return true
        }
        if (this.props.value !== nextProps.value) {
            return true
        }
        if (this.props.classes !== nextProps.classes) {
            return true
        }
        if (this.state.isValid !== nextState.isValid) {
            return true
        }
        return false
    }

    render() {
        const { errorMessages, validators, requiredError, value, classes, ...rest } = this.props;
        const { isValid } = this.state
        return (
            <div>
                <TimePicker
                    InputProps={{classes: {underline: (!isValid ? classes.underline : '')}}}
                    {...rest}
                    value={value}
                    ref={(r) => { this.input = r; }}
                />
                {this.errorText()}
            </div>
        );
    }
 
    errorText() {
        const { isValid } = this.state;
 
        if (isValid) {
            return null;
        }
 
        return (
            <div style={ValidateError.textError}>
                {this.getErrorMessage()}
            </div>
        );
    }
}

export default withStyles(styles)(ValidatedTimePicker);