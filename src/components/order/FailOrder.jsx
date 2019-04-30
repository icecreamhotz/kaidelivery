import React from "react";
import Lottie from "react-lottie";
import Typography from "@material-ui/core/Typography";

export default class FailOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isStopped: false,
      isPaused: false,
      order_statusdetails: props.order_statusdetails
    };
  }

  render() {
    const { order_statusdetails } = this.state;
    const defaultOptions = {
      autoplay: true,
      animationData: require("../../resource/animations/failed_order.json"),
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };

    return (
      <div>
        <Lottie
          options={defaultOptions}
          height={400}
          width={400}
          isStopped={this.state.isStopped}
          isPaused={this.state.isPaused}
        />
        <Typography variant="h4" gutterBottom align="center">
          This order has been canceled due to {order_statusdetails}
        </Typography>
      </div>
    );
  }
}
