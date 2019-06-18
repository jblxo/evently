import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import Button from './styles/Button';
import Error from './Error';
import moment from 'moment';
import { SingleDatePicker } from 'react-dates';

const SINGLE_EVENT_QUERY = gql`
  query event($id: Int!) {
    event(where: { id: $id }) {
      id
      address1
      address2
      address3
      city
      country
      description
      entranceTax
      eventDate
      imageLarge
      imageSmall
      state
      title
      zip
    }
  }
`;

const UPDATE_EVENT_MUTATION = gql`
  mutation UPDATE_EVENT_MUTATION(
    $id: Int!
    $address1: String
    $address2: String
    $address3: String
    $city: String
    $country: String
    $description: String
    $entranceTax: Int
    $eventDate: DateTime
    $imageLarge: String
    $imageSmall: String
    $state: String
    $title: String
    $zip: String
  ) {
    updateEvent(
      id: $id
      address1: $address1
      address2: $address2
      address3: $address3
      city: $city
      country: $country
      description: $description
      entranceTax: $entranceTax
      eventDate: $eventDate
      imageLarge: $imageLarge
      imageSmall: $imageSmall
      state: $state
      title: $title
      zip: $zip
    ) {
      id
      title
      eventAdmins {
        user {
          id
        }
        event {
          id
        }
        permission {
          name
        }
      }
    }
  }
`;

class UpdateEventForm extends Component {
  state = {
    address1: this.props.event ? this.props.event.address1 : '',
    address2: this.props.event ? this.props.event.address2 : '',
    address3: this.props.event ? this.props.event.address3 : '',
    city: this.props.event ? this.props.event.city : '',
    country: this.props.event ? this.props.event.country : '',
    description: this.props.event ? this.props.event.description : '',
    entranceTax: this.props.event ? this.props.event.entranceTax / 100 : '',
    eventDate: this.props.event ? moment(this.props.event.eventDate) : moment(),
    imageSmall: this.props.event ? this.props.event.imageSmall : '',
    state: this.props.event ? this.props.event.state : '',
    title: this.props.event ? this.props.event.title : '',
    zip: this.props.event ? this.props.event.zip : '',
    calendarFocused: false
  };

  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({
      [name]: val
    });
  };

  handleAmountChange = e => {
    const amount = e.target.value;

    if (!amount || amount.match(/^\d{1,}(\.\d{0,2})?$/)) {
      this.setState({ entranceTax: amount });
    }
  };

  uploadFile = async e => {
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'evently');

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/incogcode/image/upload',
      {
        method: 'POST',
        body: data
      }
    );

    const file = await res.json();
    this.setState({
      imageSmall: file.secure_url,
      imageLarge: file.eager[0].secure_url
    });
  };

  onDateChange = eventDate => {
    if (eventDate) {
      this.setState({ eventDate });
    }
  };

  onFocusChange = ({ focused }) => {
    this.setState({ calendarFocused: focused });
  };

  render() {
    return (
      <Mutation
        mutation={UPDATE_EVENT_MUTATION}
        variables={{
          id: this.props.id,
          ...this.state
        }}
      >
        {(updateEvent, { loading, error }) => (
          <Form
            onSubmit={async e => {
              e.preventDefault();
              const entranceTax = parseFloat(this.state.entranceTax, 10) * 100;
              const res = await updateEvent({
                variables: {
                  entranceTax,
                  eventDate: this.state.eventDate.toISOString()
                }
              });
              Router.push({
                pathname: '/event',
                query: { id: this.props.id }
              });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Update {this.state.title}!</h2>
              <Error error={error} />
              <label htmlFor="address1">
                Address 1
                <input
                  type="text"
                  id="address1"
                  name="address1"
                  placeholder="Address 1"
                  value={this.state.address1}
                  onChange={this.handleChange}
                  required
                />
              </label>
              <label htmlFor="address2">
                Address 2
                <input
                  type="text"
                  id="address2"
                  name="address2"
                  placeholder="Address 2"
                  value={this.state.address2}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="address3">
                Address 3
                <input
                  type="text"
                  id="address3"
                  name="address3"
                  placeholder="Address 3"
                  value={this.state.address3}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="city">
                City
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="City"
                  value={this.state.city}
                  onChange={this.handleChange}
                  required
                />
              </label>
              <label htmlFor="country">
                Country
                <input
                  type="text"
                  id="country"
                  name="country"
                  placeholder="Country"
                  value={this.state.country}
                  onChange={this.handleChange}
                  required
                />
              </label>
              <label htmlFor="description">
                Description
                <textarea
                  id="description"
                  name="description"
                  placeholder="description"
                  value={this.state.description}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="entranceTax">
                Entrance
                <input
                  type="text"
                  id="entranceTax"
                  name="entranceTax"
                  placeholder="24.99"
                  value={this.state.entranceTax}
                  onChange={this.handleAmountChange}
                />
              </label>
              <label htmlFor="file">
                Image
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an image"
                  onChange={this.uploadFile}
                />
                {this.state.imageSmall && (
                  <img
                    src={this.state.imageSmall}
                    alt="Upload an image"
                    height="200"
                  />
                )}
              </label>
              <label htmlFor="state">
                State
                <input
                  type="text"
                  id="state"
                  name="state"
                  placeholder="State"
                  value={this.state.state}
                  onChange={this.handleChange}
                  required
                />
              </label>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  value={this.state.title}
                  onChange={this.handleChange}
                  required
                />
              </label>
              <label htmlFor="date">When?</label>
              <SingleDatePicker
                id="date"
                date={this.state.eventDate}
                onDateChange={this.onDateChange}
                focused={this.state.calendarFocused}
                onFocusChange={this.onFocusChange}
                numberOfMonths={1}
                isOutsideRange={() => false}
              />

              <label htmlFor="zip">
                ZIP
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  placeholder="ZIP"
                  value={this.state.zip}
                  onChange={this.handleChange}
                  required
                />
              </label>
              <Button type="submit">Submit</Button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

const UpdateEvent = props => (
  <Query query={SINGLE_EVENT_QUERY} variables={{ id: props.id }}>
    {({ data, loading }) => {
      if (loading) return <p>Loading...</p>;
      if (!data.event) return <p>No Event Found for ID {data.event.id}</p>;
      const { event } = data;
      return <UpdateEventForm event={event} id={props.id} />;
    }}
  </Query>
);

export default UpdateEvent;
