import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import Router from 'next/router';
import Form from './styles/Form';
import Button from './styles/Button';
import Error from './Error';

const CREATE_EVENT_MUTATION = gql`
  mutation CREATE_EVENT_MUTATION(
    $address1: String!
    $address2: String
    $address3: String
    $city: String!
    $country: String!
    $description: String
    $entranceTax: Int
    $eventDate: DateTime!
    $imageLarge: String
    $imageSmall: String
    $state: String!
    $title: String!
    $zip: String!
  ) {
    createEvent(
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
    entranceTax: 0,
    eventDate: moment()
      .add(1, 'days')
      .toISOString(),
    imageLarge: '',
    imageSmall: '',
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
      imageSmall: file.secure_url,
      imageLarge: file.eager[0].secure_url
    });
  };

  render() {
    return (
      <Mutation
        mutation={CREATE_EVENT_MUTATION}
        variables={{
          ...this.state
        }}
      >
        {(createEvent, { loading, error }) => (
          <Form
            onSubmit={async e => {
              e.preventDefault();
              const res = await createEvent();
              Router.push({
                pathname: '/event',
                query: { id: res.data.createEvent.id }
              });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Create Your Easily Managable Event!</h2>
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
              <label htmlFor="entranceTax">
                Entrance
                <input
                  type="number"
                  id="entranceTax"
                  name="entranceTax"
                  placeholder="2500"
                  value={this.state.entranceTax}
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
              <Button type="submit">Submit</Button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateEvent;
