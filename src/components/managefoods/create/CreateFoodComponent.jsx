import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add'
import CancelIcon from '@material-ui/icons/Close'
import red from '@material-ui/core/colors/red';
import { Color } from '../../../variable/Color.js'
import API from '../../../helper/api.js'
import FoodTypesLists from './FoodTypesList'
import CircularProgress from '@material-ui/core/CircularProgress';
import SweetAlert from 'sweetalert-react';
import './createfoods.scss'

const styles = theme => ({
    root: {
        flexGrow: 1,
        paddingTop: 30,
    },
    formControl: {
        minWidth: 120,
    },
    addFab: {
        margin: theme.spacing.unit,
        backgroundColor: Color.kaidelivery,
        '&:hover': {
            backgroundColor: Color.kaideliveryLight
        }
    },
    cancelFab: {
        margin: theme.spacing.unit,
        backgroundColor: red[800],
        '&:hover': {
            backgroundColor: red[600]
        }
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
})

class CreateFoodComponent extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
        foodholders: [{
            preview: ['', ''],
            image: [null, null],
            food_name: '',
            food_price: '',
            foodtype_id: '',
            loading: false,
            success: false
        }],
        foodtypes: [],
        loading: true,
        confirmAlert: false,
        successAlert: false,
        loadbutton: false
      }
      this.imageInput = []
    }

    async componentDidMount() {
        await this.fetchFoodTypesFromAPI()
    }

    fetchFoodTypesFromAPI = async () => {
        const foodtypes = await API.get('foodtypes/')
        const { data } = await foodtypes
        const foodTypes = data.data
        this.setState({ foodtypes: foodTypes, loading: false  })
    }

    handlePreviewImage = (idx, imgindx) => event => {
        event.preventDefault();

        const { foodholders } = this.state

        const newFoodHolders = foodholders

        newFoodHolders.filter((item, sidx) => sidx === idx).map((holder, sidx) => {
            const reader = new FileReader();
            const file = event.target.files[0]

            let imageArr = holder.image
            let preview = holder.preview
            let index = imgindx

            reader.onloadend = () => {
                imageArr[index] = file
                preview[index] = reader.result

                let holders = [...foodholders]
                let holder = {...holders[idx]}

                holder.preview = preview
                holder.image = imageArr
                    
                holders[idx] = holder
                    
                this.setState({holders})
            }   
            this.imageInput[idx + idx + imgindx].value = null
            return reader.readAsDataURL(file)
        }) 
    }

    handleHoldersOnchange = name => idx => event => {
        const { foodholders } = this.state
        const newHolders = foodholders.map((holder, sidx) => {
            if(idx !== sidx) return holder
            return { ...holder, [name]: event.target.value }
        })

        this.setState({ foodholders: newHolders })
    }

    handleAddShareholder = idx => () => {
        const { foodholders } = this.state
        const holders = {
            preview: ['', ''], 
            image : [null, null], 
            food_name: '', 
            food_price: '', 
            foodtype_id: '', 
            loading: false, 
            success: false
        }

        if((idx + 1) === foodholders.length) {
            this.setState(prevState => ({
                foodholders: [...prevState.foodholders, holders]
            }))
        }
    }

    handleRemoveShareholder = idx => () => {
        if(idx !== 0) {
            this.setState({
                foodholders: this.state.foodholders.filter((s, sidx) => idx !== sidx)
            });
        }
    };

    handleSubmit = () => {
        this.setState({
            confirmAlert: true
        })
    }

    onSubmit = async () => {
        const { foodholders } = this.state
        const { res_id } = this.props
        const loadHolders = foodholders.map(item => { return  {...item, loading:true }})
        this.setState({
            foodholders: loadHolders,
            confirmAlert: false,
            loadbutton: true
        })

        const fetchCountFood = await API.get('foods/allfoods')
        const { data } = fetchCountFood
        let countFoods = data.data
        let foodsTotal = []

        for(let [index, foods] of loadHolders.entries()) {

            let bodyFormData = new FormData()

            bodyFormData.set('food_name', foods.food_name)
            bodyFormData.set('food_price', foods.food_price)
            bodyFormData.set('foodtype_id', foods.foodtype_id)
            bodyFormData.set('res_id', res_id)
            
            if(foods.image[0] !== null) {
                bodyFormData.append('image', foods.image[0])
                foodsTotal = [...foodsTotal, `${countFoods}1`]
            }
            if(foods.image[1] !== null) {
                bodyFormData.append('image', foods.image[1])
                foodsTotal = [...foodsTotal, `${countFoods}2`]
            }

            bodyFormData.set('food_total', JSON.stringify(foodsTotal))

            for(let pair of bodyFormData.entries()) {
                console.log(pair[0] + ', ' + pair[1])
            }

            await this.insertFoodsData(bodyFormData, index).then((newHolders) => {
                this.setState({
                    foodholders: newHolders
                })
            })

            countFoods++
            foodsTotal = []
        }
        setTimeout(() => {
            this.setState({
                successAlert: true
            })
        }, 100);
    }

    afterSubmit = () => {
        this.setState({
            successAlert: false
        }, () => this.props.changeValueComponent(3))
    }

    insertFoodsData = (data, idx) => {
        return new Promise((resolve, reject) => {
            API.post('foods/create', data, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }).then((foods) => {
                const newHolders = this.state.foodholders.map((foods, hindex) => {
                    if(hindex !== idx) return foods
                    return { ...foods,  success: true }
                })
                return resolve(newHolders)
            }).catch(err => {
                return reject(err)
            })
        })
    }

    handleDeleteImage = (imgidx, idx) => {
        let foods = [...this.state.foodholders]
        let food = {...foods[idx]}
        food.image[imgidx] = null
        food.preview[imgidx] = null
        foods[idx] = food

        this.setState({foods})
    }

    render() {
        const { classes } = this.props;
        const { loading, foodholders, foodtypes } = this.state;
        return (
            <div className={classes.root}>
                <ValidatorForm
                    ref="form"
                    onSubmit={this.handleSubmit}
                    onError={errors => console.log(errors)}
                >
                    <Paper className={classes.paper}>
                        <Grid container spacing={24} style={{padding: 30}}>
                            <Grid item container>
                                <Typography variant="h4" gutterBottom align="left">
                                    Add food more
                                </Typography>
                                <Divider style={{width: '100%'}}/>
                            </Grid>
                            {foodholders.map((holder, idx) => (
                                <Grid item container xs={12} key={idx}>
                                    <Grid item container direction="row" spacing={8}>
                                        <Grid item container xs={2}>
                                        {
                                            holder.preview.map((img, imgidx) => (
                                                <Grid item xs key={(idx + idx + imgidx)}>
                                                <div style={{position: 'relative'}}>
                                                    <div className="avatar-wrapper">
                                                        <img className="food-pic" src={img} alt={imgidx} />
                                                        <div className="upload-button" onClick={() => this.imageInput[(idx + idx + imgidx)].click()}>
                                                            <i className="fas fa-plus" aria-hidden="true"></i>
                                                        </div>
                                                        <input className="file-upload" type="file" accept="image/*" ref={input => this.imageInput[(idx + idx + imgidx)] = input} onChange={this.handlePreviewImage(idx, imgidx)} />
                                                    </div>
                                                    {
                                                        img && 
                                                        <div className="circCont">
                                                            <button type="button" className="circle-food" onClick={() => this.handleDeleteImage(imgidx, idx)}>
                                                            </button>
                                                        </div>
                                                    }
                                                </div>
                                                </Grid>
                                            ))
                                        }
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextValidator 
                                                value={holder.food_name}
                                                name={`food_name${idx}`} 
                                                label="Food Name"
                                                onChange={this.handleHoldersOnchange('food_name')(idx)} 
                                                validators={['required']}
                                                errorMessages={['this field is required']}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <TextValidator 
                                                value={holder.food_price}
                                                name={`food_price${idx}`} 
                                                label="Food Price" 
                                                type="number"
                                                onChange={this.handleHoldersOnchange('food_price')(idx)} 
                                                validators={['required']}
                                                errorMessages={['this field is required']}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <FoodTypesLists holder={holder} index={idx} classes={classes} loading={loading} foodtypes={foodtypes} handleHoldersOnchange={this.handleHoldersOnchange}/>
                                        </Grid>
                                        {
                                            holder.loading ?
                                            <Grid item container xs={2}>
                                                <Grid item xs>
                                                    <div className={`circle-loader zoomIn ${holder.success ? 'load-complete' : ''}`}>
                                                        <div className="checkmark draw" style={{display: (holder.success ? 'block' : 'none')}}></div>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                            :
                                            <Grid item container xs={2}>
                                                <Grid item xs>
                                                    <Fab color="primary" aria-label="Add" className={classes.addFab} onClick={this.handleAddShareholder(idx)}>
                                                        <AddIcon />
                                                    </Fab>
                                                </Grid>
                                                <Grid item xs>
                                                    <Fab color="primary" aria-label="Add" className={classes.cancelFab} onClick={this.handleRemoveShareholder(idx)}>
                                                        <CancelIcon />
                                                    </Fab>
                                                </Grid>
                                            </Grid>
                                        }
                                    </Grid>
                                </Grid>
                                ))}
                            <Grid item xs container direction="row" justify="center" alignItems="center">
                                {
                                    this.state.loadbutton ?
                                        <CircularProgress  />
                                    :
                                    <Button type="submit" variant="contained" color="primary">
                                        Save
                                    </Button>
                                }
                            </Grid>
                        </Grid>
                    </Paper>
                </ValidatorForm>
                <SweetAlert
                    show={this.state.confirmAlert}
                    title="Warning"
                    text="Do you need to insert ?"
                    type="warning"
                    showCancelButton
                    onConfirm={() => { this.onSubmit() }}
                    onCancel={() => { this.setState({confirmAlert: false})  }}
                    onEscapeKey={() => {if(this.state.confirmAlert) { this.setState({confirmAlert: false}) }}}
                    onOutsideClick={() => {if(this.state.confirmAlert) { this.setState({confirmAlert: false}) }}}
                />
                <SweetAlert
                    show={this.state.successAlert}
                    title="Success"
                    text="Inserted successful"
                    type="success"
                    showCancelButton
                    onConfirm={() => { this.afterSubmit() }}
                    onEscapeKey={() => {if(this.state.successAlert) { this.afterSubmit() }}}
                    onOutsideClick={() => {if(this.state.successAlert) { this.afterSubmit() }}}
                />
            </div>
        );
    }
}

CreateFoodComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CreateFoodComponent);