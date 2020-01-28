const payment= require('../models/payment')
const auth= require('../helpers/auth')
const encrypt=require('../helpers/encrypt')


class Payment{
    addCard(req, res){
        var data={
        card_no:req.body.card_no,
        date_created:Date.now(),
        user:''
        }
        try{
            auth.verifyToken(req.token).then(user=>{
                data.user=user.id
                    data.card_no=encrypt.encrypt(data.card_no)
                    payment.create(data, (err, card)=>{
                        if(err)res.status(501).json({code:"01", message:"error creating new card"})
                        res.status(200).json({code:"00", message:"card created successfully"})
                    })
               
            })
        }catch(e){
            res.status(500)
        }
    }

    retriveCard(req, res){
        try{
            auth.verifyToken(req.token).then(user=>{
                payment.find({user:user.id}, (err, user_card)=>{
                    let card_nos = user_card.map(a => a.card_no);
                    var cards=[]
                    for (const a of card_nos) {
                        var decrypted_value= encrypt.decrypt(a)
                        cards.push(decrypted_value)
                    }
                    res.status(200).json({code:"00", message:cards})
                })
            })
        }catch(e){
            res.status(500)
        }
    }
}
module.exports=new Payment()