import React, { Component } from "react";
import Lottie from "react-lottie";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

class NoData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isStopped: false,
      isPaused: false,
      order_statusdetails: props.order_statusdetails
    };
  }

  render() {
    const defaultOptions = {
      autoplay: true,
      animationData: require("../../resource/animations/no_data.json"),
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };
    return (
      <div className="content-start kai-container">
        <Lottie
          options={defaultOptions}
          height={400}
          width={400}
          isStopped={this.state.isStopped}
          isPaused={this.state.isPaused}
        />
        <Typography variant="h4" gutterBottom align="center">
          Orders not found.
        </Typography>
        <Typography variant="h6" gutterBottom align="center">
          <Link to="/">Click here to order now.</Link>
        </Typography>
      </div>
    );
  }
}

export default NoData;
