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
