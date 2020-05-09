const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}
else{


  const password = process.argv[2]

  const url =
    `mongodb+srv://humza:${password}@cluster0-jncdi.mongodb.net/phonebook-app?retryWrites=true&w=majority`
  
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  
  const phoneBookSchema = new mongoose.Schema({
    name: String,
    number: String,
  })
  
  const PhoneBookEntry = mongoose.model('PhoneBookEntry', phoneBookSchema)

  if ( process.argv.length<4 ) {
    
    console.log('phonebook: ')
    PhoneBookEntry.find({}).then(result => {
      result.forEach(phonebookEntry => {
        console.log(phonebookEntry)
      })
      mongoose.connection.close()
    })
  }
  else if ( process.argv.length == 5 ){

    const phonebookEntry = new PhoneBookEntry({
      name: process.argv[3],
      number: process.argv[4],
    })

    phonebookEntry.save().then(response => {
      console.log('entry saved!')
      mongoose.connection.close()
    })


  }

} 
  




