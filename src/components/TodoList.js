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