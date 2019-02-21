import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography';
import Restaurant from '@material-ui/icons/Restaurant';
import Divider from '@material-ui/core/Divider';
import API from '../../../helper/api'
import SweetAlert from 'sweetalert-react';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import './button.scss'
import { connect } from 'react-redux'
import { updateRestaurantName } from '../../../actions/restaurant'
import Loading from '../../loaders/loading'
import green from '@material-ui/core/colors/green';

const styles = theme => ({
  root: {
    flexGrow: 1,
    paddingTop: 30
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

class OneStepInput extends Component {

    constructor(props) {
        super(props);
         this.state = { 
            res_name: '',
            fileimg: null, 
            preview: '', 
            altimg: '', 
            confirmAlert: false, 
            successAlert: false,
            open: false, 
            text: '',
        };
    }

    onChangeValue = name => event => {
        this.setState({
            [name]: event.target.value
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

    saveData = () => {
        this.setState({
            confirmAlert: false,
            loading: true
        }, async () => {
            if(!this.state.confirmAlert) {
                let bodyFormData = new FormData()
                bodyFormData.set('res_name', this.state.res_name)
                bodyFormData.append('image', this.state.fileimg)
    
                await API.post('restaurants/create/owner', bodyFormData, {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                })
                .then((rest) => {
                    console.log('mean')
                    console.log(rest)
                    setTimeout(() => {
                        this.setState({
                            loading: false,
                            successAlert: true
                        })
                    }, 100);
                })
                .catch(err => console.log(err))
            }
      
        })
    }

    afterSubmit = () => {
        this.setState({
            successAlert: false
        }, () => {
            this.props.updateRestaurantName(true)
            this.props.setResName(this.state.res_name)
            this.props.handleNext()
        })
    }

    submit = (e) => {
        e.preventDefault()

        this.setState({confirmAlert: true})
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                { (this.state.loading ? <Loading loaded={this.state.loading} /> : '')}
                <ValidatorForm
                    ref="form"
                    onSubmit={this.submit}
                    onError={errors => console.log(errors)}
                >
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Typography variant="h4" gutterBottom align="left">
                                Let's create a restaurant.
                            </Typography>
                            <Divider />
                            <Grid item xs={12} sm={12} style={{marginTop: 30}}>       
                                <div className="circle">
                                    <img className="profile-pic" src={this.state.preview} alt={this.state.altimg}/>
                                    <Typography variant="caption" gutterBottom style={{color: green[300], display: 'inline', position: 'absolute', bottom: 0,marginLeft: 20}}>
                                        *Optional
                                    </Typography>            
                                    <div className="p-image">
                                    <i className="fa fa-camera upload-button icon-image" onClick={() => this.imageInput.click()} style={{cursor:'pointer'}}><span className="icon-text">Choose Image</span></i>
                                        <input className="file-upload" type="file" accept="image/*" ref={input => this.imageInput = input} onChange={(e) => this.handleImageChange(e)} />
                                    </div>
                                </div>
                            </Grid>
                            <Grid container spacing={0} alignItems="flex-end" justify = "center" style={{marginTop: 20}}>
                                <Grid item xs={1}>
                                    <Restaurant className={"ic-color"}/>
                                </Grid>
                                <Grid item xs={11} md={3}>
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
                            <Grid container spacing={0} alignItems="flex-end" justify = "center" style={{marginTop: 20}}>
                                <Grid item xs={4}>
                                    <Button type="submit" variant="contained" color="primary">
                                        Save
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
                </ValidatorForm>
                <SweetAlert
                    show={this.state.confirmAlert}
                    title="Warning"
                    text="Do you need to insert ?"
                    type="warning"
                    showCancelButton
                    onConfirm={() => { this.saveData() }}
                    onCancel={() => { this.setState({confirmAlert: false})  }}
                    onEscapeKey={() => { this.setState({confirmAlert: false}) }}
                    onOutsideClick={() => {if(this.state.confirmAlert) { this.setState({confirmAlert: false}) }}}
                />
                <SweetAlert
                    show={this.state.successAlert}
                    title="Success"
                    text="Insert successful"
                    type="success"
                    onConfirm={() => { this.afterSubmit() }}
                    onEscapeKey={() => {if(this.state.successAlert) { this.setState({successAlert: false}) }}}
                    onOutsideClick={() => {if(this.state.successAlert) { this.setState({successAlert: false}) }}}
                />
            </div>
        );
    }
}

OneStepInput.propTypes = {
  classes: PropTypes.object.isRequired,
  handleNext: PropTypes.func.isRequired,
  updateRestaurantName: PropTypes.func.isRequired
};

export default connect(null, {updateRestaurantName: updateRestaurantName})(withStyles(styles)(OneStepInput));