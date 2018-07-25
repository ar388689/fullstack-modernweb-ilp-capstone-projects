const express = require('express');
const router = express.Router();
const config = require('../config/database');
const User = require('../models/user');
const quiz = require('../models/quiz');
// const comments = require('../models/comment');


//All quizes route
router.get('/quiz', (req, res, next) => {
    quiz.find({}, { _id: 0}, function (err,quizes) {
        console.log("In all quiz route");
        if (err) {
            console.log(err);
        }
        // console.log(quizes);
        res.json(quizes);
    });
})

//Individual quiz
router.get('/quiz/:id', (req, res, next) => {
    quiz.find({ id: req.params.id }, { _id: 0 }, function (err, quizdetail) {
        console.log("In get ID method");
        if (err) {
           console.log(err);
        }
        console.log(quizdetail);
        res.json(quizdetail);
    });
})


//add a quiz 

router.post('/addquiz', function (req, res, next) {
    var newquestions = [{}];
    newquestions = req.body.questions.map((e) => {
        var newoptions = [];
        newoptions = e.options.map((op) => {
            let option = {
                id: op.id,
                questionId: op.questionId,
                name: op.name,
                isAnswer: op.isAnswer,
            }
            return option;
        });
        let qs = {
            id: e.id,
            name: e.name,
            questionTypeId: e.questionTypeId,
            options: newoptions,
            questiontype: e.questiontype
        }
        return qs;
    });
    quiz.count({}, function (err, n) {
        if (err)
            console.log("save error" + err);
        else {
            // console.log(n);
            var newquiz = new quiz({
                id: n + 1,
                name: req.body.name,
                author: req.body.author,
                questions: newquestions
        
            });
            newquiz.save( (err, quiz) =>  {
                if (err) {
                    res.send(err);
                }
                res.json(newquiz);
                console.log("After adding new: " + quiz);
            });

        }   
        
    });
});

//delete 

router.delete('/deletequiz/:id', function (req, res, next) {
    quiz.remove({ id: req.params.id }, function (err, task) {
        if (err) {
            res.send(err);
        }
        console.log(" data deleted");
        res.json(task);
    });

});

router.post('/addscore', (req, res) => {
    var userscore = {
        id: req.body.id,
        name: req.body.name,
        score: req.body.score,
        time: req.body.date
    }

    User.findOneAndUpdate({ username: req.body.username }, { $push: { attempted_quizes: userscore } }, function (err, doc) {
        if (err) {
            console.log("wrong when updating" + err);
        }
        console.log("data is saved");
    });
});


module.exports = router;