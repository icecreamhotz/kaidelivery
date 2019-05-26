import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import API from "../../helper/api.js";

import "./rate.scss";

class RateEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: null,
      temp_rating: null,
      user: props.user,
      employee: props.employee,
      comment: "",
      order_id: props.order_id
    };
  }

  setRate = rating => {
    this.setState({
      rating: rating,
      temp_rating: rating
    });
  };

  star_over = rating => {
    const temp_rating = this.state.temp_rating;

    this.setState({
      rating: rating,
      temp_rating: temp_rating
    });
  };

  star_out = () => {
    const temp_rating = this.state.temp_rating;

    this.setState({ rating: temp_rating });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  submitRatingAndComment = () => {
    const { rating, comment, employee, user, order_id } = this.state;

    API.post(`orders/comment/employee`, {
      order_id: order_id,
      rating: rating + 1,
      comment: comment,
      user_id: user.user_id,
      emp_id: employee.emp_id
    })
      .then(() => {
        this.props.setRatingStep(1);
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { employee } = this.state;
    let stars = [];

    for (let i = 0; i < 5; i++) {
      let klass = "star-rating__star";

      if (this.state.rating >= i && this.state.rating != null) {
        klass += " is-selected";
      }

      stars.push(
        <label
          className={klass}
          onClick={() => this.setRate(i)}
          onMouseOver={() => this.star_over(i)}
          onMouseOut={() => this.star_out()}
        >
          ★
        </label>
      );
    }
    return (
      <div>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom align="center">
              Rate Employee
            </Typography>
            <Typography variant="body1" gutterBottom align="center">
              {`${employee.emp_name} ${employee.emp_lastname}`}
            </Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <Avatar
              alt="employee"
              src={`https://kaidelivery-api.herokuapp.com/employees/${employee.emp_avatar}`}
              style={{ width: 120, height: 120 }}
            />
          </Grid>
          <Grid item xs={12} align="center">
            <div className="star-rating">{stars}</div>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subheading" gutterBottom align="center">
              Put your comments into the box below.
            </Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <TextField
              id="comment"
              label="Comment"
              value={this.state.comment}
              onChange={this.handleChange("comment")}
              margin="normal"
              style={{
                width: "50%"
              }}
              InputLabelProps={{
                shrink: true
              }}
              multiline
              rows="3"
            />
          </Grid>
          <Grid
            item
            xs={12}
            align="center"
            style={{
              marginTop: 10
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.submitRatingAndComment()}
              disabled={this.state.rating === null}
            >
              submit
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default RateEmployee;
