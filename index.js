const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { response } = require('express');
const app = express();



app.use(express.static('build'));
app.use(cors());
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
morgan.token('body',(req,res) => JSON.stringify(req.body));
let phonebook = [
    {
        name: "Arto Hellas",
        number: "044-123456",
        id: 0
    },
    {
        name: "Ngo Kim Son",
        number: "024-333333",
        id: 1
    },
    {
        name: "Le Hoang Vu",
        number: "011-654321",
        id: 2
    },
];

app.get('/api/persons',(req,res) => {
    res.json(phonebook);
});

app.get('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id);
    const person = phonebook.find(person => person.id === id);
    if(person){
        res.json(person);
    } else {
        res.status(404).end()
    }
});

app.get('/api/info',(req,res) => {
    res.end(`
        <div>Phonebook has info for ${phonebook.length} people</div>
        <div>${new Date}</div>
    `)
});

app.post('/api/persons', (req,res) => {
    const id = Math.floor(Math.random()*1000);
    const person = req.body;
    console.log(person.name)
    if(!person.name || !person.number) {
        return res.status(400).json({
            error: 'missing name or number'
            }
        )
    }

    if(phonebook.find(phonebookLine => phonebookLine.name = person.name)){
        return res.status(400).json({error: `${person.name} is already added to the phonebook`})
    };

    phonebook = phonebook.concat({...person,id: id});
    res.json(person);
})

app.delete('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id);
    phonebook = phonebook.filter(person => person.id !== id);
    console.log(phonebook);
    res.status(204).end();
})

const PORT = process.env.PORT || 3001;
app.listen(PORT,() =>{
    console.log(`Server running on port ${PORT}`)
});
