import amqp from "amqplib";
import cors from 'cors';
import express from 'express';
import { connectDatabase } from './utils/connectDatabase';
import { userEventHandler } from "./amqp/userEventHandler";
import { todoEventHandler } from "./amqp/todoEventHandler";
import ModelRouter from "./routes/routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(ModelRouter);

connectDatabase()
.then(() => {
    app.listen(5005, async () => {
        console.log('Listening on port: 5005...');
    })
})
.then(async () => {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertExchange("userEventExchange", "direct");
    await channel.assertExchange("todoEventExchange", "direct");

    const userQueue = await channel.assertQueue("userQueue");
    const todoQueue = await channel.assertQueue("todoQueue");

    await channel.bindQueue(userQueue.queue, "userEventExchange", "user");
    await channel.bindQueue(todoQueue.queue, "todoEventExchange", "todo");

    channel.consume(userQueue.queue, async (message) => {
        if(!message){
            return console.error("Invalid incoming message");
        }
        const data = JSON.parse(message.content.toString());
        console.log(data);

        try {
            await userEventHandler(data);
            channel.ack(message);
        } catch (error) {
            console.log(error);
        }
    });

    channel.consume(todoQueue.queue, async (message) => {
        if(!message){
            return console.error("Invalid incoming message");
        }
        const data = JSON.parse(message.content.toString());
        console.log(data);

        try {
            await todoEventHandler(data);
            channel.ack(message);
        } catch (error) {
            console.log(error);
        }
    });
}).then(() => console.log("Connected to eventBus"));
