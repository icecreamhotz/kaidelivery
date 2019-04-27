import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import { updateMenu } from '../../actions/menu.js'
import { connect } from 'react-redux'
import API from '../../helper/api.js'

class RestaurantDetailsLeftSide extends Component {
    
    constructor(props) {
        super(props)
        
        this.state = {
            restaurant: props.restaurant,
            food: [],
            menu: []
        }
    }

    async componentDidMount() {
        await this.setGroupOfMenu()
    }

    setGroupOfMenu = async () => {
        const { restaurant } = this.state

        const foodtypes = await API.get('foodtypes/')
        const { data } = await foodtypes

        const food = await API.post('foods/', { res_id: restaurant.res_id})
        const foodData = await food

        let allFoodType = data.data
        let allFood = foodData.data.data

        let newFood = []

        for(let ft in allFoodType) {
            let type = allFoodType[ft]
            let food = []
            for(let fa in allFood) {
                if(allFood[fa].foodtype_id === type.foodtype_id) {
                    food = [...food, allFood[fa]]
                }
            }
            if(food.length > 0) {
                const setFood = {
                    group: type.foodtype_name,
                    food
                }
                newFood = [...newFood, setFood]
            }
        }
        this.setState({
            food: newFood
        })
    }

    addMenu = (food) => {
        console.log(food);
        let getOldFood = this.state.menu
        const shouldAddNewFood = getOldFood.filter(gt => gt.food_id === food.food_id)

       

        if(!shouldAddNewFood.length > 0) {
             console.log("1");
            const newFood = {
                food_id: food.food_id,
                food_total: 1,
                food_name: food.food_name,
                food_price: food.food_price
            }
            getOldFood = [...getOldFood, newFood]
            this.setState({
                menu: getOldFood
            }, () => {
                 this.props.updateMenu(this.state.menu)
            })
        } else {
            const checkFood = getOldFood.map(gt =>  {
                if(gt.food_id === food.food_id) {
                    const newTotal = gt.food_total + 1
                    return {
                        food_id: food.food_id,
                        food_total: newTotal,
                        food_name: gt.food_name,
                        food_price: food.food_price * newTotal
                    }
                }
                return gt
            })
             this.setState({
                menu: checkFood
            }, () => {
                this.props.updateMenu(this.state.menu)
            })
        }
    }

    render() {
        const { restaurant, food } = this.state
        return (
            <div>
                <Grid container>
                    <Grid item xs={12}>
                        <img src={`http://localhost:3000/restaurants/res_20190320114959.jpg`} 
                            alt="" 
                            style={{
                                height: 260, 
                                objectFit: "cover",
                                width: "100%"
                            }}
                        />
                    </Grid>
                    <Grid container item direction="row" xs={12}>
                        <Grid item xs={6}>
                            <Typography variant="h6" gutterBottom>
                               { restaurant.res_name }
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1" gutterBottom align="right" style={{ lineHeight: 1.6 }}>
                               { `${restaurant.res_open} - ${restaurant.res_close}` }
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container item direction="row" xs={12}>
                        <Grid item xs={2}>
                            <Typography variant="body1" gutterBottom>
                               Telephone
                            </Typography>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="body1" gutterBottom>
                               { `${restaurant.res_telephone[0]}${(restaurant.res_telephone[1] !== '' ? ', '+ restaurant.res_telephone[1] : "")}` }
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container item direction="row" xs={12}>
                        <Grid item xs={2}>
                            <Typography variant="body1" gutterBottom>
                               Address
                            </Typography>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="body1" gutterBottom>
                                { restaurant.res_address }
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container item direction="row" xs={12}>
                        <Grid item xs={2}>
                            <Typography variant="body1" gutterBottom>
                               Details
                            </Typography>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="body1" gutterBottom>
                               { restaurant.res_details }
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                {
                    food.length > 0 ?  
                        food.map(res => {
                            return <Grid container style={{backgroundColor: "#f7f7f7"}}>
                            <Grid container item xs={12} style={{marginTop: 15}}>
                                <div className="group-food-block">
                                    <div className="kai-container" style={{width: 700}}>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1" gutterBottom align="center">
                                                { res.group }
                                            </Typography>
                                            <Divider light style={{marginTop: 20}}/>
                                        </Grid>
                                        {
                                            res.food.map(f => {
                                                return  <div>
                                                    <Grid container item xs={12} className="kai-container"
                                                        style={{
                                                            paddingTop: 15,
                                                            paddingBottom: 15
                                                        }}
                                                    >
                                                        <Grid item xs={8}>
                                                            { f.food_name }
                                                        </Grid>
                                                        <Grid item xs={3}>
                                                            { f.food_price } B
                                                        </Grid>
                                                        <Grid item xs  onClick={() => this.addMenu(f)}>
                                                            +
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                        })
                    :
                    ""
                }
            </div>
        );
    }
}

export default connect(null, { updateMenu: updateMenu})(RestaurantDetailsLeftSide);