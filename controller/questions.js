const questionModel=require('../models/questions')

class Question{
    addQuestion(req, res){
        var data={
            email:req.body.email,
            name:req.body.name,
            question:req.body.question,
            date:Date.now()
        }
        try{
            questionModel.create(data, (err, question)=>{
                if(err)res.status(501).json({code:"01", message:"error creating question"})
                res.status(200).json({code:"00", message:"question sent successfully"})
            })
        }catch(e){
            res.status(500)
        }
    }

    getQuestions(req, res){
        try{
            questionModel.find({}, (err, questions)=>{
                if(err)res.status(501).json({code:"01", message:"error retriving questions"})
                res.status(200).json({code:"00", message:questions})
            })
        }catch(e){
            res.status(500)
        }
    }
}

module.exports=new Question()