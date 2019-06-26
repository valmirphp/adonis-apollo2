# Adonis JS + GraphQl Apollo v2

Adpater GraphQl server Apollo v2 for Adonis Framework.

> **NOTE:** This package requires [@adonisjs/bodyparser](https://github.com/adonisjs/adonis-bodyparser)

## Apollo Server V2

This is the Adonis integration of GraphQL Server. Apollo Server is a community-maintained open-source GraphQL server that works with many Node.js HTTP server frameworks. [Read the docs](https://www.apollographql.com/docs/apollo-server/). [Read the CHANGELOG.](https://github.com/apollographql/apollo-server/blob/master/CHANGELOG.md)


## Installation

### Setup

```bash
npm install adonis-apollo2
```

### Bind GraphQL Endpoint

You can bind the GraphQL endpoint directly from your `routes.js` file.

In this example, we are using the `/` route to handle all graphql query.

```js
// start/routes.js
const Route = use('Route')

const { ApolloServer, gql } = require("adonis-apollo2");

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
const books = [
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling"
  },
  {
    title: "Jurassic Park",
    author: "Michael Crichton"
  }
];

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    books: [Book]
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    books: () => books
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.registerRoutes({ router: Route });
```

# Development
If you want to develop Apollo Server locally you must follow the following instructions:

- Fork this repository

- Install the package Server project in your computer

```bash
git clone https://github.com/[your-user]/adonis-apollo2
cd adonis-apollo2
npm install
npm run dev
cd project-adonis/
npm install ../adonis-apollo2
```

# To Do
- [ ] configure middleware auth

# Basead
- https://github.com/apollographql/apollo-server/pull/1937
- https://github.com/enniel/apollo-server/tree/apollo-server-adonis-v2.x
