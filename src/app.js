const express = require('express')
const cors = require('cors')
const { v4: uuid } = require('uuid')

const app = express()

app.use(express.json())
app.use(cors())

const repositories = []

app.get('/repositories', (request, response) => {
  return response.json(repositories)
})

app.post('/repositories', (request, response) => {
  const { url, title, techs } = request.body

  const repository = { id: uuid(), url, title, techs, likes: 0 }
  repositories.push(repository)

  return response.json(repository)
})

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params
  const { url, title, techs } = request.body

  const index = repositories.findIndex((r) => r.id === id)
  if (index === -1) {
    return response.status(400).json({
      error: 'Repository not found',
    })
  }

  repositories[index] = {
    ...repositories[index],
    url,
    title,
    techs,
  }

  return response.json(repositories[index])
})

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params

  const index = repositories.findIndex((r) => r.id === id)
  if (index === -1) {
    return response.status(400).json({
      error: 'Repository not found',
    })
  }

  repositories.splice(index, 1)

  return response.status(204).send()
})

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params

  const index = repositories.findIndex((r) => r.id === id)
  if (index === -1) {
    return response.status(400).json({
      error: 'Repository not found',
    })
  }

  repositories[index].likes += 1

  return response.json({
    likes: repositories[index].likes,
  })
})

module.exports = app
