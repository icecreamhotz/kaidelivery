import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import API from "../../helper/api.js";
import "moment/locale/th";
import moment from "moment";

import DetailsDialogComponent from "./DetailsDialogComponent";

moment.locale("th");

class HistoryComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [],
      open: false,
      details: null
    };
  }

  componentDidMount() {
    this.loadMyOrdersHistory();
  }

  loadMyOrdersHistory = async () => {
    const history = await API.get("orders/history/user");
    const { data } = await history;
    const historyData = data.data;
    console.log(historyData);

    this.setState({
      history: historyData,
      details: historyData[0]
    });
  };

  handleClose = () => {
    this.setState({
      open: false
    });
  };

  onClickOpenDetails = data => {
    this.setState({
      open: true,
      details: data
    });
  };

  render() {
    const { history, open, details } = this.state;
    return (
      <div className="content-start kai-container">
        {open && details !== null && (
          <DetailsDialogComponent
            details={details}
            open={open}
            handleClose={this.handleClose}
          />
        )}
        <Typography variant="h3" gutterBottom>
          History
        </Typography>
        <Divider light />
        <Grid
          container
          style={{
            paddingTop: 15
          }}
          spacing={16}
        >
          {history.map(item => {
            const orderDate = moment(item.created_at).format("YYYY-MM-DD");
            const orderStatus =
              item.order_status === "4"
                ? "Success"
                : `Cancel (${item.order_statusdetails})`;
            const subTotal =
              item.order_price !== null
                ? parseFloat(item.order_price)
                : parseFloat(item.totalPrice);
            const deliveryPrice = parseFloat(item.order_deliveryprice);
            const total = subTotal + deliveryPrice;
            return (
              <Grid
                item
                container
                style={{
                  cursor: "pointer"
                }}
                onClick={() => this.onClickOpenDetails(item)}
                key={item.order_id}
              >
                <Paper elevation={1} style={{ padding: 15, width: "100%" }}>
                  <Grid item container spacing={8}>
                    <Grid item xs={6}>
                      <Typography variant="h6">{item.order_name}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" align="right">
                        {orderDate}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        style={{ fontSize: 15, color: "#6bef4a" }}
                      >
                        {orderStatus}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">From</Typography>
                      <Typography variant="subtitle2">
                        {item.restaurant.res_name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">To</Typography>
                      <Typography variant="subtitle2">
                        {item.endpoint_name}
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
                        <Typography variant="subtitle2">Total</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" align="right">
                          {total.toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </div>
    );
  }
}

export default HistoryComponent;
