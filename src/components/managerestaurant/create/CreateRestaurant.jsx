import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import OneStepInput from './OneStepInput'
import TwoStepInput from "./TwoStepInput";

const styles = theme => ({
  backButton: {
    marginRight: theme.spacing.unit,
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

function getSteps() {
  return ['About Restaurant', 'Restaurant Infomations', 'Do not think'];
}

class CreateRestaurant extends Component {
    state = {
        activeStep: 0,
    };

    handleNext = () => {
        this.setState(state => ({
        activeStep: state.activeStep + 1,
        }));
    };

    render() {
        const { classes } = this.props;
        const steps = getSteps();
        const { activeStep } = this.state;
        return (
            <div class="content-start">
                <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map(label => {
                    return (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                    );
                })}
                </Stepper>
                <div>
                {this.state.activeStep === steps.length ? (
                    <div>
                    <Typography className={classes.instructions}>All steps completed</Typography>
                    <Button onClick={this.handleReset}>Reset</Button>
                    </div>
                ) : (
                    <div>
                    {activeStep == 0 && <OneStepInput handleNext={this.handleNext}/>}
                    {activeStep == 1 && <TwoStepInput handleNext={this.handleNext}/>}
                    </div>
                )}
                </div>
            </div>
        );
    }
}

CreateRestaurant.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(CreateRestaurant);;