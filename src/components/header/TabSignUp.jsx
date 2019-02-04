import React , { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import VpnKey from '@material-ui/icons/VpnKey';
import Face from '@material-ui/icons/Face';
import TextRotationNone from '@material-ui/icons/TextRotationNone';
import Email from '@material-ui/icons/Email';
import MobileFriendly from '@material-ui/icons/MobileFriendly';
import Comment from '@material-ui/icons/Comment';
import { Color } from '../../variable/Color';
import Button from '@material-ui/core/Button';
import { signup } from '../../actions/user'
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import withRules from '../validations/validate'
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl'
import API from '../../helper/api'

const styles = {
    container : {
        display: 'flex',
        flexWrap: 'wrap',
        padding: '40px 50px',
    },
    cssFocused: {},
    cssOutlinedInput: {
        '&$cssFocused $notchedOutline': {
            borderColor: Color.kaidelivery,
        },
    },
    notchedOutline: {},
    btRegister: {
        color: '#FAFAFA',
        backgroundColor: Color.registerButton,
        '&:hover': {
            backgroundColor: Color.registerButtonLight
        }
    }
}

class TabSignUp extends Component {

    constructor(props) {
        super(props)

        this.onSubmit = this.onSubmit.bind(this)
    }

    state = {
        username: '',
        password: '',
        confirm_password: '',
        name: '',
        lastname: '',
        email: '',
        telephone1: '',
        telephone2: '',
        telephone3: '',
        address: '',
        errusername: false,
        erremail: false
    }

    componentDidMount() {
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== this.state.password) {
                return false;
            }
            return true;
        });
    }

    handleChange = name => event => {
        if(name === 'telephone1' && event.target.value.length === 3) {
            this.slotTwo.focus()
        }
        if(name === 'telephone2' && event.target.value.length === 3) {
            this.slotThree.focus()
        }

        this.setState({
            [name]: event.target.value,
        });
    };

    handleBlurUsername = async (event) => {
        await API.post(`users/checkusername`, { username: event.target.value }).then(res => {
            this.setState({
                errusername: res.data.username
            })
        })
    }

    handleBlurEmail = async (event) => {
        await API.post(`users/checkemail`, { email: event.target.value }).then(res => {
            this.setState({
                erremail: res.data.email
            })
        })
    }

    onSubmit = async (e) => {
        e.preventDefault()

        if(this.state.errusername || this.state.erremail) {
            return
        }

        const tel = `${this.state.telephone1} ${this.state.telephone2} ${this.state.telephone3}`

        const data = {
            username: this.state.username,
            password: this.state.password,
            name: this.state.name,
            lastname: this.state.lastname,
            email: this.state.email,
            telephone: tel,
            address: this.state.address,
        }
        console.log(data)

        this.props.signup(data).then(() => this.props.history.push('/profile'))
    }

    onTelephoneKeyDown = name => event => {
        if(event.keyCode === 8) {
            if(name === 'telephone2' && event.target.value.length === 0) {
                this.slotOne.focus()
            }
            if(name === 'telephone3' && event.target.value.length === 0) {
                this.slotTwo.focus()
            }
        }
    }

    render() {
        const { classes } = this.props
        return(
            <ValidatorForm
                ref="form"
                onSubmit={this.onSubmit}
                onError={errors => console.log(errors)}
                className={classes.container}
            >
                <Grid container spacing={24} alignItems="flex-end">
                    <Grid item xs={12} sm={1}>
                        <AccountCircle style={{color: Color.kaideliveryLight}}/>
                    </Grid>
                    <Grid item xs={12} md>
                        <TextValidator 
                            error={this.state.errusername}
                            name="username" 
                            label={<FormattedMessage id="input.username" />}
                            fullWidth
                            value={this.state.username}
                            onChange={this.handleChange('username')}
                            onBlur={this.handleBlurUsername}
                            validators={['required', 'isUsername']}
                            helperText={this.state.errusername ? 'Username is exists' : ''}
                            errorMessages={['this field is required', 'username must be more 8 characters']}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={24} alignItems="flex-end" style={{marginTop: 20}}>
                    <Grid item xs={12} sm={1}>
                        <VpnKey className={"ic-color"}/>
                    </Grid>
                    <Grid item xs={12} md>
                        <TextValidator
                            name="password"
                            label={<FormattedMessage id="input.password" />}
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
                        <VpnKey className={"ic-color"}/>
                    </Grid>
                    <Grid item xs={12} md>
                        <TextValidator
                            name="confirm_password"
                            label="Confirm Password"
                            type="password"
                            fullWidth
                            value={this.state.confirm_password}
                            onChange={this.handleChange('confirm_password')}
                            validators={['required', 'isPasswordMatch']}
                            errorMessages={['this field is required',
                            'Password not match']}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={24} alignItems="flex-end" style={{marginTop: 20}}>
                    <Grid item xs={12} sm={1}>
                        <Face className={"ic-color"}/>
                    </Grid>
                    <Grid item xs={12} md>
                        <TextValidator
                            name="name"
                            label={<FormattedMessage id="input.name" />}
                            fullWidth
                            value={this.state.name}
                            onChange={this.handleChange('name')}
                            validators={['required']}
                            errorMessages={['this field is required']}
                        />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                        <TextRotationNone className={"ic-color"}/>
                    </Grid>
                    <Grid item xs={12} md>
                        <TextValidator
                            name="lastname"
                            label={<FormattedMessage id="input.lastname" />}
                            fullWidth
                            value={this.state.lastname}
                            onChange={this.handleChange('lastname')}
                            validators={['required']}
                            errorMessages={['this field is required']}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={24} alignItems="flex-end" style={{marginTop: 20}}>
                    <Grid item xs={12} sm={1}>
                        <Email style={{color: Color.kaideliveryLight}}/>
                    </Grid>
                    <Grid item xs={12} md>
                        <TextValidator
                            error={this.state.erremail}
                            name="email"
                            label={<FormattedMessage id="input.email" />}
                            fullWidth
                            value={this.state.email}
                            onChange={this.handleChange('email')}
                            onBlur={this.handleBlurEmail}
                            validators={['required', 'isEmail']}
                            helperText={this.state.erremail ? 'Email is exists' : ''}
                            errorMessages={['this field is required', 'email is not valid']}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={24} alignItems="flex-end" style={{marginTop: 20}}>
                    <Grid item lg={1} md>
                        <MobileFriendly className={"ic-color"}/>
                    </Grid>
                    <Grid item xs={12} md>
                        <TextValidator
                            name="telephone1"
                            value={this.state.telephone1}
                            InputProps={{
                                classes: {
                                    root: classes.cssOutlinedInput,
                                    focused: classes.cssFocused,
                                    notchedOutline: classes.notchedOutline,
                                },
                            }}
                            label={<FormattedMessage id="input.telephone" />}
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputRef={(input) => { this.slotOne = input; }}
                            onChange={this.handleChange('telephone1')}
                            onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 3)
                            }}
                            validators={['required', 'threeCharacters']}
                            errorMessages={['this field is required', 'Invalid data']}
                        />
                    </Grid>
                    <Grid item xs={12} md>
                        <TextValidator
                            name="telephone2"
                            value={this.state.telephone2}
                            InputProps={{
                                classes: {
                                    root: classes.cssOutlinedInput,
                                    focused: classes.cssFocused,
                                    notchedOutline: classes.notchedOutline,
                                },
                            }}
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputRef={(input) => { this.slotTwo = input; }}
                            onChange={this.handleChange('telephone2')}
                            onKeyDown={this.onTelephoneKeyDown('telephone2')}
                            onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 3)
                            }}
                            validators={['required', 'threeCharacters']}
                            errorMessages={['this field is required', 'Invalid data']}
                        />
                    </Grid>
                    <Grid item xs={12} md>
                        <TextValidator
                            name="telephone3"
                            value={this.state.telephone3}
                            InputProps={{
                                classes: {
                                    root: classes.cssOutlinedInput,
                                    focused: classes.cssFocused,
                                    notchedOutline: classes.notchedOutline,
                                },
                            }}
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputRef={(input) => { this.slotThree = input; }}
                            onChange={this.handleChange('telephone3')}
                            onKeyDown={this.onTelephoneKeyDown('telephone3')}
                            onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4)
                            }}
                            validators={['required', 'fourCharacters']}
                            errorMessages={['this field is required', 'Invalid data']}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={24} alignItems="flex-end" style={{marginTop: 20}}>
                    <Grid item xs={12} sm={1}>
                        <Comment className={"ic-color"}/>
                    </Grid>
                    <Grid item xs={12} md>
                        <TextValidator
                            name="address"
                            label={<FormattedMessage id="input.address" />}
                            fullWidth
                            value={this.state.address}
                            onChange={this.handleChange('address')}
                            multiline
                            variant="outlined"
                            InputProps={{
                                classes: {
                                    root: classes.cssOutlinedInput,
                                    focused: classes.cssFocused,
                                    notchedOutline: classes.notchedOutline,
                                },
                            }}  
                            InputLabelProps={{
                                shrink: true,
                            }}
                            rows={3}
                            validators={['required']}
                            errorMessages={['this field is required']}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={24} alignItems="flex-end" style={{marginTop: 30}}>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" fullWidth className={classes.btRegister}>
                            {<FormattedMessage id="popup.register" />}
                        </Button>
                    </Grid>
                </Grid>
            </ValidatorForm>
        )
    }
}

TabSignUp.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }),
    classes: PropTypes.object.isRequired,
    signup: PropTypes.func.isRequired
}

export default connect(null, { signup })(withStyles(styles)(withRules(withRouter(TabSignUp))))