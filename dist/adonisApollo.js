"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_core_1 = require("apollo-server-core");
function graphqlAdonis(options) {
    if (!options) {
        throw new Error('Apollo Server requires options.');
    }
    if (arguments.length > 1) {
        // TODO: test this
        throw new Error(`Apollo Server expects exactly one argument, got ${arguments.length}`);
    }
    const graphqlHandler = (ctx) => {
        const method = ctx.request.method();
        let query = method === 'POST' ? ctx.request._body : ctx.request._qs;
        if (query === null) {
            query = undefined;
        }
        return apollo_server_core_1.runHttpQuery([ctx], {
            method,
            query,
            options: options,
            request: apollo_server_core_1.convertNodeHttpToRequest(ctx.request.request),
        }).then(({ graphqlResponse, responseInit }) => {
            Object.keys(responseInit.headers).forEach(key => ctx.response.header(key, responseInit.headers[key]));
            ctx.response.send(graphqlResponse);
        }, (error) => {
            if ('HttpQueryError' !== error.name) {
                throw error;
            }
            if (error.headers) {
                Object.keys(error.headers).forEach(header => {
                    ctx.response.header(header, error.headers[header]);
                });
            }
            ctx.response.status(error.statusCode).send(error.message);
        });
    };
    return graphqlHandler;
}
exports.graphqlAdonis = graphqlAdonis;
