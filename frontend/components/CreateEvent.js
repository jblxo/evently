import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import Router from 'next/router';
import Form from './styles/Form';

const CREATE_EVENT_MUTATION = gql`
  mutation CREATE_EVENT_MUTATION(
    $address1: String!
    $address2: String
    $address3: String
    $city: String!
    $country: String!
    $description: String
    $entrance_tax: Int
    $event_date: DateTime!
    $image_large: String
    $image_small: String
    $state: String!
    $title: String!
    $zip: String!
    $now: DateTime!
  ) {
    createEvent(
      address1: $address1
      address2: $address2
      address3: $address3
      city: $city
      country: $country
      description: $description
      entrance_tax: $entrance_tax
      event_creation: $now
      event_date: $event_date
      image_large: $image_large
      image_small: $image_small
      state: $state
      title: $title
      zip: $zip
      boards: {
        create: {
          title: "Example"
          description: "Change me"
          lists: {
            create: {
              created_at: $now
              description: "Hi, this is a list!"
              order: 1
              title: "First list"
            }
          }
        }
      }
    ) {
      id
      title
      boards {
        id
        title
        description
      }
    }
  }
`;

class CreateEvent extends Component {
  state = {
    address1: '',
    address2: '',
    address3: '',
    city: '',
    country: '',
    description: '',
    entrance_tax: 0,
    event_date: moment()
      .add(5, 'days')
      .toISOString(),
    image_large: '',
    image_small: '',
    state: '',
    title: '',
    zip: ''
  };

  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({
      [name]: val
    });
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
      image_small: file.secure_url,
      image_large: file.eager[0].secure_url
    });
  };

  render() {
    return (
      <Mutation
        mutation={CREATE_EVENT_MUTATION}
        variables={{
          ...this.state,
          now: moment().toISOString()
        }}
      >
        {(createEvent, { loading, error }) => (
          <Form
            onSubmit={async e => {
              e.preventDefault();
              const res = await createEvent();
              console.log(res.data.createEvent.event_date);
              Router.push({
                pathname: '/event',
                query: { id: res.data.createEvent.id }
              });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="address1">
                Address 1
                <input
                  type="text"
                  id="address1"
                  name="address1"
                  placeholder="Address 1"
                  value={this.state.address1}
                  onChange={this.handleChange}
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
              <label htmlFor="entrance_tax">
                Entrance
                <input
                  type="number"
                  id="entrance_tax"
                  name="entrance_tax"
                  placeholder="2500"
                  value={this.state.entrance_tax}
                  onChange={this.handleChange}
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
                {this.state.image_small && (
                  <img
                    src={this.state.image_small}
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
                />
              </label>
              <label htmlFor="zip">
                ZIP
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  placeholder="ZIP"
                  value={this.state.zip}
                  onChange={this.handleChange}
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateEvent;
