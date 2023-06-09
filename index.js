const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

morgan.token('body', (request, response) => {
    JSON.stringify(request.body)
})

app.use(
    morgan((tokens, req, res) => {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'),
            '-',
            tokens['response-time'](req, res),
            'ms',
            JSON.stringify(req.body),
        ].join(' ')
    })
)

let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456',
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523',
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345',
    },
    {
        id: 4,
        name: 'Mary Poppendieck',
        number: '39-23-6423122',
    },
]

app.get('/', (request, response) => {
    response.send('<h1>Phonebook App</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(
        `Phonebook has info for ${persons.length} people.<br /> ${new Date()}`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find((n) => n.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

const generateId = () => Math.floor(Math.random() * 1000000)

app.post('/api/persons', (request, response) => {
    const body = request.body
    const names = [...persons].map((person) => person.name)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Name or phone number is missing',
        })
    }

    if (names.includes(body.name)) {
        return response.status(400).json({
            error: 'Name must be unique',
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

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter((person) => person.id !== id)

    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log('Server is up and running')
})
