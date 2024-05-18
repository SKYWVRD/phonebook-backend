require('dotenv').config()
const express = require("express");
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

app.use(express.json());
app.use(express.static('dist'))
app.use(cors());

morgan.token('body', function getBody(res){
    return JSON.stringify(res.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get("/", (request, response) => {
    response.send("<h1>Phone Numbers Are Great</h1>");
});

app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if(person){
            response.json(person)
        } else {
            response.status(404).end();
        }
    }).catch(error => next(error))
});

app.get("/api/persons/", (request, response) => {
    const people = []
    Person.find({}).then(persons=>{
        persons.forEach(person=>{
            console.log(person);
            people.push(person);
        })
        response.json(people)
    })

});

app.get("/info", (request, response) => {
    Person.find({}).then(persons=>{
        response.send(`Total entries in phonebook are ${persons.length}`)
    })
});

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    phonebook = phonebook.filter((person) => person.id !== id);
    console.log(request);
    response.status(204).end();
});

app.post("/api/persons", (request, response) => {
    const person = new Person ({
        name: request.body.name,
        number: request.body.number
    })

    person.save().then(savedNumber => {
        console.log('Person Saved');
        response.json(savedNumber)
    })
})

const uknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(uknownEndpoint);

const errorHandler=(error, request, response, next) => {
    console.error(error.message)

    if(error.name === 'CastError'){
        return response.status(400).send({error: 'malformmed id'})
    }

    next(error)
}

app.use(errorHandler);



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
});
