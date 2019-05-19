import React, { Component } from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Typography from "@material-ui/core/Typography";
import LookingEmployee from "./LookingEmployee";
import WaitingFood from "./WaitingFood";
import SuccessOrder from "./SuccessOrder";
import SendOrder from "./SendOrder";
import FailOrder from "./FailOrder";
import OrderCollected from "./OrderCollected";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import "moment/locale/th";

import moment from "moment";
import Loading from "../loaders/loading";
import API from "../../helper/api.js";
import firebase from "../../helper/firebase.js";
import ChatComponent from "./ChatComponent";
import RateEmployee from "./RateEmployee";
import RateRestaurant from "./RateRestaurant";
import OrderNotFound from "./OrderNotFound";
import EmployeeRateAndComment from "./EmployeeRateAndComment";

moment.locale("th");

function getSteps() {
  return [
    "Looking a passenger",
    "Order Collected",
    "Waiting for food",
    "On The Way",
    "Delivered"
  ];
}

class WaitingOrder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStep: 4,
      orderName: props.orderName,
      order_id: "",
      order_details: [],
      user: "",
      employee: null,
      deliveryprice: 0,
      loading: true,
      orderDetails: "",
      endpointDetails: "",
      restaurant: "",
      activeRateStep: 0,
      order_statusdetails: "",
      loadingFirebase: true
    };
  }

  componentDidMount() {
    this.checkOrderIsCollected();
    this.checkOrderStatus();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.orderName !== this.props.orderName) {
      this.setState({
        orderName: nextProps.orderName
      });
    }
  }

  checkOrderIsCollected = () => {
    let order = firebase
      .database()
      .ref("Orders")
      .child(this.state.orderName);
    order.on("value", snapshotorder => {
      if (snapshotorder.val() === null) {
        let delivery = firebase
          .database()
          .ref("Delivery")
          .child(this.state.orderName);
        delivery.on("value", async snapshotdelivery => {
          if (snapshotdelivery.val() === null) {
            const foodanddetails = await API.get(
              `orders/name/${this.state.orderName}`
            );
            const { data } = await foodanddetails;
            const realData = data.data[0];
            if (typeof realData !== "undefined" || realData.order_id === null) {
              const { employee } = this.state;
              if (employee === null) {
                this.checkOrderStatus();
                return;
              }
              const status = parseInt(realData.order_status);
              this.setState({
                activeStep: status,
                order_statusdetails: realData.order_statusdetails,
                loadingFirebase: false
              });
            } else {
              this.setState({
                activeStep: 6,
                loadingFirebase: false
              });
            }
          } else {
            const { employee } = this.state;
            if (employee === null) {
              this.checkOrderStatus();
              return;
            }
            const status = snapshotdelivery.val().status;
            this.setState({
              activeStep: status,
              loadingFirebase: false
            });
          }
        });
      } else {
        this.setState({
          activeStep: 0,
          loadingFirebase: false
        });
      }
    });
  };

  setRatingStep = index => {
    this.setState({
      activeRateStep: index
    });
  };

  checkOrderStatus = async () => {
    const foodanddetails = await API.get(`orders/name/${this.state.orderName}`);
    const { data } = await foodanddetails;
    const realData = data.data[0];
    console.log(realData);
    if (typeof realData === "undefined" || realData.order_id === null) {
      this.setState({
        activeStep: 6,
        loading: false,
        loadingFirebase: false
      });
    } else {
      const status = parseInt(realData.order_status);
      this.setState({
        activeStep: status,
        order_id: realData.order_id,
        order_details: realData.orderdetails,
        user: realData.user,
        employee: realData.employee,
        deliveryprice: realData.order_deliveryprice,
        loading: false,
        orderDetails: realData.order_details,
        endpointDetails: realData.endpoint_details,
        restaurant: realData.restaurant,
        order_statusdetails: realData.order_statusdetails
      });
    }
  };
  render() {
    const {
      activeStep,
      order_details,
      employee,
      user,
      deliveryprice,
      loading,
      endpointDetails,
      orderDetails,
      restaurant,
      loadingFirebase
    } = this.state;
    if (loading || loadingFirebase)
      return <Loading loaded={loading || loadingFirebase} />;
    let steps;
    let subtotal;
    let total;
    if (activeStep !== 6) {
      steps = getSteps();
      subtotal = order_details
        .map(
          item => item.orderdetail_total * parseFloat(item.orderdetail_price)
        )
        .reduce((prev, next) => prev + next)
        .toFixed(2);
      total = (parseFloat(subtotal) + parseFloat(deliveryprice)).toFixed(2);
    }
    let guestUser = { name: 'Guest', lastname: 'Guest', user_id: null, avatar: 'noimg.png' } 
    const checkUser = user === null ? guestUser : user
    console.log(order_details)
    return (
      <div className="content-start kai-container">
        {activeStep === 6 ? (
          <OrderNotFound orderName={this.state.orderName} />
        ) : (
          ""
        )}
        {activeStep < 5 && (
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}
        {activeStep === 0 ? <LookingEmployee /> : ""}
        {activeStep === 1 ? <OrderCollected /> : ""}
        {activeStep === 2 ? <WaitingFood /> : ""}
        {activeStep === 3 ? <SendOrder /> : ""}
        {activeStep === 4 ? <SuccessOrder /> : ""}
        {activeStep === 5 ? (
          <FailOrder order_statusdetails={this.state.order_statusdetails} />
        ) : (
          ""
        )}
        {activeStep < 4 && activeStep !== 0 ? (
          <div>
            <Typography variant="h6" gutterBottom>
              Order Details
            </Typography>
            <Typography variant="body1" gutterBottom>
              Foods
            </Typography>

            <Grid container>
              {order_details.map(od => {
                const totalPrice = parseFloat(
                  od.orderdetail_price * od.orderdetail_total
                ).toFixed(2);
                return (
                  <Grid container item style={{ marginBottom: 20 }}>
                    <Grid item xs={12}>
                      <Paper elevation={1} style={{ padding: 15 }}>
                        <Grid container spacing={24}>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              {od.food.food_name}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" align="right">
                              {`x${od.orderdetail_total} ${totalPrice}B (${
                                od.orderdetail_price
                              })`}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
            <Grid container>
              <Grid container item xs={12}>
                <Paper elevation={1} style={{ padding: 15, width: "100%" }}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography variant="body2">Order Details</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2">
                        {orderDetails === null ? "-" : orderDetails}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2">Endpoint Details</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2">
                        {endpointDetails === null ? "-" : endpointDetails}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2">Passenger</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="body2" component="span">
                        {`${employee.emp_name} ${employee.emp_lastname}`}
                        <img
                          alt=""
                          src="https://assets.foodora.com/819a336/img/icons/ic-star-sm.svg?819a336"
                        />
                        {typeof employee.employeescores[0].rating ===
                        "undefined"
                          ? "3.00"
                          : parseFloat(
                              employee.employeescores[0].rating
                            ).toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <EmployeeRateAndComment employee={employee} />
                    </Grid>
                    <Grid item xs={12} style={{ marginTop: 20 }}>
                      <Divider />
                    </Grid>
                    <Grid item container xs={12} style={{ marginTop: 20 }}>
                      <Grid item xs={6}>
                        <Typography variant="h6">Subtotal</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" align="right">
                          {subtotal}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item container xs={12}>
                      <Grid item xs={6}>
                        <Typography variant="h6">Delivery Price</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" align="right">
                          {deliveryprice}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item container xs={12}>
                      <Grid item xs={6}>
                        <Typography variant="h6">Total</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" align="right">
                          {total}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
            <ChatComponent
              orderName={this.state.orderName}
              employee={employee}
              user={checkUser}
            />
          </div>
        ) : (
          ""
        )}
        {activeStep === 4 ? (
          <div>
            {this.state.activeRateStep === 0 ? (
              <RateEmployee
                employee={employee}
                setRatingStep={this.setRatingStep}
                user={checkUser}
              />
            ) : (
              ""
            )}
            {this.state.activeRateStep === 1 ? (
              <RateRestaurant
                user={checkUser}
                restaurant={restaurant}
                setRatingStep={this.setRatingStep}
              />
            ) : (
              ""
            )}
            {this.state.activeRateStep === 2 ? (
              <Typography
                variant="body2"
                style={{
                  textAlign: "center"
                }}
              >
                Thank for comment.
              </Typography>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    orderName: state.order.orderName
  };
}

export default connect(
  mapStateToProps,
  null
)(WaitingOrder);
