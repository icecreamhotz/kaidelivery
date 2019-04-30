import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import "moment/locale/th";
import API from "../../helper/api.js";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";

class EmployeeRateAndComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      scroll: "paper",
      employee: props.employee,
      employeeScore: []
    };
  }

  componentDidMount() {
    this.loadEmployeeComment();
  }

  loadEmployeeComment = async () => {
    const { employee } = this.state;
    const score = await API.get(`employees/score/comment/${employee.emp_id}`);
    const { data } = await score;
    const scoreData = data.data;
    this.setState({
      employeeScore: scoreData
    });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { employee, employeeScore } = this.state;
    console.log(employeeScore);
    return (
      <div>
        <Typography
          variant="body2"
          align="right"
          onClick={this.handleClickOpen}
          component="span"
        >
          Detail
        </Typography>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          scroll={this.state.scroll}
          aria-labelledby="scroll-dialog-title"
        >
          <DialogTitle id="scroll-dialog-title">
            Comment{" / "}
            <img
              alt=""
              src="https://assets.foodora.com/819a336/img/icons/ic-star-sm.svg?819a336"
            />
            {typeof employee.employeescores[0].rating === "undefined"
              ? "3.00"
              : parseFloat(employee.employeescores[0].rating).toFixed(2)}
            {` (${employee.emp_name} ${employee.emp_lastname})`}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Grid container>
                {employeeScore.map((item, idx) => {
                  const messageTime = moment(item.empscore_date).format(
                    "YYYY-MM-DD"
                  );
                  const rating = parseFloat(item.empscore_rating).toFixed(2);
                  return (
                    <Grid
                      item
                      container
                      key={idx}
                      style={{
                        marginTop: idx === 0 ? 0 : 15
                      }}
                    >
                      <Grid
                        item
                        container
                        direction="row"
                        alignItems="center"
                        xs={12}
                      >
                        <Grid item>
                          <Avatar
                            alt="Remy Sharp"
                            src={`http://localhost:3000/users/${
                              item.user.avatar
                            }`}
                          />
                        </Grid>
                        <Grid item>
                          <Typography
                            variant="body1"
                            component="h6"
                            style={{
                              marginLeft: 15
                            }}
                          >
                            {`${item.user.name} ${item.user.lastname}`}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          {item.empscore_comment}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} align="right">
                        <Typography variant="body2" component="span">
                          <img
                            alt=""
                            src="https://assets.foodora.com/819a336/img/icons/ic-star-sm.svg?819a336"
                          />{" "}
                          {rating}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} align="right">
                        <Typography variant="caption">{messageTime}</Typography>
                      </Grid>
                      <Divider
                        light
                        style={{
                          marginTop: 15,
                          width: "100%"
                        }}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default EmployeeRateAndComment;
