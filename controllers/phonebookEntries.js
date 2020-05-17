
const phonebookRouter = require('express').Router()
const phonebookEntry = require('../models/phonebookEntry')



/*phonebookRouter.get('/',(req,res)=>{

    res.send('<h1>Phonebook backend !!!</h1>')


})

phonebookRouter.get('/info',(req,res)=>{
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
*/




phonebookRouter.get('/',(req,res)=>{
  phonebookEntry.find({}).then(entries => {
    res.json(entries.map(entry => entry.toJSON()))
  })
})




phonebookRouter.get('/:id',(req,res,next)=>{

  phonebookEntry.findById(req.params.id).then(entry=>{
    if(entry)
    {
      res.json(entry.toJSON())
    }
    else{
      res.status(404).end()
    }
  })
    .catch(error => next(error))
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
  
  phonebookRouter.post('/', (request, response, next) => {
    const body = request.body
    console.log(body)
    if (!body.name) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const person = new phonebookEntry({
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

phonebookRouter.delete('/:id',(req,res)=>{
 // PhoneBookEntry.findById(req.params.id).then(entry=>{res.json(entry.toJSON())})
 console.log(req.params.id)
  phonebookEntry.deleteOne({ _id: req.params.id }, function (err) {
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


})



module.exports = phonebookRouter


