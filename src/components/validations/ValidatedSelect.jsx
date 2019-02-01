import React from 'react';
import Select from 'react-select';
import { ValidatorComponent } from 'react-material-ui-form-validator';
import { withStyles } from '@material-ui/core/styles';
import { Color, ValidateError } from '../../variable/Color'; 

import PropTypes from 'prop-types';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';

const styles = theme => ({
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    backgroundColor: Color.kaideliveryLight,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} style={{color: 'white'}} />}
    />
  );
}

function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

class ValidatedSelect extends ValidatorComponent {

  shouldComponentUpdate(nextProps, nextState) {
        if (this.props.value !== nextProps.value) {
            return true
        }
        if (this.state.isValid !== nextState.isValid) {
            return true
        }
        return false
    }
 
    render() {
        const { errorMessages, validators, requiredError, value, theme, classes, ...rest } = this.props;
        const { isValid } = this.state
        const styleMore = {
            inputError : {
                control: (base, state) => ({
                    ...base,
                    padding: 5,
                    boxShadow: state.isFocused ? 0 : 0,
                    borderColor: state.isFocused
                    ? (!isValid ? Color.red300 : Color.kaidelivery)
                    : (!isValid ? Color.red300 : base.borderColor),
                '&:hover': {
                    borderColor: state.isFocused
                    ? (!isValid ? Color.red300 : Color.kaidelivery)
                    : (!isValid ? Color.red300 : base.borderColor),
                }
            }),
            input: base => ({
                ...base,
                color: theme.palette.text.primary,
                '& input': {
                font: 'inherit',
                },
            }),
        }
    };

    return (
        <div>
            <Select
                classes={classes}
                styles={styleMore.inputError}
                components={components}
                {...rest}
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

ValidatedSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};
 
export default withStyles(styles, { withTheme: true })(ValidatedSelect);