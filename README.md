# Todoアプリのフロントエンド

以下はその作成手順を書いています。

## first commit

`$ node -v`

v11.10.0

`$ npm install -g create-react-app`

`$ create-react-app front-todo-app`

`$ cd front-todo-app`

`$ yarn start`

`$ yarn add apollo-boost react-apollo graphql-tag graphql`

## remove unnecessary files

`rm src/App.css`

`rm src/App.js`

`rm src/App.test.js`

`rm src/serviceWorker.js`

`rm src/logo.svg`

## confirm connection with backend

以下のコードは [apollo-boost](https://github.com/apollographql/apollo-client/tree/master/packages/apollo-boost) のQuick start より参照

src/index.js
```
import React from 'react';
import { render } from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({ uri: 'http://localhost:4000/graphql' });

const ApolloApp = AppComponent => (
  <ApolloProvider client={client}>
    <AppComponent />
  </ApolloProvider>
);

render(ApolloApp(App), document.getElementById('root'));
```

`$ mkdir src/components`
`$ touch src/components/App.js`

src/components/App.js
```
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
```

`$ yarn start`

以降別タブで作業

以下のコードは [Qiita記事(AWS AppSyncとReactでToDoアプリを作ってみよう(3) Reactアプリの作成)](https://qiita.com/daikiojm/items/da81259a3e365fee9333) より一部参照

## create TODO list

`$ touch src/components/TodoList.js`

src/components/TodoList.js
```
import React, { Component } from "react";
export default class TodoList extends Component {

  static defaultProps = {
    todos: []
  }

  renderTodo = (todo) => (
    <li key={todo.id}>
      {todo.content}
    </li>
  );

  render() {
    const { todos } = this.props;
    const Todos = todos ? todos.map(x => x.node) : []
    return (
      <div>
        <ul>
          {Todos.map(this.renderTodo)}
        </ul>
      </div>
    );
  }
}

```

src/components/App.js
```
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
```

## create TODO form

src/components/TodoList.js
```
import React, { Component } from "react";
export default class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todo: {
        content: ''
      },
    };
  }

  static defaultProps = {
      todos: [],
      onAdd: () => null
  }

  todoForm = () => (
    <div>
      <span><input type="text" placeholder="TODO" value={this.state.todo.content} onChange={this.handleChange.bind(this, 'content')} /></span>
      <button onClick={this.handleOnAdd}>追加</button>
    </div>
  );

  renderTodo = (todo) => (
    <li key={todo.id}>
      {todo.content}
    </li>
  );

  handleChange = (field, { target: { value }}) => {
    const { todo } = this.state;
    todo[field] = value;
    this.setState({ todo });
  };

  handleOnAdd = () => {
    if (!this.state.todo.content) {
      return;
    }
    const newTodo = {
      content: this.state.todo.content
    }
    this.props.onAdd(newTodo);

    const { todo } = this.state;
    todo.content = '';
    this.setState({ todo });
  };

  render() {
    const { todos } = this.props; //graphql compose
    const Todos = todos ? todos.map(x => x.node) : []
    return (
      <div>
        {this.todoForm()}
        <ul>
          {Todos.map(this.renderTodo)}
        </ul>
      </div>
    );
  }
}

```

## create directry for graphql query

`$ mkdir src/graphqls`
`$ touch src/graphqls/GetTodosQuery.js`

src/graphqls/GetTodosQuery.js
```
import gql from "graphql-tag";

export default gql(`
query {
  todos(first:  10) {
    edges {
      node {
        id
        content
      }
    }
  }
}`);
```

`$ touch src/graphqls/AddTodoMutation.js`

src/graphqls/AddTodoMutation.js
```
import gql from "graphql-tag";

export default gql(`
mutation addTodoMutation($content: String!) {
  addTodoMutation(input: { content: $content }) {
    todo {
      id
      content
    }
    errors
  }
}`);
```

## use graphql compose method

src/components/App.js
```
import React, { Component } from "react";
import { compose, graphql } from 'react-apollo';
import TodoList from './TodoList';

import GetTodosQuery from '../graphqls/GetTodosQuery';
import AddTodoMutation from '../graphqls/AddTodoMutation';

export default class App extends Component {

  render() {

    const TodoListWithData = compose(
      // 全件取得
      graphql(GetTodosQuery, {
        options: {
          fetchPolicy: 'cache-and-network'
        },
        props: (props) => (
          { todos: props.data.todos ? props.data.todos.edges : [] }
        )
      }),
      // 追加
      graphql(AddTodoMutation, {
        props: (props) => ({
          onAdd: (todo) => {

            props.mutate({
              variables: { content: todo.content },
              optimisticResponse: () => ({ addTodoMutation: { todo: {...todo, __typename: 'Todo' }, __typename: 'Mutation', errors: [] } })
            })
          }
        }),
        options: {
          // 追加の後に全件リストを更新する
          refetchQueries: [{ query: GetTodosQuery }]
        }
      })
    )(TodoList);


    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Todo List</h1>
        </header>
        <TodoListWithData />
      </div>
    )
  }
}

```
