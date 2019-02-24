import React from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';

const GET_TODO = gql`
  query {
    todo(id: 1) {
      id
      content
    }
  }
`
const App = () => (
  <Query query={GET_TODO}>
    {({ loading, error, data }) => {
      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error :(</div>;

      return (
        <div>{data.todo.content}</div>
      )
    }}
  </Query>
)

export default App;