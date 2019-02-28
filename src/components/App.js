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
