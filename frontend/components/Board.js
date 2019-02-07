import React, { Component } from 'react';

class Board extends Component {
  render() {
    return (
      <div>
        <p>
          This is board with ID {this.props.board} from Event with ID{' '}
          {this.props.event}
        </p>
      </div>
    );
  }
}

export default Board;
