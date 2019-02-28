import gql from "graphql-tag";

export default gql(`
mutation AddTodoMutation($content: String!) {
  AddTodoMutation(input: { content: $content }) {
    todo {
      id
      content
    }
    errors
  }
}`);
