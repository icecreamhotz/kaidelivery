import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import { connect } from 'react-redux'
import geolib from 'geolib'
import axios from 'axios'

class RestaurantDetailsLeftSide extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
            mylat: 0.0,
            mylng: 0.0,
            restaurant: props.restaurant,
            distance: 0.0
        }
    }

    componentDidMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.setState({
                        mylat: parseFloat(position.coords.latitude),
                        mylng: parseFloat(position.coords.longitude),
                    }, () => this.getDistanceOneToOne())
                },
                error => console.log(error)
            );
        }
    }

    // componentWillReceiveProps(nextProps) {
    //     if(nextProps.restaurant !== this.props.restaurant) {
    //         this.setState({
    //             restaurant: nextProps.restaurant
    //         }, () => this.getDistanceOneToOne())
    //     }
    // }

    getDistanceOneToOne = async () => {
        const { mylat, mylng, restaurant } = this.state
        
        const distance = geolib.getDistance(
            {latitude: mylat, longitude: mylng},
            {latitude: restaurant.res_lat, longitude: restaurant.res_lng}
        );
        
        this.setState({
            distance: distance
        })
    }

    render() {
        const { restaurant, distance } = this.state
        const distanceText = (distance / 1000).toFixed(1)
        const { menu } = this.props
        const subtotal = menu.reduce((a, b) => { return a + b.food_price })
        console.log(subtotal);
        return (
            <div className="kai-container">
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <Typography variant="title" align="center">
                            { restaurant.res_name }
                        </Typography>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={6}>
                            <Typography variant="body1" align="right">
                                <DeleteIcon /> { `${distanceText} km` }
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" align="left">
                                <DeleteIcon /> 20 mins
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" align="center">
                            Your Orders
                        </Typography>
                    </Grid>
                        {
                            (menu.length > 0) ?
                                menu.map(m => {
                                    return <Grid 
                                        container
                                        item xs={12} 
                                        direction="row"
                                        justify="center"
                                        alignItems="center">
                                        <Grid container item xs={3} align="center">
                                            <Grid item xs={4}>
                                                -
                                            </Grid>
                                            <Grid item xs={4}>
                                                { m.food_total }
                                            </Grid>
                                            <Grid item xs={4}>
                                                +
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={7}>
                                            <Typography variant="subtitle1" align="left">
                                                { m.food_name }
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Typography variant="subtitle1" align="center">
                                                { `${m.food_price} ฿` }
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                })
                            :
                            "Please select some food :)"
                        }
                </Grid>
                <Divider light style={{marginTop: 10}}/>
                <Grid container direction="column" style={{marginTop: 10}}>
                    <Grid container item xs={12}>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1" align="left">
                                Subtotal
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1" align="right">
                                59,00 ฿
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1" align="left">
                                Delivery
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1" align="right">
                                59,00 ฿
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1" align="left">
                                Discount
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1" align="right">
                                59,00 ฿
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={6}>
                            <Typography variant="body2" align="left">
                                Total
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1" align="right">
                                59,00 ฿
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}  align="center" style={{marginTop: 10}}>
                        <Button variant="contained" color="secondary">
                            Checkout
                        </Button>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        menu: state.menu.menu
    }
}

export default connect(mapStateToProps, null)(RestaurantDetailsLeftSide);