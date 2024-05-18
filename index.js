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

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = phonebook.find((person) => person.id === id);
    response.json(person);
});

app.get("/api/persons/", (request, response) => {
    response.json(phonebook);
});

app.get("/info", (request, response) => {
    const totalPersons = phonebook.length;
    const currentTime = new Date();
    response.send(
        `<p>Phonebook has info for ${totalPersons} people<p><p>${currentTime}`
    );
});

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    phonebook = phonebook.filter((person) => person.id !== id);
    console.log(request);
    response.status(204).end();
});

app.post("/api/persons", (request, response) => {
    const newPerson = request.body;
    if (!newPerson.name || !newPerson.number) {
        response.status(500).send("Missing name or number");
        return;
    }
    if(phonebook.some(person => person.name === newPerson.name)){
        response.status(500).send(`${newPerson.name} already exists in phonebook`)
        return;
    }
    const id = Math.floor(Math.random() * 1000);
    phonebook = phonebook.concat({ ...newPerson, id: id });
    response.json(phonebook);
});

const uknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(uknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
});
