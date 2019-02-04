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
            loading: false, 
            askopen: false,
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

    saveData = async () => {
        this.setState({
            askopen: false,
            loading: true
        }, async () => {
            let bodyFormData = new FormData()
            bodyFormData.set('res_name', this.state.res_name)
            bodyFormData.append('image', this.state.fileimg)

            await API.post('/restaurants/create', bodyFormData, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
            .then(() => {
                this.setState({
                    loading: false
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            open: true,
                            content: `${this.state.res_name} is available now !!`
                        })
                    }, 100); 
                })
            })
            .catch(err => console.log(err))
        })
    }

    closeAlert = () => {
        if(this.state.open) {
            this.setState({
                open: false,
                content: ``,
                title: '',
                type: '',
            }, () => {
                setTimeout(() => {
                    this.props.updateRestaurantName(true)
                    this.props.handleNext()
                    this.props.setResName(this.state.res_name)
                }, 100);
            })
        }
    }

    submit = (e) => {
        e.preventDefault()

        this.setState({askopen: true})
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
                    show={this.state.askopen}
                    title="Are you sure ?"
                    text={`You want to use ${this.state.res_name} to the restaurant name right ?`}
                    type="info"
                    onConfirm={() => this.saveData()}
                    onEscapeKey={() => this.setState({askopen: !this.state.askopen})}
                    onOutsideClick={() => { if(this.state.askopen) this.setState({askopen: !this.state.askopen}) }}
                />
                <SweetAlert
                    show={this.state.open}
                    title="Success"
                    text={this.state.content}
                    type="success"
                    onConfirm={() => { if(this.state.open) this.closeAlert() }}
                    onEscapeKey={() => { if(this.state.open) this.closeAlert() }}
                    onOutsideClick={() => { if(this.state.open) this.closeAlert() }}
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