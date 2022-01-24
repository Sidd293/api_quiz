const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const { request } = require('express');
const app = express();
var cors = require('cors');
const { send } = require('express/lib/response');
app.use(cors());


    function shuffle(array) {
        let currentIndex = array.length,  randomIndex;
      
        while (currentIndex != 0) {
      
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
      }

const Schema = mongoose.Schema 
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json())
mongoose.connect("mongodb+srv://sidhu:7398438689@mernapp.oucv3.mongodb.net/quizDatabase?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
quesSchema = new Schema({
question : String,
options : [{
    option:String,
    optionId: String,
}],
answerId : String



});

const Question = mongoose.model("Question",quesSchema);


app.post("/",async (req,res)=>{
   const r = req.query
   const  question  = r.question;
   const answer = r.answer;
   const incorrect_answers = [{option : r.ans1,optionId:false},{option : r.ans2,optionId:false},{option : r.ans3,optionId:false}];
   options = shuffle([...incorrect_answers,{option:answer,optionId:true}])
options.forEach((m,i)=>{m.optionId = i;if(m.option== answer)ansId = i;} );

const f = Question.findOne({question : question},(err,found)=>{
if(err) res.send(err) ; else if(found) res.send("question already present"+question); else {
    const ques = new Question({
        question : question,
    options : options,
     answerId:ansId,
    })
    console.log(options)
    ques.save(); res.send("data sent");
}
})

})
app.get("/show",async (req,res)=>{
    var snd =[];
    const all = await Question.find();
    console.log(all);
    all.map(m=>{
obj = {
    ques : m.question,
    options : m.options.map(o=>o.option),
}

// console.log(shuffle([...m.incorrect_answers,m.answer]));
//  console.log([...m.incorrect_answers,m.answer]);
snd.push(obj);


    });
    res.send(snd)
    // res.send("api working");
    // res.send(all)

}
)

app.get("/calc",async (req,res)=>{
    var ct = 0;
    const response  = req.query.response;
    const all = await Question.find();
all.map((r,i)=>{
    if(all.answerId == response.charAt(i)) ct++;
    
})
    res.send({
    totalQuestions : response.length,
    correct : ct,
    wrong: response.length-ct,
    })
})
app.get("/",(req,res)=>{
    res.send(`<h3>api is running <br/> <a href="${__dirname.substring(0,__dirname.length-4)}/show">click here</a>to show all questions</h3><br/>
    <pre>
    mini documentation
    api endpoint - https://serene-chamber-52731.herokuapp.com/
    GET - /show (https://serene-chamber-52731.herokuapp.com/show)
          fetches all the questions 
    
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    POST- 5 QUERIES - question answer wrong_answer1 wrong_answer2 wrong_answer3
          query layout-    /?question=<question>?answer=<correct answer>&ans1=<wrong_option1>&ans2=<wrong_option2>&ans3=<wrong_option3>
          example call -  https://serene-chamber-52731.herokuapp.com/?question =J.K. Rowling completed %26quot;Harry Potter and the Deathly Hallows%26quot; in which hotel in Edinburgh, Scotland?&answer=The Balmoral&ans1=The Dunstane Hotel&ans2=Hotel Novotel&ans3=Sheraton Grand Hotel
          
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    
    
          
     
          
    
    
    
    </pre>
    
    `);
})
app.listen(process.env.PORT || 8080,()=>{
    console.log("server running");
})