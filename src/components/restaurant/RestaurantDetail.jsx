import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';

import API from '../../helper/api.js'
import RestaurantDetailsLeftSide from './RestaurantDetailsLeftSide'
import RestaurantDetailsRightSide from './RestaurantDetailsRightSide'
import Loading from '../loaders/loading'

class RestaurantDetail extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
            restaurant: [],
            loading: true
        }
    }

    async componentDidMount() {
        await this.loadRestaurantDetails()
    }

    loadRestaurantDetails = async () => {
        const resId = this.props.match.params.resid
        const restaurant = await API.get(`restaurants/${resId}`)
        const { data } = await restaurant

        this.setState({
            restaurant: data.data,
            loading: false
        })
    }

    render() {
        return (
            <div className="content-start">
                { (this.state.loading ? <Loading loaded={this.state.loading} /> : '')}
                <Grid container spacing={24}>
                    <Grid item container xs={4}>
                        {
                            this.state.restaurant.length !== 0 ?
                            <RestaurantDetailsLeftSide 
                                restaurant={this.state.restaurant}
                            />
                            :
                            ""
                        }
                    </Grid>
                    <Grid item container xs={8}>
                        {
                            this.state.restaurant.length !== 0 ?
                            <RestaurantDetailsRightSide 
                                restaurant={this.state.restaurant} 
                            />
                            :
                            ""
                        }
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default RestaurantDetail;