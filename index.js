const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Person = require('./models/phonebook');
const { Mongoose } = require('mongoose');


app.use(express.static('build'));
app.use(cors());
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
morgan.token('body', (req, res) => JSON.stringify(req.body));

app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then(person => {
            res.json(person);
        })
        .catch(err => next(err));
});

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findById(id)
        .then(result => {
            if (result) {
                res.json(result)
            } else {
                res.status(404).end()
            }
        })
        .catch(err => next(err))
}
);

app.get('/api/info', (req, res) => {
    Person.find({}).then(person => {
        const count = person.length;
        res.end(`
        <div>Phonebook has info for ${count} people</div>
        <div>${new Date}</div>
    `);
    })

});

app.post('/api/persons', (req, res, next) => {
    const body = req.body;
    const person = new Person({
        name: body.name,
        number: body.number
    });

    person.save()
        .then(addedPerson => {
            res.json(addedPerson)
        })
        .catch(err => next(err));
});


app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    const newPerson = {
        name: req.body.name,
        number: req.body.number
    }
    Person.findByIdAndUpdate(id, newPerson, { new: true })
        .then(result => res.json(result))
        .catch(err => next(err))
});


app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findByIdAndDelete(id)
        .then(result => {
            res.status(204).end()
        })
        .catch(err => next(err))
}
);

const unknowEndpoint = (req, res) => {
    res.status(404).send({ error: 'Unknown endpoint, try another one' })
};

app.use(unknowEndpoint)

const errorHandler = (err, req, res, next) => {
    if (err.name === "ValidationError") {
        res.status(400).send({ error: err.message });
    };

    if (err.name === "MongoError") {
        res.status(400).send({ error: "Duplicate, try another name" })
    };
    res.status(404).send({ error: "Not Found" })
    next(err)
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
