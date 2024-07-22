import { createHttpLink } from '@apollo/client/link/http/index.js'
import { InMemoryCache } from '@apollo/client/cache/index.js'

import { split } from '@apollo/client/link/core'
import { Kind, OperationTypeNode } from 'graphql';
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { setContext } from '@apollo/client/link/context';
import { concat } from '@apollo/client/core';

export /* async */ function getClientOptions(
  // eslint-disable-next-line no-unused-vars
  /* {app, router, ...} */ options
) {
  const httpLink = createHttpLink({
    uri:
      import.meta.env.VITE_GRAPHQL_URI ||
      // Change to your graphql endpoint.
      '/graphql',
  })

  const subscriptionLink = new GraphQLWsLink(
    createClient({
      url:
        import.meta.env.VITE_GRAPHQL_URI_WS ||
        // Change to your graphql endpoint.
        `ws://${location.host}/graphql`,
      // If you have authentication, you can utilize connectionParams:
      /*
      connectionParams: () => {
        const session = getSession(); // Change to your way of getting the session.
        if (!session) {
          return {};
        }

        return {
          Authorization: `Bearer ${session.token}`,
        };
      },
      */
    })
  )
  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    const context = { headers: { ...headers } };

    if (token) context.headers.authorization =  `Bearer ${token}`;

    return context;
  });
  // const link = split(
  //   // split based on operation type
  //   ({ query }) => {
  //     const definition = getMainDefinition(query)
  //     return (
  //       definition.kind === Kind.OPERATION_DEFINITION &&
  //       definition.operation === OperationTypeNode.SUBSCRIPTION
  //     )
  //   },
  //   subscriptionLink,
  //   httpLink
  // )
  const link = concat(
    authLink,
    split(
      // split based on operation type
      ({ query }) => {
        const definition = getMainDefinition(query)
        return (
          definition.kind === Kind.OPERATION_DEFINITION &&
          definition.operation === OperationTypeNode.SUBSCRIPTION
        )
      },
      subscriptionLink,
      httpLink
    )
);

  return Object.assign(
    // General options.
    {
      link,

      cache: new InMemoryCache(),
    },

    // Specific Quasar mode options.
    process.env.MODE === 'spa'
      ? {
          //
        }
      : {},
    process.env.MODE === 'ssr'
      ? {
          //
        }
      : {},
    process.env.MODE === 'pwa'
      ? {
          //
        }
      : {},
    process.env.MODE === 'bex'
      ? {
          //
        }
      : {},
    process.env.MODE === 'cordova'
      ? {
          //
        }
      : {},
    process.env.MODE === 'capacitor'
      ? {
          //
        }
      : {},
    process.env.MODE === 'electron'
      ? {
          //
        }
      : {},

    // dev/prod options.
    process.env.DEV
      ? {
          //
        }
      : {},
    process.env.PROD
      ? {
          //
        }
      : {},

    // For ssr mode, when on server.
    process.env.MODE === 'ssr' && process.env.SERVER
      ? {
          ssrMode: true,
        }
      : {},
    // For ssr mode, when on client.
    process.env.MODE === 'ssr' && process.env.CLIENT
      ? {
          ssrForceFetchDelay: 100,
        }
      : {}
  )
}
