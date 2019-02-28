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
