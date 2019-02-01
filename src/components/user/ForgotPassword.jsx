import React, { Component } from 'react'
import Header from '../header/Header'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import withRules from '../validations/validate'
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Link } from 'react-router-dom'
import VpnKey from '@material-ui/icons/VpnKey';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Button from '@material-ui/core/Button';
import { Color } from '../../variable/Color';
import SweetAlert from 'sweetalert-react';
import Loading from '../loaders/loading'
import { Redirect } from 'react-router'
import { FormattedMessage } from 'react-intl'
import API from '../../helper/api'

const styles = theme => ({
    paper: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 5,
        paddingBottom: theme.spacing.unit * 5,
    },
    btSave: {
        color: '#FAFAFA',
        backgroundColor: Color.registerButton,
        '&:hover': {
            backgroundColor: Color.registerButtonLight
        }
    }
});

const ITEM_HEIGHT = 48; // menu password height

class ForgotPassword extends Component {

    state = { anchorEl: null, password: '', confirm: '', showsuccess: false, loadingDB: false, auth: true }

    async componentDidMount() {
        await API.get(`users/forgot/${this.props.match.params.token}`).then(res => {
            console.log(this.props.match.params.token)
                this.setState({
                    auth: res.data.status
                })
        })
        // custom rule will have name 'isPasswordMatch'
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== this.state.password) {
                return false;
            }
            return true;
        });
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        })
    }

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    onSubmit = async (e) => {
        e.preventDefault()
        this.setState({
            loadingDB: true
        })

        const data = {
            password: this.state.password,
            confirm_password: this.state.confirm
        }
        await API.post(`users/forgot/${this.props.match.params.token}`, data).then((res) => {
            console.log(res)
            this.setState({
                loadingDB: false,
                showsuccess: true
            })
        })
    }

    render() {
        const { classes } = this.props;
        const { auth, anchorEl, loadingDB } = this.state
        const open = Boolean(anchorEl);
        if(!auth) return <Redirect to='/'/> 
        return(
            <div class="content-start">
                <Header/>
                <Loading loaded={loadingDB}/>
                <ValidatorForm
                    ref="form"
                    onSubmit={this.onSubmit}
                    onError={errors => console.log(errors)}
                >
                <Grid container spacing={0} justify="center">
                    <Grid item xs={10} sm={9} md={8} lg={5}>
                        <Paper className={classes.paper}>
                            <Grid container spacing={12}>
                                <Grid item xs={9} sm={10} md={10} lg={10} style={{padding: 10}}>
                                    <Typography variant="h4" gutterBottom align="center">
                                        <FormattedMessage id="profile.information"/>
                                    </Typography>
                                </Grid>
                                <Grid item xs style={{padding: 10}}>
                                    <IconButton
                                        aria-label="More"
                                        aria-owns={open ? 'long-menu' : undefined}
                                        aria-haspopup="true"
                                        onClick={this.handleClick}
                                        >
                                        <MoreVertIcon />
                                        </IconButton>
                                    <Menu
                                        id="long-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={this.handleClose}
                                        PaperProps={{
                                            style: {
                                            maxHeight: ITEM_HEIGHT * 4.5,
                                            width: 200,
                                            },
                                        }}
                                        >
                                        <MenuItem component={Link} onClick={this.handleClose} to='/profile'>
                                            <FormattedMessage id="profile.profile"/>
                                        </MenuItem>
                                    </Menu>
                                </Grid>
                            </Grid>
                            <Grid container spacing={24} alignItems="flex-end" style={{marginTop: 20}}>
                                <Grid item xs={12} sm={1}>
                                    <VpnKey className={classes.ic}/>
                                </Grid>
                                <Grid item xs={12} md>
                                    <TextValidator
                                        name="password"
                                        label={<FormattedMessage id="input.password"/>}
                                        type="password"
                                        fullWidth
                                        value={this.state.password}
                                        onChange={this.handleChange('password')}
                                        validators={['required', 'isPassword']}
                                        errorMessages={['this field is required',
                                        'Password must be more 8 characters and contains one lowercase and uppercase \n Example. Kaidelivery2561']}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={24} alignItems="flex-end" style={{marginTop: 20}}>
                                <Grid item xs={12} sm={1}>
                                    <VpnKey className={classes.ic}/>
                                </Grid>
                                <Grid item xs={12} md>
                                    <TextValidator
                                        name="confirm"
                                        label={<FormattedMessage id="input.confirmpassword"/>}
                                        type="password"
                                        fullWidth
                                        value={this.state.confirm}
                                        onChange={this.handleChange('confirm')}
                                        validators={['required', 'isPasswordMatch']}
                                        errorMessages={['this field is required',
                                        'Password mismatch']}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item style={{marginTop: 30}}>
                                <Button type="submit" variant="contained" fullWidth className={classes.btSave}>
                                    <FormattedMessage id="profile.save"/>
                                </Button>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
                </ValidatorForm>
                <SweetAlert
                    show={this.state.showsuccess}
                    title="Succuess"
                    text="Updated password success."
                    type="success"
                    onConfirm={() => this.setState({ showsuccess: false })}
                    onEscapeKey={() => this.setState({ showsuccess: false })}
                    onOutsideClick={() => this.setState({ showsuccess: false })}
                />
            </div>
        )
    }
}

ForgotPassword.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(withRules(ForgotPassword))