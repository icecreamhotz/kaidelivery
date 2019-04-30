import React, { Component } from 'react';
import Lottie from "react-lottie";
import Typography from "@material-ui/core/Typography";

class OrderNotFound extends Component {
    constructor(props) {
    super(props);
    this.state = {
      isStopped: false,
      isPaused: false,
    };
  }

  render() {
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: require("../../resource/animations/404_notfound.json"),
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
                <Typography variant="h6" style={{
                    textAlign: 'center'
                }}>
                    Order Not Found :(
                </Typography>
            </div>
        );
    }
}

export default OrderNotFound;