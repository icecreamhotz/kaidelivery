import React, { Component } from "react";
import { Line, Bar } from "react-chartjs-2";

const options = {
  legend: {
    display: false
  },
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          min: 0,
          callback: function(value) {
            if (value % 1 === 0) {
              return value;
            }
          }
        }
      }
    ]
  }
};

class CustomerTotalCharts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      labels: props.labels,
      data: props.data
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.labels !== this.state.labels ||
      nextProps.data !== this.state.data
    ) {
      this.setState({
        labels: nextProps.labels,
        data: nextProps.data
      });
    }
  }

  render() {
    const { labels, data } = this.state;
    return (
      <div
        style={{
          marginTop: 15
        }}
      >
        <Bar
          data={{
            labels: labels,
            datasets: [
              {
                label: "CustomerTotal",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: "butt",
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: "miter",
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: data
              }
            ]
          }}
          options={options}
        />
      </div>
    );
  }
}

export default CustomerTotalCharts;
