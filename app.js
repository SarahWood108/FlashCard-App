const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const app = express();
app.use(express.static(`public`));
app.set('view engine', 'pug');
let db
let triviaCards = []
app.use(bodyParser.urlencoded({
    extended: true
}))
MongoClient.connect('mongodb://flashcard:FCProject1@ds251622.mlab.com:51622/flashcard', { useNewUrlParser: true }, (err, database) => {
    if (err) return console.log(err)
    db = database.db('flashapp')
    console.log("listening on port 8080")
})
app.get('/', function (req, res) {
    db.collection("flashcards").find().toArray(function (err, results) {
        if (err) return console.log(err)
        triviaCards = results
        console.log(results)
        res.render('index.pug', {flashcards: results
        })
    })
    app.get('/flashcards',(req, res) => {
        res.send(triviaCards)
    })
})
app.post('/flashcards', (req, res) => {
    db.collection('flashcards').save(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('save to database :)')
        res.redirect('/')
    })
    app.post("/update", (req,res)=> {
        let id = req.body._id
        let items ={
            question: req.body.question,
            hint: req.body.hint,
            answer: req.body.answer
        }
        db.collection("flashdata").updateOne({"id":id }, {$set:items}, function ( result) {
            console.log(result)
     
        })
        console.log(items)
        res.redirect('/')
     
     })
     
     app.post("/delete", (req,res)=> {
        id = req.body._id
     
            db.collection('flashdata').deleteOne({"id":objectID(id)}, function ( result) {
                console.log()
     
            })
            res.redirect('/')
     
        })
})
app.listen(8080, function () {
})

