import React, { Component } from 'react';
import Chart from 'chart.js';
import moment from 'moment';

class ExpensesChart extends Component {
  constructor(props) {
    super(props);

    this.canvas = React.createRef();
  }

  componentWillReceiveProps({ expenses }) {
    this.prepareCanvas(expenses);
  }

  componentDidMount() {
    this.prepareCanvas(this.props.expenses);
  }

  prepareCanvas = initExpenses => {
    const expenses = initExpenses.map(({ amount, createdAt }) => {
      return {
        t: moment(createdAt).format('DD.MM.YYYY'),
        y: amount / 100
      };
    });

    const distinct = (value, index, self) => {
      return self.indexOf(value) === index;
    };

    const dates = initExpenses.map(expense =>
      moment(expense.createdAt).format('DD.MM.YYYY')
    );

    const distinctDates = dates.filter(distinct);

    const computedAmounts = distinctDates.map(date => {
      let i = expenses.length;
      let total = 0;
      while (i--) {
        if (expenses[i].t === date) {
          total += expenses[i].y;
          expenses.splice(i, 1);
        }
      }
      return total;
    });

    const expensesChart = new Chart(this.canvas.current, {
      type: 'line',
      data: {
        labels: distinctDates,
        datasets: [
          {
            label: 'Amount ($)',
            data: computedAmounts,
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
  };

  render() {
    return <canvas ref={this.canvas} width="300" height="300" />;
  }
}

export default ExpensesChart;
