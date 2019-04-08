import React, { Component } from 'react';
import Chart from 'chart.js';
import moment from 'moment';

class ExpensesChart extends Component {
  constructor(props) {
    super(props);

    this.canvas = React.createRef();
  }

  componentDidMount() {
    const amounts = this.props.expenses.map(({ amount }) => amount / 100);
    const dates = this.props.expenses.map(expense =>
      moment(expense.createdAt).format('DD.MM.YYYY')
    );

    const expensesChart = new Chart(this.canvas.current, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Amount ($)',
            data: amounts,
            backgroundColor: ['rgba(255, 99, 132, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)'],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        },
        elements: {
          line: {
            tension: 0
          }
        }
      }
    });
  }

  render() {
    return <canvas ref={this.canvas} width="300" height="300" />;
  }
}

export default ExpensesChart;
