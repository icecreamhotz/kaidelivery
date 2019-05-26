import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { updateMenu } from "../../actions/menu.js";
import { connect } from "react-redux";

import API from "../../helper/api";
import Loading from "../loaders/loading";
import "./restautant.scss";

const styles = {
  toolbar: {
    maxWidth: 1170
  }
};

class RestaurantComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurants: [],
      restaurantTypes: [],
      loading: true
    };
  }

  async componentDidMount() {
    await this.loadRestaurantAndTypes();
    this.props.updateMenu([])
  }

  loadRestaurantAndTypes = async () => {
    const restaurants = await API.get(`restaurants/open`);
    const restaurantData = await restaurants;
    const restaurantTypes = await API.get("restauranttypes/");
    const restaurantTypeData = await restaurantTypes;

    console.log(restaurants);

    this.setState({
      restaurants: restaurantData.data.data,
      restaurantTypes: restaurantTypeData.data.data,
      loading: false
    });
  };

  render() {
    const { loading, restaurants, restaurantTypes } = this.state;
    return (
      <div className="content-start kai-container">
        {loading ? <Loading loaded={loading} /> : ""}
        <Typography variant="h3" gutterBottom>
          Restaurants
        </Typography>
        <Grid container spacing={24}>
          {restaurants.map(res => {
            let type = [];
            if (res.restype_id !== null) {
              const restype_id = JSON.parse(res.restype_id);
              let i;
              for (i in restype_id) {
                const getType = restaurantTypes.filter(
                  type => type.restype_id === restype_id[i]
                );
                type = [...type, getType[0]];
              }
            }
            console.log(type);
            return (
              <Grid
                component={Link}
                to={`/restaurant/${res.res_id}`}
                item
                xs={3}
                className="styledlink"
              >
                <div className="image-wrapper">
                  <img
                    src={`https://kaidelivery-api.herokuapp.com/restaurants/${res.res_logo}`}
                    alt=""
                  />
                </div>
                <div className="restaurant-info">
                  <span className="headline">
                    <span className="name">{res.res_name}</span>
                    <div className="ratings-component">
                      <span className="stars">
                        <img
                          alt=""
                          src="https://assets.foodora.com/819a336/img/icons/ic-star-sm.svg?819a336"
                        />
                      </span>
                      <span className="rating">
                        {res.rating === null
                          ? "3.00"
                          : parseFloat(res.rating).toFixed(2)}
                      </span>
                    </div>
                  </span>
                </div>
                {type.map((t, idx) => {
                  return (
                    <div className="restaurant-type-text">
                      {`${t.restype_name}${
                        type.length > 0 && idx + 1 < type.length ? ", " : " "
                      }`}
                    </div>
                  );
                })}
              </Grid>
            );
          })}
        </Grid>
      </div>
    );
  }
}

export default connect(null, {updateMenu: updateMenu})(withStyles(styles)(RestaurantComponent));
