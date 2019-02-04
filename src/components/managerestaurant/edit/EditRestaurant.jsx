import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router-dom'
import moment from 'moment';
import 'moment/locale/th';
import AutocompleteResTypes from '../create/AutocompleteResTypes'
import ValidatedTimePicker from '../../validations/ValidatedTimePicker'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Comment from '@material-ui/icons/Comment';
import Description from '@material-ui/icons/Description';
import MobileFriendly from '@material-ui/icons/MobileFriendly';
import Email from '@material-ui/icons/Email';
import Divider from '@material-ui/core/Divider';
import API from '../../../helper/api'
import Button from '@material-ui/core/Button';
import { Color } from '../../../variable/Color';
import withRules from '../../validations/validate'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import GoogleMaps from '../create/GoogleMaps'
import MomentUtils from '@date-io/moment';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import SweetAlert from 'sweetalert-react';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import scriptLoader from 'react-async-script-loader';

// set locale th
moment.locale('th')

const { StandaloneSearchBox } = require("react-google-maps/lib/components/places/StandaloneSearchBox");
const _ = require("lodash");

const MapWithAMarker = withGoogleMap(props =>
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={17}
    center={{ lat: props.center.lat, lng: props.center.lng }}
    onClick={props.onMapClick}
    onDragEnd={props.onDragEnd}
    defaultOptions={{
        streetViewControl: false,
        scaleControl: false,
        mapTypeControl: false,
        panControl: false,
        rotateControl: false,
        fullscreenControl: false
    }}
    disableDefaultUI
  >
    <Marker
      position={{ lat: props.center.lat, lng: props.center.lng }}
    />
    {
        props.loading &&
        <div className="loading-google">
            <div className="loading-google-spin">
            </div>
        </div>
    }
  </GoogleMap>
);

const styles = theme => ({
    root: {
        flexGrow: 1,
        paddingTop: 30,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    cssFocused: {},
        cssOutlinedInput: {
            '&$cssFocused $notchedOutline': {
            borderColor: Color.kaidelivery,
        },
    },
    notchedOutline: {},
    styleIcTel: {
        textAlign: 'left',
        [theme.breakpoints.up('xs')]: {
            textAlign: 'center',
            paddingLeft: '20px !important'
        },
        [theme.breakpoints.up('md')]: {
            textAlign: 'center',
            paddingLeft: '30px !important'
        },
    },
    logo: {
        width: 150,
        height: 150,
        margin: '0 auto'
    },
    hiddenInput: {
        display: 'none'
    },
    undoImage: {
        top: 0
    },
    iconRedo: {
        cursor: 'pointer',
        color: red[400],
        '&:hover': {
            color: red[300]
        }
    }
});

class EditRestaurant extends Component {

    constructor(props) {
        super(props);
         this.state = { 
            old_resname: '',
            res_name: '',
            res_email: '',
            res_tel: {
                res_tel1: '', 
               res_tel2: '',
               res_tel3: '',
            },
            my_tel: {
                my_tel1: '',
                my_tel2: '',
                my_tel3: '',
            },
            res_details: '',
            res_address: '',
            loading: true, 
            open: false, 
            type: 'info',
            text: 'Do you need insert ?',
            title: 'Warning',
            res_open: new Date(),
            res_close: new Date(),
            res_holiday: [],
            res_types: [],
            res_typesValue: [],
            res_position: [],
            fileimg: null, 
            preview: '', 
            altimg: '',
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.res_name !== nextState.res_name) {
            return true
        }
        if (this.state.res_email !== nextState.res_email) {
            return true
        }
        if (this.state.res_tel.res_tel1 !== nextState.res_tel.res_tel1) {
            return true
        }
        if (this.state.res_tel.res_tel2 !== nextState.res_tel.res_tel2) {
            return true
        }
        if (this.state.res_tel.res_tel3 !== nextState.res_tel.res_tel3) {
            return true
        }
        if (this.state.my_tel.my_tel1 !== nextState.my_tel.my_tel1) {
            return true
        }
        if (this.state.my_tel.my_tel2 !== nextState.my_tel.my_tel2) {
            return true
        }
        if (this.state.my_tel.my_tel3 !== nextState.my_tel.my_tel3) {
            return true
        }
        if (this.state.res_details !== nextState.res_details) {
            return true
        }
        if (this.state.res_address !== nextState.res_address) {
            return true
        }
        if (moment(this.state.res_open).format('h:mma') !== moment(nextState.res_open).format('h:mma')) {
            return true
        }
        if (moment(this.state.res_close).format('h:mma') !== moment(nextState.res_close).format('h:mma')) {
            return true
        }
        if (this.state.res_holiday.length !== nextState.res_holiday.length) {
            return true
        }
        if (this.state.res_types.length !== nextState.res_types.length) {
            return true
        }
        if (this.state.res_typesValue.length !== nextState.res_typesValue.length) {
            return true
        }
        if (this.state.open !== nextState.open) {
            return true
        }
        if (this.state.loading !== nextState.loading) {
            return true
        }
        if (this.state.type !== nextState.type) {
            return true
        }
        if (this.state.title !== nextState.title) {
            return true
        }
        if (this.state.text !== nextState.text) {
            return true
        }
        if (this.state.fileimg !== nextState.fileimg) {
            return true
        }
        if (this.state.preview !== nextState.preview) {
            return true
        }
        if (this.state.altimg !== nextState.altimg) {
            return true
        }
        return false
    }

    async componentDidMount() {
        await this.fetchRestaurantTypes()
        await this.fetchRestaurantData()
        
        ValidatorForm.addValidationRule('openTime', (value) => {
            if(moment(value).format('h:mma') === moment(this.state.res_close).format('h:mma')) {
                return false
            }
            return true
        })

        ValidatorForm.addValidationRule('closeTime', (value) => {
            if(moment(value).format('h:mma') === moment(this.state.res_open).format('h:mma')) {
                return false
            }
            return true
        })

        ValidatorForm.addValidationRule('checkMyTelEmpty', (value) => {
            if(this.checkMyTelLength(value)) {
                return true
            }
            return false
        })

        ValidatorForm.addValidationRule('threeCanNull', (value) => {
            if(value.length > 0 && value.length < 3) {
                return false
            }
            return true
        })

        ValidatorForm.addValidationRule('fourCanNull', (value) => {
            if(value.length > 0 && value.length < 4) {
                return false
            }
            return true
        })
        
        this.onChangeValue = this.onChangeValue.bind(this)
    }

    checkMyTelLength = (value) => {
        if((this.state.my_tel.my_tel1.length === 0 &&
            this.state.my_tel.my_tel2.length === 0 &&
            this.state.my_tel.my_tel3.length === 0) ||
            (this.state.my_tel.my_tel1.length === 3 &&
            this.state.my_tel.my_tel2.length === 3 &&
            this.state.my_tel.my_tel3.length === 3) ||
            value.length === 3 || value.length === 4) {
                return true
        }
        return false
    }

    fetchRestaurantData = async () => {

        const resname = this.props.match.params.resname
        const restaurantvalue = await API.get(`restaurants/${resname}`)
        const { data } = await restaurantvalue
        const restaurant = data.data

        if(restaurant.length === 0) {
            this.props.history.push('/myrestaurant')
        } else {
            const old_resTypes = this.state.res_types
            const new_resTypes = old_resTypes.filter((cv) => {
                return restaurant.restype_id.find((e) => {
                    return cv.restype_id === e
                }) 
            }).map(item => { return {value: item.restype_id, label: item.restype_name } })

            const getlat = (restaurant.res_lat !== null ? restaurant.res_lat : 0)
            const getlng = (restaurant.res_lng !== null ? restaurant.res_lng : 0)
            
            this.setState({
                old_resname: restaurant.res_name,
                res_logo: restaurant.res_logo,
                res_name: restaurant.res_name,
                res_email: restaurant.res_email,
                res_details: restaurant.res_details,
                res_address: restaurant.res_address,
                res_open: new Date(`December 17, 1997 ${restaurant.res_open}`),
                res_close: new Date(`December 17, 1997 ${restaurant.res_close}`),
                res_holiday: restaurant.res_holiday,
                res_typesValue: new_resTypes,
                res_position: [getlat , getlng],
                loading: false
            }, () => {
                this.setTelephone(restaurant.res_telephone)
            })
        }
    }

    setTelephone = (telephone) => {
        if(telephone.length > 0) {
            this.setState({
                res_tel: {
                    res_tel1: telephone[0].substring(0, 3), 
                    res_tel2: telephone[0].substring(3, 6),
                    res_tel3: telephone[0].substring(6, 10),
                },
                my_tel: {
                    my_tel1: (telephone[1] ? telephone[1].substring(0, 3) : ''),
                    my_tel2: (telephone[1] ? telephone[1].substring(3, 6) : ''),
                    my_tel3: (telephone[1] ? telephone[1].substring(6, 10) : ''),
                },
            })
        }
    }

    fetchRestaurantTypes = async () => {
        const resTypes = await API.get('restauranttypes/')
        const { data } = await resTypes
        this.setState({ res_types: data.data })
    }

    handleDateChange = name => date => {
        this.setState({
            [name] : date
        });
    };

    handleHoliday = event => {
        const { res_holiday } = this.state
        const item = event.target.value
        let newArr = []

        if(!res_holiday.includes(item)) {
            newArr = [...res_holiday, item]
        } else {    
            newArr = res_holiday.filter(a => a !== item)
        }

        this.setState({
            res_holiday: newArr
        });
    }

    onChangeValue = name => event => {
        this.setState({
            [name]: event.target.value
        })
    }

    onBlur = name => event => {
        switch (name) {
            case 'my_tel1':
                if((!this.refs.mySlotTwo.validate(this.state.my_tel.my_tel2) || 
                !this.refs.mySlotThree.validate(this.state.my_tel.my_tel3)) &&
                this.refs.mySlotOne.validate(this.state.my_tel.my_tel1)) {
                    this.validateMyTel()
                }
                break;
            case 'my_tel2':
                if((!this.refs.mySlotOne.validate(this.state.my_tel.my_tel1) || 
                !this.refs.mySlotThree.validate(this.state.my_tel.my_tel3)) &&
                this.refs.mySlotTwo.validate(this.state.my_tel.my_tel2)) {
                    this.validateMyTel()
                }
                break;
            case 'my_tel3':
                if((!this.refs.mySlotOne.validate(this.state.my_tel.my_tel1) || 
                !this.refs.mySlotTwo.validate(this.state.my_tel.my_tel2)) &&
                this.refs.mySlotThree.validate(this.state.my_tel.my_tel3)) {
                    this.validateMyTel()
                }
                break;
            default:
                break;
        }
    }

    validateMyTel = () => {
        this.refs.mySlotOne.validate(this.state.my_tel.my_tel1)
        this.refs.mySlotTwo.validate(this.state.my_tel.my_tel2)
        this.refs.mySlotThree.validate(this.state.my_tel.my_tel3)
    }

    onChangeResTel = name => event => {
        if(name === 'res_tel1' && event.target.value.length === 3) {
            this.resSlotTwo.focus()
        }
        if(name === 'res_tel2' && event.target.value.length === 3) {
            this.resSlotThree.focus()
        }

        this.setState({
            res_tel: {
                ...this.state.res_tel,
                [name]: event.target.value
            }
        })
    }

    onChangeMyTel = name => event => {
        if(name === 'my_tel1' && event.target.value.length === 3) {
            this.mySlotTwo.focus()
        }
        if(name === 'my_tel2' && event.target.value.length === 3) {
            this.mySlotThree.focus()
        }

        this.setState({
            my_tel: {
                ...this.state.my_tel,
                [name]: event.target.value
            }
        })
    }

    onTelephoneRestaurantDown = name => event => {
        if(event.keyCode === 8) {
            if(name === 'res_tel2' && event.target.value.length === 0) {
                this.resSlotOne.focus()
            }
            if(name === 'res_tel3' && event.target.value.length === 0) {
                this.resSlotTwo.focus()
            }
        }
    }

    onTelephoneContactDown = name => event => {
        if(event.keyCode === 8) {
            if(name === 'my_tel2' && event.target.value.length === 0) {
                this.mySlotOne.focus()
            }
            if(name === 'my_tel3' && event.target.value.length === 0) {
                this.mySlotTwo.focus()
            }
        }
    }

    setResTypesValueFromChild = (value) => {
        this.setState({
            res_typesValue: value
        }, () => console.log(this.state.res_typesValue))
    }

    setLatLngValue = (position) => {
        const pos = [position.lat, position.lng]
        this.setState({ res_position: pos})
    }

    onSubmit = async () => {
        this.setState({
            open: false,
            loading: true
        }, async () => {
            
            const { old_resname, res_name, res_email, res_tel, my_tel, res_details, res_address, res_open, res_close, res_holiday, res_typesValue, res_position, fileimg } = this.state

            const resTelephone = res_tel.res_tel1 + res_tel.res_tel2 + res_tel.res_tel3
            const myTelephone = (my_tel.my_tel1.length > 0 ? my_tel.my_tel1 + my_tel.my_tel2 + my_tel.my_tel3 : '')

            const telephone = [resTelephone, myTelephone]
            const restypesValue = res_typesValue.map(item => item.value)

            let bodyFormData = new FormData()
            bodyFormData.set('res_name', res_name)
            bodyFormData.set('res_email', res_email)
            bodyFormData.set('res_telephone', JSON.stringify(telephone))
            bodyFormData.set('res_details', res_details)
            bodyFormData.set('res_address', res_address)
            bodyFormData.set('res_open', moment(res_open).format('HH:mm'))
            bodyFormData.set('res_close', moment(res_close).format('HH:mm'))
            bodyFormData.set('res_holiday', (res_holiday.length > 0 ? JSON.stringify(res_holiday) : null))
            bodyFormData.set('res_typesValue', (restypesValue.length > 0 ? JSON.stringify(restypesValue) : null))
            bodyFormData.set('res_lat', res_position[0])
            bodyFormData.set('res_lng', res_position[1])
            bodyFormData.append('image', fileimg)

            await API.post(`/restaurants/update/${old_resname}`, bodyFormData, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
            .then((res) => {
                this.setState({
                    loading: false,
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            type: 'success',
                            text: 'Updated successful',
                            title: 'Success',
                            open: true
                        })
                    }, 100);
                })
            })
            .catch(err => console.log(err))
        })
    }

    sweetalert = () => {
        const { type } = this.state
        if(type === 'success') {
            this.setState({
                open: false
            }, () => {
                setTimeout(() => {
                    this.props.changeValueComponent(1)
                }, 100);
            })
        } 
        if (type === 'info' ){
            this.onSubmit()
        }
    }

    redoImage = () => {
        this.setState({
            preview: '',
            fileimg: null,
            altimg: ''
        })
    }
    
    handleImageChange = (e) => {
        const reader = new FileReader()
        const file = e.target.files[0]

        reader.onloadend = () => {
            this.setState({
                fileimg: file,
                preview: reader.result,
                altimg: file.name
            })
        }

        reader.readAsDataURL(file)
    }

    handleSubmit = (e) => {
        e.preventDefault()

        this.setState({
            open: true
        }) 
    }

    render() {
        const { classes } = this.props;
        const { res_logo, preview, altimg } = this.state
        const getImage = `http://localhost:3000/restaurants/${(res_logo ? res_logo : 'noimg.png')}`
        const showImage = (preview !== '' ? preview : getImage)
        const altImage = (preview !== '' ? altimg : getImage)
        return (
            <div className={classes.root}>
                <ValidatorForm
                    ref="form"
                    onSubmit={this.handleSubmit}
                    onError={errors => console.log(errors)}
                >
                    <Paper className={classes.paper}>
                        <Grid container spacing={24} style={{paddingTop: 30, paddingBottom: 30}}>
                            <Grid item container>
                                <Typography variant="h4" gutterBottom align="left">
                                    {`${this.state.old_resname} details`}
                                </Typography>
                                <Divider style={{width: '100%'}}/>
                            </Grid>
                            <Grid item xs={12} container justify="center">
                                <Grid item xs={12}>
                                    <div className="circle">
                                        <img className="profile-pic" src={showImage} alt={altImage}/>
                                        <Typography variant="caption" gutterBottom style={{color: green[300], display: 'inline', position: 'absolute', bottom: 0,marginLeft: 20}}>
                                            *Optional
                                        </Typography>            
                                        <div className={`p-image ${classes.undoImage}`}>
                                            <i className={`fas fa-redo upload-button icon-image ${classes.iconRedo}`} onClick={() => this.redoImage()}><span className="icon-text">Redo Image</span></i>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs style={{marginTop: 15}}>
                                     <input
                                        accept="image/*"
                                        className={classes.hiddenInput}
                                        id="images"
                                        type="file"
                                        onChange={(e) => this.handleImageChange(e)}
                                    />
                                    <label htmlFor="images">
                                        <Button  variant="contained" color="secondary" component="span">
                                            Browse
                                        </Button>
                                    </label>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container>
                                <Grid item container alignItems="flex-end" spacing={24}>
                                    <Grid item xs={1}>
                                        <Email className={"ic-color"}/>
                                    </Grid>
                                    <Grid item xs>
                                        <TextValidator 
                                            name="res_name" 
                                            label="Restaurant Name" 
                                            value={this.state.res_name} 
                                            onChange={this.onChangeValue('res_name')} 
                                            validators={['required']}
                                            errorMessages={['this field is required']}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container>
                                <Grid item container alignItems="flex-end" spacing={24}>
                                    <Grid item xs={1}>
                                        <Description className={"ic-color"}/>
                                    </Grid>
                                    <Grid item xs>
                                        <TextValidator 
                                            name="res_email" 
                                            label="Email" 
                                            value={this.state.res_email} 
                                            onChange={this.onChangeValue('res_email')} 
                                            validators={['required', 'isEmail']}
                                            errorMessages={['this field is required', 'email is invalid']}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container style={{marginTop: 15}}>
                                <Grid item container xs={12} md={6} alignItems="flex-start" spacing={24}>
                                    <Grid item xs={2} className={classes.styleIcTel}>
                                        <MobileFriendly className={"ic-color"}/>
                                    </Grid>
                                    <Grid item xs align="left"> 
                                        <Grid item>
                                            <Typography variant="subtitle1" gutterBottom>
                                                    Restaurant Number 
                                                <Typography variant="caption" gutterBottom style={{color: red[300], display: 'inline', marginLeft: 20}}>
                                                    *Required
                                               </Typography>
                                            </Typography>
                                        </Grid>
                                        <Grid container item xs spacing={24} style={{marginTop:10}}>
                                                        <Grid item xs={12} md={3}>
                                                            <TextValidator
                                                                name="res_tel1"
                                                                value={this.state.res_tel.res_tel1}
                                                                InputProps={{
                                                                    classes: {
                                                                        root: classes.cssOutlinedInput,
                                                                        focused: classes.cssFocused,
                                                                        notchedOutline: classes.notchedOutline,
                                                                    },
                                                                }}
                                                                label="Telephone"
                                                                variant="outlined"
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                                inputRef={(input) => { this.resSlotOne = input; }}
                                                                onChange={this.onChangeResTel('res_tel1')}
                                                                onInput={(e) => {
                                                                    e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 3)
                                                                }}
                                                                validators={['required', 'threeCharacters']}
                                                                errorMessages={['this field is required', 'Invalid data']}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} md={3}>
                                                            <TextValidator
                                                                name="res_tel2"
                                                                value={this.state.res_tel.res_tel2}
                                                                InputProps={{
                                                                    classes: {
                                                                        root: classes.cssOutlinedInput,
                                                                        focused: classes.cssFocused,
                                                                        notchedOutline: classes.notchedOutline,
                                                                    },
                                                                }}
                                                                variant="outlined"
                                                                inputRef={(input) => { this.resSlotTwo = input; }}
                                                                onChange={this.onChangeResTel('res_tel2')}
                                                                onKeyDown={this.onTelephoneRestaurantDown('res_tel2')}
                                                                onInput={(e) => {
                                                                    e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 3)
                                                                }}
                                                                validators={['required', 'threeCharacters']}
                                                                errorMessages={['this field is required', 'Invalid data']}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} md={4}>
                                                            <TextValidator
                                                                name="res_tel3"
                                                                value={this.state.res_tel.res_tel3}
                                                                InputProps={{
                                                                    classes: {
                                                                        root: classes.cssOutlinedInput,
                                                                        focused: classes.cssFocused,
                                                                        notchedOutline: classes.notchedOutline,
                                                                    },
                                                                }}
                                                                variant="outlined"
                                                                inputRef={(input) => { this.resSlotThree = input; }}
                                                                onChange={this.onChangeResTel('res_tel3')}
                                                                onKeyDown={this.onTelephoneRestaurantDown('res_tel3')}
                                                                onInput={(e) => {
                                                                    e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4)
                                                                }}
                                                                validators={['required', 'fourCharacters']}
                                                                errorMessages={['this field is required', 'Invalid data']}
                                                            />
                                                        </Grid>
                                                </Grid>
                                            </Grid>
                                </Grid>
                                <Grid item container xs={12} md={6} alignItems="flex-start" spacing={24}>
                                    <Grid item xs={2} className={classes.styleIcTel}>
                                        <MobileFriendly className={"ic-color"}/>
                                    </Grid>
                                    <Grid item xs align="left"> 
                                        <Grid item>
                                            <Typography variant="subtitle1" gutterBottom>
                                                    Contact Number 
                                                <Typography variant="caption" gutterBottom style={{color: green[300], display: 'inline', marginLeft: 20}}>
                                                    *Optional
                                               </Typography>
                                            </Typography>
                                        </Grid>
                                        <Grid container item xs spacing={24} style={{marginTop:10}}>
                                                        <Grid item xs={12} md={3}>
                                                             <TextValidator
                                                                ref="mySlotOne"
                                                                name="my_tel1"
                                                                value={this.state.my_tel.my_tel1}
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
                                                                inputRef={(input) => { this.mySlotOne = input; }}
                                                                onChange={this.onChangeMyTel('my_tel1')}
                                                                onBlur={this.onBlur('my_tel1')}
                                                                onInput={(e) => {
                                                                    e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 3)
                                                                }}
                                                                validators={['checkMyTelEmpty', 'threeCanNull']}
                                                                errorMessages={['this field is required', 'Invalid data']}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} md={3}>
                                                             <TextValidator
                                                                ref="mySlotTwo"
                                                                name="my_tel2"
                                                                value={this.state.my_tel.my_tel2}
                                                                InputProps={{
                                                                    classes: {
                                                                        root: classes.cssOutlinedInput,
                                                                        focused: classes.cssFocused,
                                                                        notchedOutline: classes.notchedOutline,
                                                                    },
                                                                }}
                                                                variant="outlined"
                                                                inputRef={(input) => { this.mySlotTwo = input; }}
                                                                onChange={this.onChangeMyTel('my_tel2')}
                                                                onBlur={this.onBlur('my_tel2')}
                                                                onKeyDown={this.onTelephoneContactDown('my_tel2')}
                                                                onInput={(e) => {
                                                                    e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 3)
                                                                }}
                                                                validators={['checkMyTelEmpty', 'threeCanNull']}
                                                                errorMessages={['this field is required', 'Invalid data']}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} md={4}>
                                                             <TextValidator
                                                                ref="mySlotThree"
                                                                name="my_tel3"
                                                                value={this.state.my_tel.my_tel3}
                                                                InputProps={{
                                                                    classes: {
                                                                        root: classes.cssOutlinedInput,
                                                                        focused: classes.cssFocused,
                                                                        notchedOutline: classes.notchedOutline,
                                                                    },
                                                                }}
                                                                variant="outlined"
                                                                inputRef={(input) => { this.mySlotThree = input; }}
                                                                onChange={this.onChangeMyTel('my_tel3')}
                                                                onBlur={this.onBlur('my_tel3')}
                                                                onKeyDown={this.onTelephoneContactDown('my_tel3')}
                                                                onInput={(e) => {
                                                                    e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4)
                                                                }}
                                                                validators={['checkMyTelEmpty', 'fourCanNull']}
                                                                errorMessages={['this field is required', 'Invalid data']}
                                                            />
                                                        </Grid>
                                                </Grid>
                                            </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container>
                                <Grid item container alignItems="flex-end" spacing={24}>
                                    <Grid item xs={1}>
                                        <Description className={"ic-color"}/>
                                    </Grid>
                                    <Grid item xs>
                                        <TextValidator 
                                            name="res_details" 
                                            label="Details" 
                                            value={this.state.res_details} 
                                            onChange={this.onChangeValue('res_details')} 
                                            validators={['required']}
                                            errorMessages={['this field is required']}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container>
                                <Grid item container alignItems="flex-end" spacing={24}>
                                    <Grid item xs={1}>
                                        <Comment className={"ic-color"}/>
                                    </Grid>
                                    <Grid item xs>
                                        <TextValidator 
                                            name="res_address" 
                                            label="Address" 
                                            value={this.state.res_address} 
                                            multiline
                                            rows="3"
                                            onChange={this.onChangeValue('res_address')} 
                                            validators={['required']}
                                            errorMessages={['this field is required']}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container>
                                <Grid item container>
                                    <Typography variant="h6" gutterBottom align="left">
                                        Types of restaurant
                                    </Typography>
                                </Grid>
                                <Grid item container alignItems="flex-end" spacing={24}>
                                    <Grid item xs={1}>
                                            <Email className={"ic-color"}/>
                                        </Grid>
                                    <Grid item xs>
                                        <AutocompleteResTypes 
                                            resTypes={this.state.res_types} 
                                            setResTypesValueFromChild={this.setResTypesValueFromChild} 
                                            loading={this.state.loading}
                                            data={this.state.res_typesValue}
                                        /> 
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container>
                                <Grid item container>
                                    <Typography variant="h6" gutterBottom align="left">
                                        Choose the opening time 
                                    </Typography>
                                </Grid>
                                <Grid item container alignItems="flex-end" spacing={24}>
                                   <MuiPickersUtilsProvider utils={MomentUtils} locale={'th'} moment={moment}>
                                        <Grid item xs={1}>
                                            <Email className={"ic-color"}/>
                                        </Grid>
                                        <Grid item xs={3} md={3} align="left">
                                            <ValidatedTimePicker
                                                name="res_open"
                                                value={this.state.res_open}
                                                onChange={this.handleDateChange('res_open')}
                                                ampm={false}
                                                format="HH:mm น."
                                                validators={['openTime']}
                                                errorMessages={['open time cannot less than close time']}
                                            />
                                        </Grid>
                                        <Grid item xs={1} md={1} align="left">
                                        <Typography variant="h6" gutterBottom align="left">
                                                to
                                        </Typography>
                                        </Grid>
                                        <Grid item xs={3} md={3} align="left">
                                            <ValidatedTimePicker
                                                name="res_close"
                                                value={this.state.res_close}
                                                onChange={this.handleDateChange('res_close')}
                                                ampm={false}
                                                format="HH:mm น."
                                                validators={['closeTime']}
                                                errorMessages={['close time cannot less than open time']}
                                            />
                                        </Grid>
                                    </MuiPickersUtilsProvider>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container>
                                <Grid item container>
                                    <Typography variant="h6" gutterBottom align="left">
                                        Choose the holiday
                                    </Typography>
                                </Grid>
                                <Grid item container alignItems="flex-end" spacing={24}>
                                   <Grid item xs={1}>
                                        <Email className={"ic-color"}/>
                                    </Grid>
                                    <Grid item xs align="left">
                                        <FormControlLabel
                                        control={
                                            <Checkbox
                                            onChange={this.handleHoliday}
                                            value="จ"
                                            checked={(this.state.res_holiday.includes('จ'))}
                                            />
                                        }
                                        label="จันทร์"
                                        />
                                        <FormControlLabel
                                        control={
                                            <Checkbox
                                            onChange={this.handleHoliday}
                                            value="อ"
                                            checked={(this.state.res_holiday.includes('อ'))}
                                            />
                                        }
                                        label="อังคาร"
                                        />
                                        <FormControlLabel
                                        control={
                                            <Checkbox
                                            onChange={this.handleHoliday}
                                            value="พ"
                                            checked={(this.state.res_holiday.includes('พ'))}
                                            />
                                        }
                                        label="พุธ"
                                        />
                                        <FormControlLabel
                                        control={
                                            <Checkbox
                                            onChange={this.handleHoliday}
                                            value="พฤ"
                                            checked={(this.state.res_holiday.includes('พฤ'))}
                                            />
                                        }
                                        label="พฤหัสบดี"
                                        />
                                        <FormControlLabel
                                        control={
                                            <Checkbox
                                            onChange={this.handleHoliday}
                                            value="ศ"
                                            checked={(this.state.res_holiday.includes('ศ'))}
                                            />
                                        }
                                        label="ศุกร์"
                                        />
                                        <FormControlLabel
                                        control={
                                            <Checkbox
                                            onChange={this.handleHoliday}
                                            value="ส"
                                            checked={(this.state.res_holiday.includes('ส'))}
                                            />
                                        }
                                        label="เสาร์"
                                        />
                                        <FormControlLabel
                                        control={
                                            <Checkbox
                                            onChange={this.handleHoliday}
                                            value="อา"
                                            checked={(this.state.res_holiday.includes('อา'))}
                                            />
                                        }
                                        label="อาทิตย์"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container>
                                <Grid item container>
                                    <Typography variant="h6" gutterBottom align="left">
                                        Find your restaurant and mark it
                                    </Typography>
                                </Grid>
                                <Grid item container alignItems="flex-end" spacing={24}>
                                    <Grid item xs={1}>
                                        <Email className={"ic-color"}/>
                                    </Grid>
                                    <Grid item xs>
                                         <GoogleMaps key="map" lat={this.state.res_position[0]} showed={false} lng={this.state.res_position[1]} onClickCurrentLocation={this.getGeoLocation} setPosition={this.setLatLngValue}/>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container spacing={0} alignItems="flex-end" justify = "center" style={{marginTop: 20}}>
                                <Grid item xs={4}>
                                    <Button type="submit" variant="contained" color="primary">
                                        Save
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </ValidatorForm>
                <SweetAlert
                    show={this.state.open}
                    title={this.state.title}
                    text={this.state.text}
                    type={this.state.type}
                    onConfirm={() => { if(this.state.open) this.sweetalert() }}
                    onEscapeKey={() => { if(this.state.open) this.setState({open: !this.state.open}) }}
                    onOutsideClick={() => { if(this.state.open) this.setState({open: !this.state.open}) }}
                />
            </div>
        );
    }
}

EditRestaurant.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(withRules(EditRestaurant)));