"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Manager_1 = __importDefault(require("@adonisjs/framework/src/Route/Manager"));
const graphql_playground_html_1 = require("@apollographql/graphql-playground-html");
const apollo_server_core_1 = require("apollo-server-core");
const adonisApollo_1 = require("./adonisApollo");
const apollo_upload_server_1 = require("apollo-upload-server");
var apollo_server_core_2 = require("apollo-server-core");
exports.GraphQLExtension = apollo_server_core_2.GraphQLExtension;
class ApolloServer extends apollo_server_core_1.ApolloServerBase {
    // This translates the arguments from the middleware into graphQL options It
    // provides typings for the integration specific behavior, ideally this would
    // be propagated with a generic to the super class
    createGraphQLServerOptions(ctx) {
        const _super = Object.create(null, {
            graphQLServerOptions: { get: () => super.graphQLServerOptions }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.graphQLServerOptions.call(this, { ctx });
        });
    }
    supportsSubscriptions() {
        return true;
    }
    supportsUploads() {
        return true;
    }
    registerRoutes({ router, path, disableHealthCheck, onHealthCheck, } = {}) {
        if (!path)
            path = '/graphql';
        if (!router)
            router = Manager_1.default;
        const promiseWillStart = this.willStart();
        if (!disableHealthCheck) {
            router.route('/.well-known/apollo/server-health', (ctx) => __awaiter(this, void 0, void 0, function* () {
                yield promiseWillStart;
                // Response follows https://tools.ietf.org/html/draft-inadarei-api-health-check-01
                ctx.response.type('application/health+json');
                if (onHealthCheck) {
                    return onHealthCheck(ctx)
                        .then(() => {
                        ctx.response.send({ status: 'pass' });
                    })
                        .catch(() => {
                        ctx.response.status(503).send({ status: 'fail' });
                    });
                }
                else {
                    ctx.response.send({ status: 'pass' });
                }
            }), ['GET', 'POST']);
        }
        this.graphqlPath = path;
        router.any(path, (ctx) => __awaiter(this, void 0, void 0, function* () {
            yield promiseWillStart;
            if (this.uploadsConfig && ctx.request.is(['multipart/form-data'])) {
                try {
                    ctx.request._body = yield apollo_upload_server_1.processRequest(ctx.request.request, this.uploadsConfig);
                }
                catch (error) {
                    if (error.status && error.expose) {
                        ctx.response.status(error.status);
                    }
                    throw apollo_server_core_1.formatApolloErrors([error], {
                        formatter: this.requestOptions.formatError,
                        debug: this.requestOptions.debug,
                    });
                }
            }
            if (this.playgroundOptions && ctx.request.method() === 'GET') {
                // perform more expensive content-type check only if necessary
                const prefersHTML = ctx.request
                    .types()
                    .find((x) => x === 'text/html' || x === 'application/json') === 'text/html';
                if (prefersHTML) {
                    const playgroundRenderPageOptions = Object.assign({ endpoint: path, subscriptionEndpoint: this.subscriptionsPath }, this.playgroundOptions);
                    const playground = graphql_playground_html_1.renderPlaygroundPage(playgroundRenderPageOptions);
                    ctx.response.type('text/html').send(playground);
                    return;
                }
            }
            return adonisApollo_1.graphqlAdonis(() => {
                return this.createGraphQLServerOptions(ctx);
            })(ctx);
        }), ['GET', 'POST']);
    }
}
exports.ApolloServer = ApolloServer;
