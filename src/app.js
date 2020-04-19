const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {  
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {

  const {title, url, techs} = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0};

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  
  //Buscando o id do repositório pelo parâmetro
  const { id } = request.params;

  //Buscando as demais informações
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({ error: 'Repository not found'});
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  
  //Buscando o id passado no parâmetro
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({ error: 'Repository not found'});
  }

  //Removendo o repositório selecionado
  repositories.splice(repositoryIndex, 1);

  //Retornando em branco
  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  
  //Buscando o id do repositório pelo parâmetro
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({ error: 'Repository not found'});
  }

  //Carregando a quantidade de likes do repositório
  let likes = repositories[repositoryIndex].likes

  //Adicionando 1 like
  likes += 1;

  const repository = {
    id: repositories[repositoryIndex].id,
    title: repositories[repositoryIndex].title,
    url: repositories[repositoryIndex].url,
    techs: repositories[repositoryIndex].techs,
    likes: likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

module.exports = app;
