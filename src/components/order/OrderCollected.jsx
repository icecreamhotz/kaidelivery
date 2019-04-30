import React from 'react'
import Lottie from 'react-lottie';
import Typography from "@material-ui/core/Typography";

export default class OrderCollected extends React.Component {
 
  constructor(props) {
    super(props);
    this.state = {isStopped: false, isPaused: false};
  }
 
  render() {
    const defaultOptions = {
      autoplay: true, 
      animationData: require('../../resource/animations/order_collected.json'),
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };
 
    return <div>
      <Lottie options={defaultOptions}
              height={400}
              width={400}
              isStopped={this.state.isStopped}
              isPaused={this.state.isPaused}/>
        <Typography variant="h4" gutterBottom align="center">
            Passenger accept your order, Now we are going to your restaurant order.
        </Typography>
    </div>
  }
}