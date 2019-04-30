import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";

import { updateMenu, updateMinPrice } from "../../actions/menu.js";
import { connect } from "react-redux";
import API from "../../helper/api.js";
import RestaurantRatingAndComment from "./RestaurantRatingAndComment";

class RestaurantDetailsLeftSide extends Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurant: props.restaurant,
      food: [],
      menu: [],
      minprice: ""
    };
  }

  async componentDidMount() {
    await this.setGroupOfMenu();
  }

  handleChange = prop => event => {
    const value = parseFloat(event.target.value);
    this.setState(
      {
        [prop]: value
      },
      () => {
        this.props.updateMinPrice(value);
      }
    );
  };

  setGroupOfMenu = async () => {
    const { restaurant } = this.state;

    const foodtypes = await API.get("foodtypes/");
    const { data } = await foodtypes;

    const food = await API.post("foods/", { res_id: restaurant.res_id });
    const foodData = await food;

    let allFoodType = data.data;
    let allFood = foodData.data.data;

    let newFood = [];

    for (let ft in allFoodType) {
      let type = allFoodType[ft];
      let food = [];
      for (let fa in allFood) {
        if (allFood[fa].foodtype_id === type.foodtype_id) {
          food = [...food, allFood[fa]];
        }
      }
      if (food.length > 0) {
        const setFood = {
          group: type.foodtype_name,
          food
        };
        newFood = [...newFood, setFood];
      }
    }
    this.setState({
      food: newFood
    });
  };

  addMenu = food => {
    let getOldFood = this.props.menu;

    const shouldAddNewFood = getOldFood.filter(
      gt => gt.food_id === food.food_id
    );

    if (!shouldAddNewFood.length > 0) {
      const priceTotal = parseFloat(food.food_price).toFixed(2);
      const newFood = {
        food_id: food.food_id,
        orderdetails_total: 1,
        food_name: food.food_name,
        orderdetails_price: food.food_price,
        food_pricetotal: priceTotal
      };
      getOldFood = [...getOldFood, newFood];
      this.props.updateMenu(getOldFood);
    } else {
      const checkFood = getOldFood.map(gt => {
        if (gt.food_id === food.food_id) {
          const newTotal = gt.orderdetails_total + 1;
          const priceTotal = parseFloat(
            Math.round(food.food_price * newTotal * 100) / 100
          ).toFixed(2);
          return {
            food_id: food.food_id,
            orderdetails_total: newTotal,
            food_name: gt.food_name,
            orderdetails_price: food.food_price,
            food_pricetotal: priceTotal
          };
        }
        return gt;
      });
      this.props.updateMenu(checkFood);
    }
  };

  render() {
    const { restaurant, food, minprice } = this.state;
    return (
      <div>
        <Grid container>
          <Grid item xs={12}>
            <img
              src={`http://localhost:3000/restaurants/res_20190320114959.jpg`}
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
              <Typography variant="h6" gutterBottom component="span">
                {`${restaurant.res_name} `}
                <img
                  alt=""
                  src="https://assets.foodora.com/819a336/img/icons/ic-star-sm.svg?819a336"
                />
                {restaurant.rating === null
                  ? "3.00"
                  : parseFloat(restaurant.rating).toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="subtitle1"
                gutterBottom
                align="right"
                style={{ lineHeight: 1.6 }}
              >
                {`${restaurant.res_open} - ${restaurant.res_close}`}
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
                {`${restaurant.res_telephone[0]}${
                  restaurant.res_telephone[1] !== ""
                    ? ", " + restaurant.res_telephone[1]
                    : ""
                }`}
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
                {restaurant.res_address}
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
                {restaurant.res_details}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <RestaurantRatingAndComment restaurant={restaurant} />
          </Grid>
        </Grid>
        <Grid container style={{ padding: "15px 0px 15px 0px" }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel htmlFor="minprice">Minimum Price</InputLabel>
              <Input
                id="minprice"
                value={minprice}
                type="number"
                onChange={this.handleChange("minprice")}
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
              />
            </FormControl>
          </Grid>
        </Grid>
        {food.length > 0
          ? food.map((res, idx) => {
              return (
                <Grid
                  key={idx}
                  container
                  style={{ backgroundColor: "#f7f7f7" }}
                >
                  <Grid container item xs={12} style={{ marginTop: 15 }}>
                    <div className="group-food-block">
                      <div className="kai-container" style={{ width: 700 }}>
                        <Grid item xs={12}>
                          <Typography
                            variant="subtitle1"
                            gutterBottom
                            align="center"
                          >
                            {res.group}
                          </Typography>
                          <Divider light style={{ marginTop: 20 }} />
                        </Grid>
                        {res.food.map((f, idx) => {
                          return (
                            <div key={idx}>
                              <Grid
                                container
                                item
                                xs={12}
                                className="kai-container"
                                style={{
                                  paddingTop: 15,
                                  paddingBottom: 15
                                }}
                              >
                                <Grid item xs={8}>
                                  {f.food_name}
                                </Grid>
                                <Grid item xs={3}>
                                  {f.food_price} B
                                </Grid>
                                <Grid item xs onClick={() => this.addMenu(f)}>
                                  +
                                </Grid>
                              </Grid>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Grid>
                </Grid>
              );
            })
          : ""}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    menu: state.menu.menu,
    minPrice: state.menu.minPrice
  };
}

export default connect(
  mapStateToProps,
  { updateMenu: updateMenu, updateMinPrice: updateMinPrice }
)(RestaurantDetailsLeftSide);
