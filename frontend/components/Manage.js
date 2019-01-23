import React, { Component } from 'react';

class Manage extends Component {
  render() {
    return (
      <div>
        <p>Hi from Manage Page of Event with id {this.props.id}</p>
      </div>
    );
  }
}

export default Manage;
