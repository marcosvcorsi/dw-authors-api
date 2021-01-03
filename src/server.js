const path = require('path');
const grpc = require('grpc');

const AuthorsDefinition = grpc.load(path.resolve(__dirname, '..', 'proto/authors.proto'));

const authorHandler = require('./handlers/AuthorHandler.js');

const server = new grpc.Server();

server.addService(AuthorsDefinition.AuthorService.service, authorHandler);

server.bind('0.0.0.0/50051', grpc.ServerCredentials.createInsecure());

console.log('Listening');

server.start();