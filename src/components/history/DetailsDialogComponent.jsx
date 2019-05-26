import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import "moment/locale/th";
import moment from "moment";

moment.locale("th");

class DetailsDialogComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: props.open,
      details: props.details
    };
  }

  render() {
    const { details } = this.state;
    const { handleClose } = this.props;
    const orderStatus =
      details.order_status === "4"
        ? "Success"
        : `Cancel ${(details.order_statusdetails === null ? "" : details.order_statusdetails)}`;
    const orderTime = moment(details.created_at).format("YYYY-MM-DD");
    const endpointDetail =
      details.endpoint_details === null ? "No data" : details.endpoint_details;
    const orderDetail =
      details.order_details === null ? "No data" : details.order_details;
    const subTotal =
      details.order_price !== null
        ? parseFloat(details.order_price)
        : parseFloat(details.totalPrice);
    const deliveryPrice = parseFloat(details.order_deliveryprice);
    const total = subTotal + deliveryPrice;
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {details.order_name}
            <Typography
              component={"span"}
              variant="subtitle1"
              style={{ fontSize: 15, color: "#6bef4a" }}
            >
              {orderStatus}
            </Typography>
            <Typography variant="caption">{orderTime}</Typography>
            <Divider light />
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">From</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption">
                  {details.restaurant.res_name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Endpoint Name</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption">
                  {details.endpoint_name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Endpoint Details</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption">{endpointDetail}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Order Details</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption">{orderDetail}</Typography>
              </Grid>
              <Grid item container>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Food Lists</Typography>
                </Grid>
                {details.orderdetails.map(foods => {
                  const priceTotal =
                    foods.orderdetail_total *
                    parseFloat(foods.orderdetail_price);
                  return (
                    <Grid item container xs={12} key={foods.orderdetail_id}>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          {foods.food.food_name}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" align="right">
                          {`x${foods.orderdetail_total}`}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant="caption" align="right">
                          {priceTotal.toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Employee</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption">{(details.employee === null ? "" : `${details.employee.emp_name} ${
                  details.employee.emp_lastname
                }`)}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Received Time</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption">
                  {details.order_timeout}
                </Typography>
              </Grid>
              <Grid
                item
                container
                style={{
                  paddingTop: 5
                }}
              >
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Subtotal</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" align="right">
                    {subTotal.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Delivery</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" align="right">
                    {deliveryPrice.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Total{(details.order_price === null ? "" : `(custom)`)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" align="right">
                    {(details.order_price === null ? "" : `(${details.order_price}) `)}{total.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              CLOSE
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default DetailsDialogComponent;
