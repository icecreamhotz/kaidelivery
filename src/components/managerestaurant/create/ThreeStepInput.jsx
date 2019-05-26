import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import ArrowForward from '@material-ui/icons/ArrowForward';
import { Color } from '../../../variable/Color'
import { NavLink } from 'react-router-dom'
import { FormattedMessage } from "react-intl";

import './success.scss'

const styles = theme => ({
    root: {
        paddingTop: 30,
    },
    paper: {
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    section: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    sectionIconSuccess: {
        height: 200,
        backgroundColor: green['A400'],
    },
    sectionTextSuccess: {
        paddingTop: 50,
        paddingBottom: 50,
        height: 270,
        backgroundColor: '#FFFFFF',
    },
    margin: {
        margin: theme.spacing.unit,
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },
    button: {
        backgroundColor: Color.kaidelivery,
        '&:hover': {
            backgroundColor: Color.kaideliveryLight,
        }
    }
})

class ThreeStepInput extends Component {
    render() {
        const { classes } = this.props
        return (
            <div className={classes.root}>
                <Grid container spacing={0}>
                    <Grid item xs={12} style={{paddingBottom: 0}}>
                        <Paper className={classes.paper}>
                            <div className={`${classes.section} ${classes.sectionIconSuccess}`}>
                                <div className="success-icon">
                                    <div className="success-icon__tip"></div>
                                    <div className="success-icon__long"></div>    
                                </div>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item align="center" xs={12} style={{paddingTop: 0}}>
                        <Paper className={classes.paper}>
                            <div className={`${classes.section} ${classes.sectionTextSuccess}`}>
                                <Grid item xs>
                                    <Typography variant="h4" gutterBottom>
                                        <FormattedMessage id="create.stepthree.saturday" />
                                    </Typography>
                                </Grid>
                                <Grid item xs>
                                    <Typography variant="subtitle1" gutterBottom>
                                        <FormattedMessage id="create.stepthree.sunday" />
                                    </Typography>
                                </Grid>
                                <Grid item xs>
                                    <NavLink to={`/myrestaurant/${this.props.resName}`} style={{textDecoration: 'none'}}>
                                        <Fab variant="extended" color="primary" aria-label="Add" className={`${classes.margin} ${classes.button}`}>
                                        <ArrowForward className={classes.extendedIcon} />
                                            <FormattedMessage id="create.stepthree.more" />
                                        </Fab>
                                    </NavLink>
                                </Grid>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(ThreeStepInput);