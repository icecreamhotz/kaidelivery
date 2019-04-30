import React from 'react'
import Lottie from 'react-lottie';
import Typography from "@material-ui/core/Typography";

export default class SendOrder extends React.Component {
 
  constructor(props) {
    super(props);
    this.state = {isStopped: false, isPaused: false};
  }
 
  render() {
    const defaultOptions = {
      autoplay: true, 
      animationData: require('../../resource/animations/sending_order.json'),
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
            Now we are going to deliver food for you.
        </Typography>
    </div>
  }
}