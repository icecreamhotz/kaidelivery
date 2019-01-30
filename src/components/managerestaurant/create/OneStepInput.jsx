import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography';
import Restaurant from '@material-ui/icons/Restaurant';
import withRoot from '../../input/InputStyle';
import Alert from '../../loaders/Alert'
import Divider from '@material-ui/core/Divider';
import API from '../../../helper/api'
import SweetAlert from 'sweetalert-react';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import './button.scss'
import { connect } from 'react-redux'
import { updateRestaurantName } from '../../../actions/restaurant'

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
            fileimg: '', 
            preview: '', 
            altimg: '', 
            loading: true, 
            askopen: false,
            open: false, 
            text: '', 
            title: '', 
            type:'' 
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
                askopen: false
            })

            setTimeout(() => {
                this.setState({
                    open: true,
                    content: `${this.state.res_name} is available now !!`,
                    title: 'Success',
                    type: 'success',
                })
            }, 1000);
            
        })
        .catch(err => console.log(err))
    }

    closeAlert = () => {
        if(this.state.open) {
            this.setState({
                open: false,
                content: ``,
                title: '',
                type: '',
            }, () => {
                this.props.updateRestaurantName(true)
                this.props.handleNext()
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
                                <div class="circle">
                                    <img class="profile-pic" src={this.state.preview} alt={this.state.altimg}/>
                                    <div class="p-image">
                                    <i class="fa fa-camera upload-button" onClick={() => this.imageInput.click()} style={{cursor:'pointer'}}></i>
                                        <input class="file-upload" type="file" accept="image/*" ref={input => this.imageInput = input} onChange={(e) => this.handleImageChange(e)} />
                                    </div>
                                </div>
                            </Grid>
                            <Grid container spacing={0} alignItems="flex-end" justify = "center" style={{marginTop: 20}}>
                                <Grid item xs={1}>
                                    <Restaurant className={"ic-color"}/>
                                </Grid>
                                <Grid item xs={3}>
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
                <Alert open={this.state.open} title={this.state.title} type={this.state.type} content={this.state.content} close={this.closeAlert}/>
                <SweetAlert
                    show={this.state.askopen}
                    title="Are you sure ?"
                    text={`You want to use ${this.state.res_name} to the restaurant name right ?`}
                    type="info"
                    onConfirm={() => this.saveData()}
                    onEscapeKey={() => this.setState({askopen: !this.state.askopen})}
                    onOutsideClick={() => { if(this.state.askopen) this.setState({askopen: !this.state.askopen}) }}
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

export default connect(null, {updateRestaurantName: updateRestaurantName})(withStyles(styles)(withRoot(OneStepInput)));