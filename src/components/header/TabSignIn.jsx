import React , { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import VpnKey from '@material-ui/icons/VpnKey';
import Email from '@material-ui/icons/Email';
import { Color } from '../../variable/Color';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux'
import { login } from '../../actions/auth'
import {withRouter} from "react-router-dom";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import CircularProgress from '@material-ui/core/CircularProgress';
import Facebook from '../socials/Facebook'
import API from '../../helper/api'

import { FormattedMessage } from 'react-intl'

const styles = theme => ({
    paperRoot: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        width: '100%',
        backgroundColor: Color.danger,
        marginBottom: 15
    },
    container : {
        display: 'flex',
        flexWrap: 'wrap',
        padding: '40px 50px',
    },
    ic: {
        color: Color.kaidelivery
    },
    spanClass: {
        fontWeight: 'bold',
        color: Color.kaidelivery,
        '&:hover': {
            cursor: 'pointer'
        }
    },
    btLogin: {
        backgroundColor: Color.kaideliveryLight,
        color: 'white',
        '&:hover': {
            backgroundColor: Color.kaidelivery
        }
    },
    divider: {
        float: 'none',
        margin: '0 auto 18px',
        overflow: 'hidden',
        position: 'relative',
        textAlign: 'center',
        width: '100%'
    },
    lineLeft: {
        borderTop: '1px solid #DFDFDF',
        position: 'absolute',
        top: '10px',
        width: '40%',
        left: 0
    },
    lineRight: {
        borderTop: '1px solid #DFDFDF',
        position: 'absolute',
        top: '10px',
        width: '40%',
        right: 0
    }
})

class TabSignIn extends Component {

    state = {
        username: '',
        password: '',
        email: '',
        loading: false,
        erremail: false,
        helpertext: '',
        showreset: false,
        emailsuccess: false,
        sended: false,
        err: false
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleSendEmail = async () => {
        const regEmail = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        
        if(this.state.email === '' || !regEmail.test(this.state.email)) {
            this.setState({
                erremail: true,
                helpertext: 'Please input email or invalid email'
            })
            return
        }
        
        if(!this.state.loading) {
            this.setState({
                loading: true
            })
        }
        await API.post(`users/forgot`, {email: this.state.email}).then((res) => {
            this.setState({
                loading: false,
                sended: true
            })
            if(!res.data.status) {
                this.setState({
                    erremail: true,
                    helpertext: res.data.message
                })
            } else {
                this.setState({
                    emailsuccess: true,
                })
                if(this.state.erremail) {
                    this.setState({
                        erremail: false,
                        helpertext: ''
                    })
                }
            }
        })
    }

    onSubmit = (e) => {
        e.preventDefault()

        const credentials = {
            username: this.state.username,
            password: this.state.password
        }

        this.props.login(credentials)
        .then((res) => this.props.setClose())
        .catch((err) => this.setState({err: true}))
    } 
        

    render() {
        const { classes } = this.props
        const { loading, emailsuccess , sended} = this.state
        const warningEmailText = (emailsuccess ? 'SENDED' : 'RESEND')
        const warningEmailBg = (emailsuccess ? Color.success : Color.invalid)
        return(
            <ValidatorForm
                ref="form"
                onSubmit={this.onSubmit}
                onError={errors => console.log(errors)}
                className={classes.container}
            >
                {this.state.err && (
                    <Paper className={classes.paperRoot} elevation={1}>
                        <Typography component={'span'} style={{color: '#FFFFFF'}}>
                            <FormattedMessage id="popup.loginfailed" />
                        </Typography>
                    </Paper>
                )}
                <Grid container spacing={24} alignItems="flex-end">
                    <Grid item xs={12} sm={1}>
                        <AccountCircle className={classes.ic}/>
                    </Grid>
                    <Grid item xs={12} sm>
                        <TextValidator 
                            name="username" 
                            label={<FormattedMessage id="input.username" />} 
                            fullWidth
                            value={this.state.username}
                            onChange={this.handleChange('username')}
                            validators={['required']}
                            errorMessages={['this field is required']}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={24} alignItems="flex-end" style={{marginTop: 20}}>
                    <Grid item xs={12} sm={1}>
                        <VpnKey className={classes.ic}/>
                    </Grid>
                    <Grid item xs={12} sm>
                        <TextValidator
                            name="password"
                            label={<FormattedMessage id="input.password" />}
                            type="password"
                            fullWidth
                            value={this.state.password}
                            onChange={this.handleChange('password')}
                            validators={['required']}
                            errorMessages={['this field is required']}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={24} alignItems="flex-end" style={{marginTop: 15}}>
                    <Grid item xs>                       
                        <Typography component={'span'} variant="caption" gutterBottom align="left">
                            <FormattedMessage id="popup.notamember" /> 
                            {/* <span className={classes.spanClass} style={{marginLeft: 5}}><FormattedMessage id="popup.notasignup" /></span> */}
                        </Typography>
                    </Grid>
                    <Grid item xs>
                        <Typography component={'span'} variant="caption" gutterBottom align="right">
                            {/* <span className={classes.spanClass} onClick={() => this.setState({showreset: true})}><FormattedMessage id="popup.forgot" /></span> */}
                        </Typography>
                    </Grid>
                </Grid>
                {
                    this.state.showreset && <Grid container spacing={24} alignItems="flex-end">
                    <Grid item xs={12} sm={1}>
                        <Email className={classes.ic}/>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        <TextField
                            error={this.state.erremail}
                            name="email"
                            label={<FormattedMessage id="input.email" />}
                            fullWidth
                            value={this.state.email}
                            helperText={this.state.erremail ? this.state.helpertext : ''}
                            onChange={this.handleChange('email')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                        {
                            loading ? <CircularProgress className={classes.progress} />
                            :                 
                            <Button
                                variant="contained" 
                                color="primary"
                                fullWidth
                                onClick={this.handleSendEmail}
                                style={{backgroundColor: (sended ? warningEmailBg : '')}}
                            >
                                {sended ? warningEmailText : "SEND"}
                            </Button>
                        } 
                    </Grid>
                </Grid>
                }
                <Grid container spacing={24} alignItems="flex-end" style={{marginTop: 15}}>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" fullWidth className={classes.btLogin}>
                            <FormattedMessage id="popup.login" />
                        </Button>
                    </Grid>
                </Grid>
                <Grid container spacing={24} alignItems="flex-end" style={{marginTop: 30}}>
                    <Grid item xs={12}>
                        <div className={classes.divider}>
                            <div className={classes.lineLeft}></div>
                            <span><FormattedMessage id="popup.or" /></span>
                            <div className={classes.lineRight}></div>
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={24} alignItems="flex-end" style={{marginTop: 5}}>
                    <Grid item xs={12}>
                        <Facebook />
                    </Grid>
                </Grid>
            </ValidatorForm>
        )
    }
}

TabSignIn.propTypes = {
    classes: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired
}

export default connect(null, { login })(withStyles(styles)(withRouter(TabSignIn)))