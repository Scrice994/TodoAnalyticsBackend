import express from 'express'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors())

app.post('/event-listener', (req, res) => {
    const event = req.body

    console.log(event)

    res.status(200).json(event)
})

app.listen(5005, () => {
    console.log('Listening on port: 5005')
})