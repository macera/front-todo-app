import React from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';

import TodoList from './TodoList';

const GET_TODO_LIST = gql`
  query {
    todos(first:  10) {
      edges {
        node {
          id
          content
        }
      }
    }
  }
`
const App = () => (
  <Query query={GET_TODO_LIST}>
    {({ loading, error, data }) => {
      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error :(</div>;

      const todos = data.todos ? data.todos.edges : []

      return (
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Todo List</h1>
          </header>
          <TodoList todos={todos} />
        </div>
      )
    }}
  </Query>
)

export default App;