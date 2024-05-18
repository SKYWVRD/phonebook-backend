const mongoose = require('mongoose');

if(process.argv.length < 3){
    console.log('give password as argument');
    process.exit(1);
}

const password = process.argv[2];
const nameArg = process.argv[3];
const numberArg = process.argv[4];

const url = `mongodb+srv://boonzaiersa:${password}@phonebook-cluster.ontordn.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=phonebook-cluster`

mongoose.set('strictQuery', false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Persons', personSchema);

if(nameArg && numberArg){
    const number = new Person({
        name: nameArg,
        number: numberArg
    })
    
    number.save().then(result=>{
        console.log(`Added ${nameArg} number ${numberArg} to the phonebook`);
        mongoose.connection.close();
    })
} else {
    Person.find({}).then(persons => {
        persons.forEach(person=>{
            console.log(person);
        })
        mongoose.connection.close();
    })
}