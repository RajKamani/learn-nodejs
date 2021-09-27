const express = require("express")
const app = express()
const mongosee = require('mongoose')
const port = 3000;
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const comRouter = require('./routes/comment');
const auth = require('./middleware/auth')

mongosee.connect("mongodb://localhost:27017/PostAPI", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(con => {
        console.log("DB Connected");
    }).catch(err => {
        console.log("DB not Connected");
    });

//Middleware
app.use(express.json());
app.use('/public', express.static('public'))
app.use(express.urlencoded({ extended: false }));

//Routes
//localhost:3000/api/user
app.use('/api/user', userRouter);
app.use('/api/post', auth, postRouter);
app.use('/api/post', auth, comRouter);

app.get('/', (req, res) => {
    res.send("Runnig");
});


app.use(function (req, res, next) {
    res.status(404).send({ err: "404, Path not found." })
})

app.listen(port, (err) => {
    if (err) console.log("Server Error!");
    console.log(`Server running on http://localhost:${port}`);
});