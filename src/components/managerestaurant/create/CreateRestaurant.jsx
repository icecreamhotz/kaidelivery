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
import ThreeStepInput from './ThreeStepInput';
import { connect } from 'react-redux'
import { updateTriggerURL } from '../../../actions/restaurant'
import { FormattedMessage } from "react-intl";

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
  return [<FormattedMessage id="create.stepone.header" />, <FormattedMessage id="create.steptwo.header" />, <FormattedMessage id="create.stepthree.header" />];
}

class CreateRestaurant extends Component {
    state = {
        activeStep: 0,
        res_id: '',
        res_name: '',
        loading: false
    };

    handleNext = () => {
        this.setState(state => ({
        activeStep: state.activeStep + 1,
        }));
    };
    
    setResID = (res_id) => {
        this.setState({
            res_id: res_id
        })
    }

    setResName = (res_name) => {
        this.setState({
            res_name: res_name
        })
    }

    setLoading = (loaded) => {
        this.setState({ loading: loaded })
    }

    componentWillReceiveProps(newProps) {
        if(newProps.resetStep) {
            this.setState({
                activeStep: 0
            }, () => this.props.updateTriggerURL(false))
        }
    }

    render() {
        const { classes } = this.props;
        const steps = getSteps();
        const { activeStep } = this.state;
        return (
            <div className="content-start">
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
                    {activeStep === 0 && <OneStepInput handleNext={this.handleNext} setResID={this.setResID} setResName={this.setResName} />}
                    {activeStep === 1 && <TwoStepInput handleNext={this.handleNext} resID={this.state.res_id} resName={this.state.res_name} />}
                    {activeStep === 2 && <ThreeStepInput resName={this.state.res_name} />}
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

function mapStateToProps(state) {
    return {
        resetStep: state.update.resStep
    }
}

export default connect(mapStateToProps, { updateTriggerURL: updateTriggerURL })(withStyles(styles)(CreateRestaurant));