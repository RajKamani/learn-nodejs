const express = require("express")
const bodyparser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const app = express()

app.set("view engine", "ejs")
app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true })

const articleSchema = {
    title: String,
    content: String
}
const Article = mongoose.model("Article", articleSchema);

const newArticle = new Article({
    title: "Test",
    content: "Testing is done"
})
//newArticle.save()

app.route("/articles")
    .get(function (req, res) {

        Article.find({}, function (err, aritcles) {
            if (!err)
                res.send(aritcles)
            else
                res.send(err)
        })
    })
    .post(function (req, res) {
        const title = req.body.newTitle
        const content = req.body.newContent

        const newArticle = new Article({
            title: title,
            content: content
        })
        newArticle.save(function (err) {
            if (!err) {
                res.send({ msg: "Successully created" })
            }
            else {
                res.send(err)
            }
        })

    })
    .delete(function (req, res) {
        Article.deleteMany({}, function (err) {
            if (!err) {
                res.send({ msg: "Deleted all Records Successfully." })
            }
            else {
                res.send(err)
            }
        })
    });


app.route("/articles/:articleName")
    .get(function (req, res) {
        const articleTofind = req.params.articleName;
        Article.find({ title: articleTofind }, function (err, articles) {

            if (articles.length !== 0) {
                res.send(articles)
            }
            else {
                res.send({ msg: "articles not found on " + articleTofind })
            }


        })
    })
    .delete(function (req, res) {
        const articleTofind = req.params.articleName;
        Article.deleteOne({ title: articleTofind }, function (err) {

            if (!err) {
                res.send({msg:"Data Deleted for article "+articleTofind})
            }
            else {
                res.send(err)
            }
        })
    })
    .patch(function (req, res) {
        const articleTofind = req.params.articleName;
        Article.updateOne({ title: articleTofind }, { $set: req.body }, function (err) {
            if(!err){
                res.send({msg:"Data updated for article "+articleTofind});
            }else{
                res.send(err)
            }
        })
    });

app.listen(3000, function () {
    console.log("Server running at port 3000")
})