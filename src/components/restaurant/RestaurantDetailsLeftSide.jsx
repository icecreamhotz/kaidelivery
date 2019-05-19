import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import moment from "moment";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import "moment/locale/th";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from "@material-ui/core/Snackbar";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { connect } from "react-redux";
import { updateMenu, updateMinPrice } from "../../actions/menu.js";
import { triggerLoginSignupHeader } from "../../actions/header.js";
import { updateOrderName } from "../../actions/order.js";
import geolib from "geolib";
import API from "../../helper/api.js";
import MySnackbarContent from "./SnackBar";
import Slide from "@material-ui/core/Slide";
import firebase from "../../helper/firebase.js";

moment.locale("th");

let minute = [];

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class RestaurantDetailsLeftSide extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mylat: props.lat,
      mylng: props.lng,
      restaurant: props.restaurant,
      distance: 0.0,
      deliveryprice: 0,
      rate_id: 0,
      minminute: "",
      endpoint_details: "",
      order_details: "",
      searchValue: props.searchValue,
      otpOpen: false,
      telephone: "",
      otp: "",
      sendedotp: false,
      success: false,
      failed: false,
      roleopen: false
    };
  }

  async componentDidMount() {
    this.getDistanceOneToOne();
    this.setDataToMinuteArr();
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.lat !== this.state.mylat ||
      nextProps.lng !== this.state.mylng
    ) {
      this.setState(
        {
          mylat: parseFloat(nextProps.lat),
          mylng: parseFloat(nextProps.lng)
        },
        () => {
          this.getDistanceOneToOne();
        }
      );
    }
    if (nextProps.searchValue !== this.state.searchValue) {
      this.setState({
        searchValue: nextProps.searchValue
      });
    }
    if (nextProps.isAuthenticated !== this.props.isAuthenticated) {
      if (!this.props.isAuthenticated && nextProps.isAuthenticated) {
        if (this.state.roleopen) {
          this.setState(
            {
              roleopen: false
            },
            () =>
              this.setState({
                otpOpen: true
              })
          );
          this.props.triggerLoginSignupHeader({
            alertlogin: false,
            alerttabindex: 0
          });
        }
      }
    }
  }

  handleChange = prop => event => {
    const value = event.target.value;
    this.setState({
      [prop]: value
    });
  };

  setDataToMinuteArr = () => {
    for (let i = 5; i <= 60; i += 5) {
      minute = [...minute, i];
    }
  };

  loadDeliveryRate = async () => {
    const { distance } = this.state;
    const rates = await API.get("rates/");
    const { data } = await rates;
    console.log(data);
    let m = moment()
      .hour(18)
      .minute(0)
      .seconds(0);
    const datenow = moment();

    const getDistance = parseInt(parseInt(distance) / 1000);
    let deliveryprice;
    const distanceRate = data.data[1].rate_price;
    let commonRate;
    let rate_id;

    if (datenow.isAfter(m)) {
      commonRate = data.data[0].rate_price;
      rate_id = data.data[0].rate_id;
    } else {
      commonRate = data.data[2].rate_price;
      rate_id = data.data[2].rate_id;
    }

    if (getDistance >= 4) {
      const overDistance = getDistance - 3;
      const calculateOverDistance = parseInt(distanceRate) * overDistance;
      deliveryprice = calculateOverDistance + commonRate;
    } else {
      deliveryprice = commonRate;
    }

    this.setState({
      deliveryprice: deliveryprice,
      rate_id: rate_id
    });
  };

  getDistanceOneToOne = async () => {
    const { mylat, mylng, restaurant } = this.state;

    const distance = geolib.getDistance(
      { latitude: mylat, longitude: mylng },
      { latitude: restaurant.res_lat, longitude: restaurant.res_lng }
    );
    this.setState(
      {
        distance: distance
      },
      () => this.loadDeliveryRate()
    );
  };

  addTotalMenu = foodId => {
    const { menu } = this.props;

    const getMenu = menu;

    const newMenu = getMenu.map(gt => {
      if (gt.food_id === foodId) {
        const newTotal = gt.orderdetails_total + 1;
        const priceTotal = parseFloat(
          Math.round(gt.orderdetails_price * newTotal * 100) / 100
        ).toFixed(2);
        return {
          ...gt,
          orderdetails_total: newTotal,
          food_pricetotal: priceTotal
        };
      }
      return gt;
    });

    this.props.updateMenu(newMenu);
  };

  deleteTotalMenu = foodId => {
    const { menu } = this.props;

    const getMenu = menu;

    const newMenu = getMenu.map(gt => {
      if (gt.food_id === foodId) {
        const total = gt.orderdetails_total - 1;
        if (total > 0) {
          const priceTotal = parseFloat(
            Math.round(gt.orderdetails_price * total * 100) / 100
          ).toFixed(2);
          return {
            ...gt,
            orderdetails_total: total,
            food_pricetotal: priceTotal
          };
        }
        return {};
      }
      return gt;
    });

    const filterMenuIsEmptry = newMenu.filter(m => Object.keys(m).length !== 0);
    this.props.updateMenu(filterMenuIsEmptry);
  };

  onSubmit = () => {
    const {
      minminute,
      mylat,
      mylng,
      restaurant,
      deliveryprice,
      rate_id,
      endpoint_details,
      order_details,
      searchValue,
      telephone
    } = this.state;

    const newMinMinute = minminute === "" ? 0 : minminute;
    const orderStart = moment().format("HH:mm:ss");
    let data = {
      menu: this.props.menu,
      min_minute: newMinMinute,
      order_details: order_details,
      res_id: restaurant.res_id,
      rate_id: rate_id,
      endpoint_name: searchValue,
      endpoint_lat: mylat,
      endpoint_lng: mylng,
      endpoint_details: endpoint_details,
      order_deliveryprice: deliveryprice,
      order_start: orderStart
    };

    const url = !this.props.isAuthenticated ? `guest/` : "";
    if (!this.props.isAuthenticated) {
      data = { ...data, telephone: telephone };
    }

    API.post(`orders/${url}`, data)
      .then(order => {
        const data = order.data.order_name;
        let ref = firebase.database().ref("Orders");

        ref
          .child(data)
          .set({
            latitude: 0.0,
            longitude: 0.0
          })
          .then(() => {
            this.setState(
              {
                success: true,
                sendedotp: true
              },
              () => {
                this.props.setLoadingFalse();
                this.props.updateOrderName(data);
                localStorage.orderName = data;
                this.props.history.push("/tracking");
              }
            );
          })
          .catch(err => {
            console.log(err);
            alert("error firebase");
          });
      })
      .catch(err => {
        console.log(err);
        this.setState(
          {
            failed: true
          },
          () => this.props.setLoadingFalse()
        );
      });
  };

  handleOpen = () => {
    this.setState({
      roleopen: false,
      otpOpen: true
    });
  };

  handleClose = () => {
    this.setState({
      otpOpen: false
    });
  };

  handleClickRoleOpen = () => {
    if (!this.props.isAuthenticated) {
      this.setState({
        roleopen: true
      });
      return;
    }
    this.setState({
      otpOpen: true
    });
  };

  handleCloseRole = () => {
    this.setState({ roleopen: false });
  };

  sendRequestOTP = () => {
    const { telephone } = this.state;
    // this.props.setLoadingTrue();

    this.setState({
      success: true,
      sendedotp: true
    });
    // API.post("orders/otp", { telephone: telephone })
    //   .then(() => {
    //     this.setState(
    //       {
    //         success: true,
    //         sendedotp: true
    //       },
    //       () => this.props.setLoadingFalse()
    //     );
    //   })
    //   .catch(() => {
    //     this.setState(
    //       {
    //         failed: true
    //       },
    //       () => this.props.setLoadingFalse()
    //     );
    //   });
  };

  sendOTP = () => {
    const { otp, telephone } = this.state;
    this.props.setLoadingTrue();

    API.get(`orders/otp/${otp}/${telephone}`)
      .then(otp => {
        if (otp.data.data.otp_id) {
          this.setState(
            {
              success: true
            },
            () => this.onSubmit()
          );
        } else {
          this.setState(
            {
              failed: true
            },
            () => this.props.setLoadingFalse()
          );
        }
      })
      .catch(() => {
        this.setState(
          {
            failed: true
          },
          () => this.props.setLoadingFalse()
        );
      });
  };

  handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ success: false });
  };

  handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ failed: false });
  };

  render() {
    const { restaurant, distance, deliveryprice, otpOpen } = this.state;
    const distanceText = (distance / 1000).toFixed(1);
    const { menu, minPrice, isAuthenticated } = this.props;

    let subtotalprice = 0.0;
    if (menu.length > 0)
      subtotalprice = menu
        .map(item => parseFloat(item.food_pricetotal))
        .reduce((prev, next) => prev + next)
        .toFixed(2);
    else subtotalprice = 0.0;
    const totalprice = parseFloat(
      deliveryprice + parseFloat(subtotalprice)
    ).toFixed(2);
    return (
      <div className="kai-container">
        <Dialog
          open={this.state.otpOpen}
          onClose={this.handleClose}
          aria-labelledby="dialog-otp"
          aria-describedby="dialog-description"
        >
          <DialogTitle id="dialog-otp">
            {"Authentication To Confirm Order"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="dialog-description">
              Please input your telephone number and click request otp(one time
              password), Then us will send some code and you will send that code
              for authentication.
            </DialogContentText>
            {this.state.sendedotp ? (
              ""
            ) : (
              <Grid container>
                <Grid item xs={8}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="telephone"
                    label="Telephone"
                    type="text"
                    fullWidth
                    value={this.state.telephone}
                    onChange={this.handleChange("telephone")}
                  />
                </Grid>
                <Grid item xs={4} align="center">
                  <Button
                    color="primary"
                    style={{ height: "100%" }}
                    onClick={() => this.sendRequestOTP()}
                  >
                    request otp
                  </Button>
                </Grid>
              </Grid>
            )}
            {this.state.sendedotp ? (
              <Grid container>
                <Grid item xs={8}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="otp"
                    label="OTP"
                    type="text"
                    fullWidth
                    value={this.state.otp}
                    onChange={this.handleChange("otp")}
                  />
                </Grid>
                <Grid item xs={4} align="center">
                  <Button
                    color="inherit"
                    style={{ height: "100%" }}
                    onClick={() => this.sendOTP()}
                  >
                    send otp
                  </Button>
                </Grid>
              </Grid>
            ) : (
              ""
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary" autoFocus>
              CLOSE
            </Button>
          </DialogActions>
        </Dialog>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Typography variant="title" align="center">
              {restaurant.res_name}
            </Typography>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={6}>
              <Typography variant="body1" align="right">
                <DeleteIcon /> {`${distanceText} km`}
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
          {menu.length > 0
            ? menu.map((m, idx) => {
                return (
                  <Grid
                    key={idx}
                    container
                    item
                    xs={12}
                    direction="row"
                    justify="center"
                    alignItems="center"
                  >
                    <Grid container item xs={3} align="center">
                      <Grid
                        item
                        xs={4}
                        onClick={() => this.deleteTotalMenu(m.food_id)}
                      >
                        -
                      </Grid>
                      <Grid item xs={4}>
                        {m.orderdetails_total}
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        onClick={() => this.addTotalMenu(m.food_id)}
                      >
                        +
                      </Grid>
                    </Grid>
                    <Grid item xs={5}>
                      <Typography variant="subtitle1" align="left">
                        {m.food_name}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" align="center">
                        {`${m.food_pricetotal} ฿ (${m.orderdetails_price})`}
                      </Typography>
                    </Grid>
                  </Grid>
                );
              })
            : "Please select some food :)"}
        </Grid>
        <Divider light style={{ marginTop: 10 }} />
        <Grid container direction="column" style={{ marginTop: 10 }}>
          <Grid container item xs={12}>
            <Grid item xs={6}>
              <Typography variant="subtitle1" align="left">
                Subtotal
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" align="right">
                {subtotalprice} ฿
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
                {deliveryprice} ฿
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
                0 ฿
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
                {totalprice} ฿
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink htmlFor="mintime">
                Minimum Time
              </InputLabel>
              <Select
                value={this.state.minminute}
                onChange={this.handleChange("minminute")}
                inputProps={{
                  name: "mintime",
                  id: "mintime"
                }}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Not Limit</em>
                </MenuItem>
                {minute.map(m => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                Maybe you have a limit wait a time
              </FormHelperText>
            </FormControl>
            <FormControl fullWidth>
              <TextField
                id="endpoint_details"
                label="Informations Address"
                helperText="Maybe you need more informations of address"
                margin="normal"
                InputLabelProps={{
                  shrink: true
                }}
                multiline
                rows="2"
                value={this.state.endpoint_details}
                onChange={this.handleChange("endpoint_details")}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                id="order_details"
                label="Informations Order"
                helperText="Maybe you need more informations of order"
                margin="normal"
                InputLabelProps={{
                  shrink: true
                }}
                multiline
                rows="2"
                value={this.state.order_details}
                onChange={this.handleChange("order_details")}
              />
            </FormControl>
          </Grid>
          {minPrice < totalprice && minPrice !== null ? (
            <Grid item xs={12} style={{ marginTop: 10 }}>
              <Typography variant="subtitle1" align="center">
                * Too many orders prices
              </Typography>
            </Grid>
          ) : (
            ""
          )}
          <Grid item xs={12} align="center" style={{ marginTop: 10 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => this.handleClickRoleOpen()}
              disabled={
                (minPrice < totalprice && minPrice !== null) || menu.length < 1
              }
            >
              Checkout
            </Button>
          </Grid>
        </Grid>
        <Dialog
          open={this.state.roleopen}
          TransitionComponent={Transition}
          keepMounted
          fullWidth={true}
          onClose={this.handleCloseRole}
          align="center"
        >
          <DialogContent>
            <Button
              variant="outlined"
              color="inherit"
              fullWidth
              onClick={() =>
                this.props.triggerLoginSignupHeader({
                  alertlogin: true,
                  alerttabindex: 0
                })
              }
            >
              Sign In
            </Button>
            <Typography
              variant="h6"
              gutterBottom
              style={{ marginTop: 20 }}
              onClick={() =>
                this.props.triggerLoginSignupHeader({
                  alertlogin: true,
                  alerttabindex: 1
                })
              }
            >
              Create account here.
            </Typography>
            <Divider light gutterBottom style={{ marginTop: 40 }} />
            <Button
              variant="outlined"
              color="inherit"
              fullWidth
              style={{ marginTop: 20 }}
              onClick={() => this.handleOpen()}
            >
              Continue as Guest
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseRole} color="primary">
              CLOSE
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={this.state.success}
          autoHideDuration={6000}
          onClose={this.handleCloseSuccess}
        >
          <MySnackbarContent variant="success" message="Sended OTP!" />
        </Snackbar>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={this.state.failed}
          autoHideDuration={6000}
          onClose={this.handleCloseError}
        >
          <MySnackbarContent variant="error" message="Something has wrong:(" />
        </Snackbar>
      </div>
    );
  }
}

RestaurantDetailsLeftSide.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    menu: state.menu.menu,
    minPrice: state.menu.minPrice,
    isAuthenticated: !!state.user.token
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    {
      updateMenu: updateMenu,
      updateMinPrice: updateMinPrice,
      triggerLoginSignupHeader: triggerLoginSignupHeader,
      updateOrderName: updateOrderName
    }
  )(RestaurantDetailsLeftSide)
);
