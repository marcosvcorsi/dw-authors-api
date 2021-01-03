const path = require('path');
const grpc = require('grpc');

const AuthorsDefinition = grpc.load(path.resolve(__dirname, '..', 'proto/authors.proto'));

const authorClient = new AuthorsDefinition.AuthorService('localhost:50051', grpc.credentials.createInsecure());

function promisify(method) {
  return (params) => {
    return new Promise((resolve, reject) => {
      authorClient[method](params, (err, response) => {
        if(err) {
          return reject(err);
        }

        return resolve(response);
      })
    })
  }
}

(async () => {
  const data = await promisify('create')({name: 'Marcos', website: 'https://google.com.br'});

  console.log(data);
})();