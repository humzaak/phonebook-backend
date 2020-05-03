const express = require('express')
var morgan = require('morgan')
const cors = require('cors')


const app = express()
app.use(cors());
app.options('*', cors());  
app.use(express.json())
app.use(express.static('build'))


morgan.token('value', function (req, res) { return JSON.stringify(req.body) })


app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.value(req,res),
    
  ].join(' ')
}))


let persons = [
  {
    name: "Arto Hellaas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Humza 2",
    number: "1234",
    id: 5
  }
]

app.get('/',(req,res)=>{

    res.send('<h1>Phonebook backend !!!</h1>')
})

app.get('/info',(req,res)=>{
  const maxId = getMaxId()
  const date = new Date()
  res.send(
    `<div> 
    <p>Phonebook has info for ${maxId} people</p>
    <p> ${date}</p>
    </div>`
  )
  res.send(String(new Date()))
})


app.get('/api/persons',(req,res)=>{
    res.json(persons)
})




app.get('/api/persons/:id',(req,res)=>{
    const id = Number(req.params.id)
    console.log(id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
})

const getMaxId = () => {
  const maxId = persons.length
  return maxId

}
const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body)
    if (!body.name) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

app.delete('/api/persons/:id',(req,res)=>{
        const id = Number(req.params.id)
        persons = persons.filter(person=>person.id !== id)
        res.status(204).end()
})

const port = process.env.PORT || 3001

app.listen(port, ()=> {
    console.log(`Server running on port ${port}`)
})

