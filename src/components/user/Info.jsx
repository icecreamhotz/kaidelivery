import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Face from '@material-ui/icons/Face';
import TextRotationNone from '@material-ui/icons/TextRotationNone';
import Email from '@material-ui/icons/Email';
import MobileFriendly from '@material-ui/icons/MobileFriendly';
import Comment from '@material-ui/icons/Comment';
import { Color } from '../../variable/Color';
import { LoaderInfo } from './loaderInfo'
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Loading from '../loaders/loading'
import SweetAlert from 'sweetalert-react';
import withRules from '../validations/validate'
import { FormattedMessage } from 'react-intl'
import API from '../../helper/api'
import { connect } from 'react-redux'
import { updateData } from '../../actions/user'

const styles = theme => ({
    paper: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 5,
        paddingBottom: theme.spacing.unit * 5,
    },
    bigAvatar: {
        width: 150,
        height: 150,
        margin: '0 auto'
    },
    input: {
        display: 'none',
    },
    ic: {
        color: Color.kaidelivery
    },
    cssFocused: {},
    cssOutlinedInput: {
        '&$cssFocused $notchedOutline': {
            borderColor: Color.kaidelivery,
        },
    },
    notchedOutline: {},
    btRegister: {
        backgroundColor: Color.registerButton,
        '&:hover': {
            backgroundColor: Color.registerButtonLight
        }
    },
    btSave: {
        color: '#FAFAFA',
        backgroundColor: Color.registerButton,
        '&:hover': {
            backgroundColor: Color.registerButtonLight
        }
    }
});

class Info extends Component {

    state = {
        name: '',
        lastname: '',
        email: '',
        myemail: '',
        telephone1: '',
        telephone2: '',
        telephone3: '',
        address: '',
        avatar: null,
        loadingContent: true,
        loadingDB: false,
        showsuccess: false,
        anchorEl: null,
        updated: false,
        showerremail: false,
    }

    async componentDidMount() {
        await API.get(`users/info`).then(res => {
            console.log(res)
            this.setState({
                name: res.data.user.name,
                lastname: res.data.user.lastname,
                email: res.data.user.email,
                myemail: res.data.user.email,
                avatar: res.data.user.avatar,
                image: null,
                preview: '',
                erremail: false,
                loadingContent: false,
            })
            if(res.data.user.telephone) {
                this.setState({
                    telephone1: res.data.user.telephone.substring(0,3),
                    telephone2: res.data.user.telephone.substring(3,6),
                    telephone3: res.data.user.telephone.substring(6,10),
                })
            }
            if(res.data.user.address) {
                this.setState({
                    address: res.data.user.address
                })
            }
        })
    }

    handleChange = name => event => {
        if(name === 'telephone1' && event.target.value.length === 3) {
            this.slotTwo.focus()
        }
        if(name === 'telephone2' && event.target.value.length === 3) {
            this.slotThree.focus()
        }

        this.setState({
            [name]: event.target.value
        })
    }

    handleBlurEmail = async (event) => {
        const email = event.target.value
        if(email === this.state.myemail) {
            return
        }
        await API.post(`users/checkemail`, { email: email }).then(res => {
            this.setState({
                erremail: res.data.email
            })
        })
    }

    handleImageChange = event => {
        event.preventDefault()

        const reader = new FileReader()
        const file = event.target.files[0]

        reader.onloadend = () => {
            this.setState({
                image: file,
                preview: reader.result
            })
        }

        reader.readAsDataURL(file)
    }

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    onInputTelephone = slot => event => {
        if(slot === 0 && event.target.value.length === 3) {
            this.slotTwo.focus()
        }
        if(slot === 1 && event.target.value.length === 3) {
            this.slotThree.focus()
        }
        const items = this.state.telephone
        items[slot] = event.target.value
        
        this.setState({
            telephone: items
        })
    }

    submitUpdate = async (e) => {
        e.preventDefault()

        this.setState({
            loadingDB: true
        })

        if(this.state.erremail) {
            this.setState({
                loadingDB: false,
                showerremail: true
            })
            return
        }

        const tel = this.state.telephone1 + this.state.telephone2 + this.state.telephone3

        let bodyFormData = new FormData()
        bodyFormData.set('name', this.state.name)
        bodyFormData.set('lastname', this.state.lastname)
        bodyFormData.set('email', this.state.email)
        bodyFormData.set('telephone', tel)
        bodyFormData.set('address', this.state.address)
        bodyFormData.append('image', this.state.image)

        await API.post(`users/update/info`, bodyFormData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }).then((res) => {
            this.setState({
                showsuccess: true,
                loadingDB: false,
                updated: true
            })
            this.props.updateData(true)
        })
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
        const { classes } = this.props;
        const { loadingContent, avatar, preview, loadingDB } = this.state
        if(loadingContent) { return <LoaderInfo /> }
        const getImage = `https://kaidelivery-api.herokuapp.com/users/${(avatar ? avatar : 'noimg.png')}`
        return(
            <div className="content-start">
                <Loading loaded={loadingDB}/>
                <ValidatorForm
                    ref="form"
                    onSubmit={this.submitUpdate}
                    onError={errors => console.log(errors)}
                >
                <Grid container spacing={0} justify="center">
                    <Grid item xs={10}>
                        <Paper className={classes.paper}>
                            <Grid container>
                                <Grid item xs={12} lg={3} style={{padding: 10}}>                            
                                    <Grid item xs={12}>
                                        <Avatar alt={this.state.name} src={(preview ? preview : getImage)} className={classes.bigAvatar} />
                                    </Grid>
                                    <Grid item xs={12} style={{marginTop: 30, textAlign: 'center'}}>
                                        <input
                                            accept="image/*"
                                            className={classes.input}
                                            id="images"
                                            type="file"
                                            onChange={(e) => this.handleImageChange(e)}
                                        />
                                        <label htmlFor="images">
                                            <Button  variant="contained" color="secondary" component="span">
                                                <FormattedMessage id="profile.browse" />
                                            </Button>
                                        </label>
                                    </Grid>
                                </Grid>
                                <Grid item xs style={{padding: 10}}>
                                    <Grid container justify="center">
                                    <Typography variant="h4" gutterBottom>
                                        <FormattedMessage id="profile.information" />
                                    </Typography>
                                         <Grid container spacing={24} alignItems="flex-end" style={{marginTop: 20}}>
                                            <Grid item xs={12} sm={1}>
                                                <Face className={classes.ic}/>
                                            </Grid>
                                            <Grid item xs={12} md>
                                                <TextValidator
                                                    name="name"
                                                    label={<FormattedMessage id="input.name" />}
                                                    fullWidth
                                                    value={this.state.name}
                                                    onChange={this.handleChange('name')}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    validators={['required']}
                                                    errorMessages={['this field is required']}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={1}>
                                                <TextRotationNone className={classes.ic}/>
                                            </Grid>
                                            <Grid item xs={12} md>
                                                <TextValidator
                                                    name="lastname"
                                                    label={<FormattedMessage id="input.lastname" />}
                                                    fullWidth
                                                    value={this.state.lastname}
                                                    onChange={this.handleChange('lastname')}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    validators={['required']}
                                                    errorMessages={['this field is required']}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={24} alignItems="flex-end" style={{marginTop: 20}}>
                                            <Grid item xs={1}>
                                                <Email className={classes.ic}/>
                                            </Grid>
                                            <Grid item xs={12} md={5}>
                                                <TextValidator
                                                    error={this.state.erremail}
                                                    name="email"
                                                    label={<FormattedMessage id="input.email" />}
                                                    fullWidth
                                                    value={this.state.email}
                                                    onChange={this.handleChange('email')}
                                                    onBlur={this.handleBlurEmail}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    validators={['required', 'isEmail']}
                                                    helperText={this.state.erremail ? 'Email is exists' : ''}
                                                    errorMessages={['this field is required', 'email is not valid']}
                                                />
                                            </Grid>
                                            <Grid item xs={1}>
                                                <MobileFriendly className={classes.ic}/>
                                            </Grid>
                                            <Grid item xs={12} sm md>
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
                                            <Grid item xs={12} sm md>
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
                                                    onChange={this.handleChange('telephone2')}
                                                    onKeyDown={this.onTelephoneKeyDown('telephone2')}
                                                    inputRef={(input) => { this.slotTwo = input; }}
                                                    onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 3)
                                                    }}
                                                    validators={['required', 'threeCharacters']}
                                                    errorMessages={['this field is required', 'Invalid data']}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm md>
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
                                                    onChange={this.handleChange('telephone3')}
                                                    onKeyDown={this.onTelephoneKeyDown('telephone3')}
                                                    inputRef={(input) => { this.slotThree = input; }}
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
                                                <Comment className={classes.ic}/>
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
                                        <Grid item style={{marginTop: 30}}>
                                            <Button type="submit" variant="contained" fullWidth className={classes.btSave}>
                                                {<FormattedMessage id="profile.save" />}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
                </ValidatorForm>
                <SweetAlert
                    show={this.state.showsuccess}
                    title="Succuess"
                    text="Updated data success."
                    type="success"
                    onConfirm={() => { if(this.state.showsuccess) { this.setState({ showsuccess: false } ) }}}
                    onEscapeKey={() => { if(this.state.showsuccess) { this.setState({ showsuccess: false } ) }}}
                    onOutsideClick={() => { if(this.state.showsuccess) { this.setState({ showsuccess: false } ) }}}
                />
                <SweetAlert
                    show={this.state.showerremail}
                    title="Error"
                    text="Email is exists."
                    type="error"
                    onConfirm={() => { if(this.state.showerremail) { this.setState({ showerremail: false } ) }}}
                    onEscapeKey={() => { if(this.state.showerremail) { this.setState({ showerremail: false } ) }}}
                    onOutsideClick={() => { if(this.state.showerremail) { this.setState({ showerremail: false } ) }}}
                />
            </div>
        )
    }
}

Info.propTypes = {
    classes: PropTypes.object.isRequired,
    updateData: PropTypes.func.isRequired
}

export default connect(null, {updateData: updateData})(withStyles(styles)(withRules(Info)))