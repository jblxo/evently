import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import Button from './styles/Button';
import Error from './Error';

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

class UpdateEvent extends Component {
  state = {};

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
      <Query query={SINGLE_EVENT_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading }) => {
          if (loading) return <p>Loading...</p>;
          if (!data.event) return <p>No Event Found for ID {data.event.id}</p>;

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
                    const res = await updateEvent();
                    Router.push({
                      pathname: '/event',
                      query: { id: this.props.id }
                    });
                  }}
                >
                  <fieldset disabled={loading} aria-busy={loading}>
                    <h2>Update {data.event.title}!</h2>
                    <Error error={error} />
                    <label htmlFor="address1">
                      Address 1
                      <input
                        type="text"
                        id="address1"
                        name="address1"
                        placeholder="Address 1"
                        defaultValue={data.event.address1}
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
                        defaultValue={data.event.address2}
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
                        defaultValue={data.event.address3}
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
                        defaultValue={data.event.city}
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
                        defaultValue={data.event.country}
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
                        defaultValue={data.event.description}
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
                        defaultValue={data.event.entranceTax}
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
                      {(this.state.imageSmall || data.event.imageSmall) && (
                        <img
                          src={this.state.imageSmall || data.event.imageSmall}
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
                        defaultValue={data.event.state}
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
                        defaultValue={data.event.title}
                        onChange={this.handleChange}
                        required
                      />
                    </label>
                    <label htmlFor="zip">
                      ZIP
                      <input
                        type="text"
                        id="zip"
                        name="zip"
                        placeholder="ZIP"
                        defaultValue={data.event.zip}
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
        }}
      </Query>
    );
  }
}

export default UpdateEvent;
