require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const PhoneBookEntry = require('./models/phonebookEntry')


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




//const PhoneBookEntry = mongoose.model('PhoneBookEntry', phoneBookSchema)




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
    PhoneBookEntry.find({}).then(phonebookEntries => {res.json(phonebookEntries.map(phoneBookEntry=>phoneBookEntry.toJSON()))
    }
    )
})




app.get('/api/persons/:id',(req,res,next)=>{

  PhoneBookEntry.findById(req.params.id).then(entry=>{
    if(entry)
    {
      res.json(entry.toJSON())
    }
    else{
        res.status(404).end()
    }
   })
  .catch(error => next(error))
    /*const id = Number(req.params.id)
    console.log(id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }*/
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
  
  app.post('/api/persons', (request, response, next) => {
    const body = request.body
    console.log(body)
    if (!body.name) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const person = new PhoneBookEntry({
      name: body.name,
      number: body.number,
    })
  
  //  persons = persons.concat(person)
  person.save()
  .then(savedPerson=>
     {
       response.json(savedPerson.toJSON())
      
      })
      .catch(error=>next(error))
  
  })

app.delete('/api/persons/:id',(req,res)=>{
 // PhoneBookEntry.findById(req.params.id).then(entry=>{res.json(entry.toJSON())})
 console.log(req.params.id)
  PhoneBookEntry.deleteOne({ _id: req.params.id }, function (err) {
    if (err) {
      console.log("Error")
      res.status(500).end()
    } 
    else{
      console.log("OK")
      res.status(204).end()
    }
    // deleted at most one tank document
  });

       // const id = Number(req.params.id)
        //persons = persons.filter(person=>person.id !== id)
        //res.status(204).end()

})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if(error.name='ValidationError'){
    return response.status(400).json({error: error.message})
  }

  next(error)
}

app.use(errorHandler)

const port = process.env.PORT 

app.listen(port, ()=> {
    console.log(`Server running on port ${port}`)
})

