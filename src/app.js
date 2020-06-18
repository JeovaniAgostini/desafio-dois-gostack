const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepoId(request, response, next){
    const {id} = request.params;
    if (!isUuid(id)){
        return response.status(400).json({error: 'Invalid Repo ID'});
    }
    return next();
}

app.use('/repositories/:id', validateRepoId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
    const {title,url,techs} = request.body;
    const repository = {
        id: uuid(),
        url,
        title,
        techs,
        likes: 0,
    }
    repositories.push(repository);
    return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
    const {id} = request.params    
    const {url,title,techs} = request.body;
    const repoIndex = repositories.findIndex(repo => repo.id == id);
    const repoLikes = repositories[repoIndex].likes;
    // console.log(repoLikes);
    if (repoIndex < 0) {
        return response.status(400).json({error:'Repo not found'});
    }
    const Repo = {
        id,
        url,
        title,
        techs,
        likes: repoLikes,
    };
    repositories[repoIndex] = Repo;
    return response.json(Repo);
});

app.delete("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const repoIndex = repositories.findIndex(repo => repo.id == id)    
    if (repoIndex < 0) {
        return response.status(400).json({error:'Repo not found'})
    }
    repositories.splice(repoIndex, 1);
    return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repository = repositories.find(repository => repository.id == id);
  if (!repository){
      return response.status(400).send();
  }
  repository.likes += 1;
  return response.json(repository);
});

module.exports = app;
