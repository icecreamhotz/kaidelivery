import React, { Component } from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/moment";
import { MuiPickersUtilsProvider, DatePicker } from "material-ui-pickers";
import "moment/locale/en-gb";
import moment from "moment";

import API from "../../../helper/api.js";
import CustomerTotalChart from "./CustomerTotalCharts.js";

const selectEndValue = moment().add(1, "M");
const formatValue = moment(selectEndValue).format("YYYY-MM-DD");

class CustomersTotalReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      res_id: 255,
      choice: "0",
      selectedDay: new Date(),
      selectedMonthStart: new Date(),
      selectedYear: new Date(),
      selectedStart: new Date(),
      selectedEnd: formatValue,
      labels: [],
      data: [],
      error: false,
      textError: ""
    };
  }

  componentDidMount() {
    this.searchByDay();
  }

  handleChange = name => e => {
    this.setState({
      [name]: e.target.value
    });
  };

  handleDateChange = name => date => {
    const formatDate = moment(date).format("YYYY-MM-DD");
    this.setState({ [name]: formatDate }, () => this.checkChoiceSearch(name));
  };

  checkChoiceSearch = choice => {
    switch (choice) {
      case "selectedDay":
        this.searchByDay();
        break;
      case "selectedMonthStart":
        this.searchByMonth();
        break;
      case "selectedYear":
        this.searchByYear();
        break;
      case "selectedStart":
        this.searchByStart();
        break;
      case "selectedEnd":
        this.searchByEnd();
        break;
      default:
        break;
    }
  };

  searchByDay = async () => {
    const { res_id, selectedDay, labels } = this.state;
    const checkDay =
      labels.length === 0 ? moment().format("YYYY-MM-DD") : selectedDay;
    const customerTotal = await API.get(
      `orders/report/customer/total/day/${res_id}/${checkDay}`
    );
    const { data } = await customerTotal;

    const total = data.total;
    const label = [moment(selectedDay).format("YYYY-MM-DD")];
    const chartData = [total];
    this.setState({
      labels: label,
      data: chartData
    });
  };

  searchByMonth = async () => {
    const { selectedMonthStart, res_id } = this.state;
    const customerTotal = await API.get(
      `orders/report/customer/total/month/${res_id}/${selectedMonthStart}`
    );
    const { data } = await customerTotal;

    const total = data.total;
    const label = [moment(selectedMonthStart).format("MMMM")];
    const chartData = [total];
    this.setState({
      labels: label,
      data: chartData
    });
  };

  searchByYear = async () => {
    const { selectedYear, res_id } = this.state;
    const customerTotal = await API.get(
      `orders/report/customer/total/year/${res_id}/${selectedYear}`
    );
    const { data } = await customerTotal;

    const total = data.total;
    const label = [moment(selectedYear).format("YYYY")];
    const chartData = [total];
    this.setState({
      labels: label,
      data: chartData
    });
  };

  searchByStart = async () => {
    const { selectedStart, selectedEnd, res_id } = this.state;
    const date = moment(selectedEnd).isAfter(selectedStart);
    if (!date) {
      this.setState({
        error: true,
        textError: "Cant search a start date less than end date"
      });
      return;
    }

    const customerTotal = await API.get(
      `orders/report/customer/total/range/${res_id}/${selectedStart}/${selectedEnd}`
    );
    const { data } = await customerTotal;
    const total = data.total;
    let setLabel = total.map(item => {
      return item.date;
    });
    let setValue = total.map(item => {
      return item.count;
    });
    this.setState({
      error: false,
      textError: "",
      labels: setLabel,
      data: setValue
    });
  };

  searchByEnd = async () => {
    const { selectedStart, selectedEnd, res_id } = this.state;
    const date = moment(selectedStart).isBefore(selectedEnd);
    if (!date) {
      this.setState({
        error: true,
        textError: "Cant search a end date more than start date"
      });
      return;
    }
    const customerTotal = await API.get(
      `orders/report/customer/total/range/${res_id}/${selectedStart}/${selectedEnd}`
    );
    const { data } = await customerTotal;
    const total = data.total;
    let setLabel = total.map(item => {
      return item.date;
    });
    let setValue = total.map(item => {
      return item.count;
    });
    this.setState({
      error: false,
      textError: "",
      labels: setLabel,
      data: setValue
    });
  };

  onClickMonthEnd = () => {};

  render() {
    const {
      choice,
      selectedDay,
      labels,
      data,
      selectedMonthStart,
      selectedYear,
      selectedStart,
      selectedEnd,
      error,
      textError
    } = this.state;
    moment.locale("en");
    return (
      <div>
        <FormControl component="fieldset">
          <FormLabel component="legend">Search Options</FormLabel>
          <RadioGroup
            aria-label="Search Options"
            name="choice"
            value={choice}
            onChange={this.handleChange("choice")}
            row
          >
            <FormControlLabel value="0" control={<Radio />} label="Day" />
            <FormControlLabel value="1" control={<Radio />} label="Month" />
            <FormControlLabel value="2" control={<Radio />} label="Year" />
            <FormControlLabel value="3" control={<Radio />} label="Between" />
          </RadioGroup>
        </FormControl>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container>
            {choice === "0" && (
              <Grid item xs>
                <DatePicker
                  format="YYYY-MM-DD"
                  label="Date picker"
                  value={selectedDay}
                  onChange={this.handleDateChange("selectedDay")}
                />
              </Grid>
            )}
            {choice === "1" && (
              <Grid item xs>
                <div className="picker">
                  <DatePicker
                    views={["month"]}
                    label="Month"
                    value={selectedMonthStart}
                    format="MMMM"
                    onChange={this.handleDateChange("selectedMonthStart")}
                  />
                </div>
              </Grid>
            )}
            {choice === "2" && (
              <Grid item xs>
                <div className="picker">
                  <DatePicker
                    views={["year"]}
                    label="Year"
                    value={selectedYear}
                    format="YYYY"
                    onChange={this.handleDateChange("selectedYear")}
                    animateYearScrolling
                  />
                </div>
              </Grid>
            )}
            {choice === "3" && (
              <div>
              <Grid item container direction="row" alignItems="center">
                <Grid item>
                  <div className="picker">
                    <DatePicker
                      label="From"
                      value={selectedStart}
                      format="YYYY-MM-DD"
                      onChange={this.handleDateChange("selectedStart")}
                    />
                  </div>
                </Grid>
                <Grid
                  item
                  style={{
                    paddingLeft: 15,
                    paddingRight: 15
                  }}
                >
                  -
                </Grid>
                <Grid item>
                  <div className="picker">
                    <DatePicker
                      label="To"
                      value={selectedEnd}
                      format="YYYY-MM-DD"
                      onChange={this.handleDateChange("selectedEnd")}
                    />
                  </div>
                </Grid>
              </Grid>
              {
                error ?
                <Typography variant="h6" gutterBottom>
        { textError }
      </Typography>
                :
                ""
              }
              
      </div>
            )}
          </Grid>
        </MuiPickersUtilsProvider>
        <CustomerTotalChart labels={labels} data={data} />
      </div>
    );
  }
}

export default CustomersTotalReport;
