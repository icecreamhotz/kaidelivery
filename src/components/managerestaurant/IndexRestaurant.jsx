import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import blue from "@material-ui/core/colors/blue";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import lightGreen from "@material-ui/core/colors/lightGreen";
import Home from "@material-ui/icons/Home";
import Edit from "@material-ui/icons/Edit";
import DeleteForever from "@material-ui/icons/DeleteForever";
import Divider from "@material-ui/core/Divider";
import FastFood from "@material-ui/icons/Fastfood";
import Assessment from "@material-ui/icons/Assessment";
import { connect } from "react-redux";
import {
  updateTriggerComponent,
  updateRestaurantName
} from "../../actions/restaurant";
import API from "../../helper/api";
import Loading from "../loaders/loading";
import SweetAlert from "sweetalert-react";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";

import InfoRestaurant from "./retreive/InfoRestaurant";
import EditRestaurant from "./edit/EditRestaurant";
import CreateFoodComponent from "./../managefoods/create/CreateFoodComponent";
import InfoFoods from "../managefoods/retreive/InfoFoods";
import CustomersTotalReport from "./report/CustomersTotalReport";


const styles = theme => ({
  paper: {
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  root: {
    flexGrow: 1
  },
  grid: {
    height: 400
  },
  infoGrid: {
    height: 100
  },
  addGridIcon: {
    backgroundColor: lightGreen["A400"]
  },
  infoGridIcon: {
    backgroundColor: blue[400]
  },
  editGridIcon: {
    backgroundColor: green["A200"]
  },
  deleteGridIcon: {
    backgroundColor: red[400]
  },
  largeIcon: {
    width: 60,
    height: 60
  },
  pointerHover: {
    "&:hover": {
      cursor: "pointer"
    }
  }
});

class IndexRestaurant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      res_id: "",
      res_status: "",
      res_rate: 0,
      component: 0,
      open: false,
      loading: true,
      type: "info",
      text: "Do you need delete ?",
      title: "Warning",
      myrestaurantClick: props.resComponent
    };
  }

  async componentDidMount() {
    await this.fetchRestaurantID();
  }

  fetchRestaurantID = async () => {
    const resname = decodeURI(this.props.match.params.resname);
    const restaurants = await API.post(`restaurants/`, { res_name: resname });
    const { data } = await restaurants;

    const status = data.data.res_status;
    let resStatus;
    if (status === "0") {
      resStatus = this.props.intl.formatMessage({id: 'information.approval'});
    } else if (status === "1") {
      resStatus = this.props.intl.formatMessage({id: 'information.approved'});
    } else if (status === "2") {
      resStatus = this.props.intl.formatMessage({id: 'information.closed'});
    }
    this.setState({
      res_id: data.data.res_id,
      res_status: resStatus,
      res_rate: data.data.res_quota,
      loading: false
    });
  };

  changeValueComponent = value => {
    this.setState({ component: value });
  };
  
  componentWillReceiveProps(newProps) {
    if (newProps.resComponent !== this.state.myrestaurantClick) {
       this.fetchRestaurantID();
      this.setState(
        { component: 0, myrestaurantClick: newProps.resComponent },
        () => {
          this.props.updateTriggerComponent(this.state.myrestaurantClick);
        }
      );
    }
  }

  sweetalert = () => {
    const { type } = this.state;
    if (type === "success") {
      this.setState({
        open: false
      });
    }
    if (type === "info") {
      this.deleteRestaurant();
    }
  };

  askDelete = () => {
    this.setState({
      open: true
    });
  };

  deleteRestaurant = () => {
    this.setState(
      {
        open: false,
        loading: true
      },
      () => {
        API.post(`restaurants/delete`, { res_id: this.state.res_id }).then(
          () => {
            this.setState(
              {
                loading: false
              },
              () => {
                setTimeout(() => {
                  this.setState({
                    type: "success",
                    text: "Close restaurant successful",
                    title: "Success",
                    open: true,
                    res_status: "Closed"
                  });
                }, 100);
              }
            );
          }
        );
      }
    );
  };

  render() {
    const { classes } = this.props;
    const { component, res_status, res_rate } = this.state;
    return (
      <div className="content-start">
        {this.state.loading ? <Loading loaded={this.state.loading} /> : ""}
        <Typography variant="h4" gutterBottom>
          {`${decodeURI(this.props.match.params.resname)} (${res_status})`}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <FormattedMessage id="information.ratio" />{`: ${res_rate}%`}
        </Typography>
        {component === 0 && (
          <Grid container className={classes.root}>
            <Grid
              item
              container
              xs={12}
              className={classes.grid}
              alignItems="center"
            >
              <Grid container direction="column">
                <Grid item xs={12}>
                  <Typography variant="h3" gutterBottom>
                    <FormattedMessage id="information.menu" />
                  </Typography>
                </Grid>
                <Divider style={{ width: "100%" }} />
                <Grid item container spacing={24} style={{ marginTop: 15 }}>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    className={classes.pointerHover}
                    onClick={() => this.changeValueComponent(1)}
                  >
                    <Paper className={classes.paper}>
                      <Grid item className={classes.infoGrid} container>
                        <Grid
                          item
                          className={classes.infoGridIcon}
                          container
                          sm={4}
                          alignItems="center"
                          justify="center"
                        >
                          <Home className={classes.largeIcon} />
                        </Grid>
                        <Grid
                          item
                          container
                          sm
                          alignItems="center"
                          justify="center"
                        >
                          <FormattedMessage id="information.informations" />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    className={classes.pointerHover}
                    onClick={() => this.changeValueComponent(2)}
                  >
                    <Paper className={classes.paper}>
                      <Grid item className={classes.infoGrid} container>
                        <Grid
                          item
                          className={classes.editGridIcon}
                          container
                          sm={4}
                          alignItems="center"
                          justify="center"
                        >
                          <Edit className={classes.largeIcon} />
                        </Grid>
                        <Grid
                          item
                          container
                          sm
                          alignItems="center"
                          justify="center"
                        >
                          <FormattedMessage id="information.edit" />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    className={classes.pointerHover}
                    onClick={() => this.askDelete()}
                  >
                    <Paper className={classes.paper}>
                      <Grid item className={classes.infoGrid} container>
                        <Grid
                          item
                          className={classes.deleteGridIcon}
                          container
                          sm={4}
                          alignItems="center"
                          justify="center"
                        >
                          <DeleteForever className={classes.largeIcon} />
                        </Grid>
                        <Grid
                          item
                          container
                          sm
                          alignItems="center"
                          justify="center"
                        >
                          <FormattedMessage id="information.delete" />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              container
              xs={12}
              className={classes.grid}
              alignItems="center"
            >
              <Grid container direction="column">
                <Grid item xs={12}>
                  <Typography variant="h3" gutterBottom>
                    <FormattedMessage id="information.food" />
                  </Typography>
                </Grid>
                <Divider style={{ width: "100%" }} />
                <Grid item container spacing={24} style={{ marginTop: 15 }}>
                  <Grid
                    item
                    xs={12}
                    sm
                    className={classes.pointerHover}
                    onClick={() => this.changeValueComponent(4)}
                  >
                    <Paper className={classes.paper}>
                      <Grid item className={classes.infoGrid} container>
                        <Grid
                          item
                          className={classes.addGridIcon}
                          container
                          sm={4}
                          alignItems="center"
                          justify="center"
                        >
                          <FastFood className={classes.largeIcon} />
                        </Grid>
                        <Grid
                          item
                          container
                          sm
                          alignItems="center"
                          justify="center"
                        >
                          <FormattedMessage id="information.addfood" />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm
                    className={classes.pointerHover}
                    onClick={() => this.changeValueComponent(3)}
                  >
                    <Paper className={classes.paper}>
                      <Grid item className={classes.infoGrid} container>
                        <Grid
                          item
                          className={classes.infoGridIcon}
                          container
                          sm={4}
                          alignItems="center"
                          justify="center"
                        >
                          <Home className={classes.largeIcon} />
                        </Grid>
                        <Grid
                          item
                          container
                          sm
                          alignItems="center"
                          justify="center"
                        >
                          <FormattedMessage id="information.foodinformations" />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              container
              xs={12}
              className={classes.grid}
              alignItems="center"
            >
              <Grid container direction="column">
                <Grid item xs={12}>
                  <Typography variant="h3" gutterBottom>
                    <FormattedMessage id="information.report" />
                  </Typography>
                </Grid>
                <Divider style={{ width: "100%" }} />
                <Grid
                  item
                  container
                  spacing={24}
                  style={{ marginTop: 15 }}
                  xs={6}
                >
                  <Grid
                    item
                    sm
                    className={classes.pointerHover}
                    onClick={() => this.changeValueComponent(5)}
                  >
                    <Paper className={classes.paper}>
                      <Grid item className={classes.infoGrid} container>
                        <Grid
                          item
                          style={{
                            backgroundColor: "#df42f4"
                          }}
                          container
                          sm={4}
                          alignItems="center"
                          justify="center"
                        >
                          <Assessment className={classes.largeIcon} />
                        </Grid>
                        <Grid
                          item
                          container
                          sm
                          alignItems="center"
                          justify="center"
                        >
                          <FormattedMessage id="information.customers" />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
        {component === 1 && <InfoRestaurant res_id={this.state.res_id} />}
        {component === 2 && (
          <EditRestaurant
            changeValueComponent={this.changeValueComponent}
            res_id={this.state.res_id}
          />
        )}
        {component === 3 && (
          <InfoFoods
            changeValueComponent={this.changeValueComponent}
            res_id={this.state.res_id}
          />
        )}
        {component === 4 && (
          <CreateFoodComponent
            changeValueComponent={this.changeValueComponent}
            res_id={this.state.res_id}
          />
        )}
        {component === 5 && <CustomersTotalReport res_id={this.state.res_id} />}
        <SweetAlert
          show={this.state.open}
          title={this.state.title}
          text={this.state.text}
          type={this.state.type}
          showCancelButton
          onConfirm={() => {
            if (this.state.open) this.sweetalert();
          }}
          onCancel={() => {
            if (this.state.open) this.setState({ open: !this.state.open });
          }}
          onEscapeKey={() => {
            if (this.state.open) this.setState({ open: !this.state.open });
          }}
          onOutsideClick={() => {
            if (this.state.open) this.setState({ open: !this.state.open });
          }}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    resComponent: state.update.resComponent
  };
}

IndexRestaurant.propTypes = {
  classes: PropTypes.object.isRequired,
  updateRestaurantName: PropTypes.func.isRequired,
   intl: intlShape.isRequired
};

export default withRouter(
  injectIntl(
  connect(
    mapStateToProps,
    {
      updateTriggerComponent: updateTriggerComponent,
      updateRestaurantName: updateRestaurantName
    }
  )(withStyles(styles, { withTheme: true })(IndexRestaurant)))
);
