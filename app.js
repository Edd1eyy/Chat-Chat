import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';
import mongoose from 'mongoose';

const app = express();
const server = createServer(app);
const io = new Server(server);
const dbUrl =
  'mongodb+srv://Eddie:HGG2z3Q2ZSbLtfV@cluster0.lut7r.mongodb.net/Chat-Chat?retryWrites=true&w=majority';

// mongodb:
// #1-connecting
mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => console.log('connected to database'))
  .catch((err) => console.error(err));
// #2-message form in the db
const msgModel = mongoose.model('Message', {
  userName: String,
  message: String,
});

//setting view engine
app.set('view engine', 'ejs');
// middelware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.get('/', (_req, res) => {
  res.render('index');
});
// controller
app.get('/messages', (_req, res) => {
  msgModel
    .find()
    .then((msg) => res.send(msg))
    .catch((err) => console.log(err));
});

app.post('/messages', (req, res) => {
  const newMessage = new msgModel(req.body);
  newMessage.save((err) => {
    if (err) sendStatus(500);
    io.emit('message', req.body);
    res.sendStatus(200);
  });
});

server.listen(3001, () => {
  console.log(`server live on port:${server.address().port}`);
});
