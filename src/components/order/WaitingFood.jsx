import React from 'react'
import Lottie from 'react-lottie';
import Typography from "@material-ui/core/Typography";

export default class WaitingFood extends React.Component {
 
  constructor(props) {
    super(props);
    this.state = {isStopped: false, isPaused: false};
  }
 
  render() {
    const defaultOptions = {
      autoplay: true, 
      animationData: require('../../resource/animations/waiting_food.json'),
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
            Now we have ordered food for you and are waiting for food.
        </Typography>
    </div>
  }
}