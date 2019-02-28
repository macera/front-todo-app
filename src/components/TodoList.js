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
