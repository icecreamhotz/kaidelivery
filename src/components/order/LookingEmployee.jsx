import React from "react";
import Lottie from "react-lottie";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import firebase from "../../helper/firebase.js";

export default class LookingEmployee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isStopped: false,
      isPaused: false,
      employeeTotal: "",
      myQueue: "",
      allQueue: "",
      previousQueue: "",
      orderName: props.orderName
    };
  }

  componentDidMount() {
    this.getEmployeeTotal();
    this.getQueueData();
  }

  getEmployeeTotal = () => {
    let employee = firebase.database().ref("Employees");
    employee.on("value", snapshot => {
      if (snapshot.val() !== null) {
        let totalemp = 0;
        snapshot.forEach(item => {
          totalemp += 1;
        });
        this.setState({
          employeeTotal: totalemp
        });
      } else {
        this.setState({
          employeeTotal: 0
        });
      }
    });
  };

  getQueueData = () => {
    const { orderName } = this.state;
    let queue = firebase.database().ref("Orders");
    queue.on("value", snapshot => {
      if (snapshot.val() !== null) {
        let totalqueue = 0;
        let myqueue = 0;
        snapshot.forEach(item => {
          totalqueue += 1;
          if (item === orderName) {
            myqueue = totalqueue;
          }
        });
        const previousQueue = myqueue - 1;
        this.setState({
          allQueue: totalqueue,
          myQueue: myqueue,
          previousQueue: previousQueue
        });
      }
    });
  };

  render() {
    const { employeeTotal, myQueue, allQueue, previousQueue } = this.state;
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: require("../../resource/animations/looking_employee.json"),
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };

    return (
      <div>
        <Grid container>
          <Grid item xs={12}>
            <Paper
              elevation={1}
              style={{
                padding: 15
              }}
            >
              <Typography component="p">
                Employee Online : {employeeTotal}
              </Typography>
              <Typography component="p">Total Queue : {allQueue}</Typography>
              <Typography component="p">
                Previous Queue : {previousQueue === -1 ? "0" : previousQueue}
              </Typography>
              <Typography component="p">
                My Queue : {myQueue === 0 ? "1" : myQueue}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Lottie
          options={defaultOptions}
          height={400}
          width={400}
          isStopped={this.state.isStopped}
          isPaused={this.state.isPaused}
        />
        <Typography variant="h4" gutterBottom align="center">
          Looking some passenger...
        </Typography>
      </div>
    );
  }
}
