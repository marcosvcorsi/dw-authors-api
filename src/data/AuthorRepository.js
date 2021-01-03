const fs = require('fs');
const path = require('path');

const oid = require('bson-objectid');

class AuthorRepository {
  static dbLocation = path.resolve(__dirname,  './db');

  static collectionPath = path.resolve(AuthorRepository.dbLocation, 'authors.json');

  static #collection = [];

  constructor () {
    if(!fs.existsSync(AuthorRepository.dbLocation)) fs.mkdirSync(AuthorRepository.dbLocation, { recursive: true})

    if(!fs.existsSync(AuthorRepository.collectionPath)) fs.writeFileSync(AuthorRepository.collectionPath, '[]');

    AuthorRepository.#collection = require(AuthorRepository.collectionPath);
  }

  findById(id) {
    return AuthorRepository.#collection.find(author => author.id === id);
  }

  search(key, value) {
    return AuthorRepository.#collection.filter(author => author[key] === value);
  }

  findAll() {
    return AuthorRepository.#collection;
  }

  create(author) {
    const newAuthor = {
      ...author,
      id: new oid().toHexString()
    }

    AuthorRepository.#collection.push(newAuthor);

    return newAuthor;
  }

  delete(id) {
    AuthorRepository.#collection = AuthorRepository.#collection.find(author => !(new oid(author.id)).equals(id))

    return this;
  }

  update(id, updateData) {
    let updatedAuthor;

    AuthorRepository.#collection = AuthorRepository.#collection.map(author => {
      if((new oid(author.id)).equals(id)) {
        updatedAuthor = {
          ...author,
          ...updateData
        }

        return updatedAuthor;
      }

      return author;
    })

    return updatedAuthor;
  }

  #serialize (entity) {
    return JSON.stringify(entity);
  }

  save() {
    fs.writeFileSync(AuthorRepository.collectionPath, this.#serialize(AuthorRepository.#collection));

    return this;
  }
}

module.exports = AuthorRepository;