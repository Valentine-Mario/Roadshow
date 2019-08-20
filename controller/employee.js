const employeeModel=require('../models/employees')
const auth=require('../helpers/auth')

class Employee{
    addEmployee(req, res){
        var data={
        business:'',
        role:req.body.role,
        name:req.body.name,
        email:req.body.email
        }
        try{
            auth.verifyBusinessToken(req.token).then(business=>{
                data.business=business._id
                employeeModel.find({$and:[{business:business._id}, {role:"Boss"}]}, (err, boss)=>{
                    
                    if(boss.length>0 && data.role=="Boss"){
                        res.status(201).json({code:"01", message:"can only have one boss"})
                    }else{
                        employeeModel.create(data, (err, employee)=>{
                            if(err)res.status(501).json({code:"01", err:err, message:"error adding employee"})
                            res.status(200).json({code:"00", message:`${employee.name} added as ${employee.role} successfully`})
                        })
                    }
                })
            })
        }catch(e){
            console.log(e)
        }
    }
    
    modifyEmployee(req, res){
        var data={
            name:req.body.name,
            email:req.body.email
            }
            var id={_id:req.params.id}
        try{
            auth.verifyBusinessToken(req.token).then(business=>{
                employeeModel.findById(id, (err, employee)=>{
                    if(JSON.stringify(employee.business)===JSON.stringify(business._id)){                            
                                employeeModel.findOneAndUpdate(id, data, (err)=>{
                                    if(err)res.status(501).json({code:"01", err:err, message:"error updating employee"})
                                    res.status(200).json({code:"00", message:"update successful"})
                                })
                    }else{
                        res.status(201).json({code:"01", message:"unauthorised to edit details"})
                    }
                })
            })
        }catch(e){
            console.log(e)
        }
    }

    editRole(req, res){
        var data={
            role:req.body.role
        }
        var id={_id:req.params.id}
        try{
            auth.verifyBusinessToken(req.token).then(business=>{
                employeeModel.findById(id, (err, employee)=>{
                    if(JSON.stringify(employee.business)===JSON.stringify(business._id)){  
                        employeeModel.find({$and:[{business:business._id}, {role:"Boss"}]}, (err, boss)=>{
                            if(boss.length>0 && data.role=="Boss"){
                                res.status(201).json({code:"01", message:"can only have one boss"})
                            }else{
                                employeeModel.findOneAndUpdate(id, data, (err)=>{
                                    if(err)res.status(501).json({code:"01", err:err, message:"error updating employee"})
                                    res.status(200).json({code:"00", message:"update successful"})
                                })
                            }
                        })   
                    }else{
                        res.status(201).json({code:"01", message:"unauthorised to edit details"})
                    }
                })
            })
        }catch(e){
            console.log(e)
        }
    }

    deleteUser(req, res){
        var id={_id:req.params.id}
        try{
            auth.verifyBusinessToken(req.token).then(business=>{
                employeeModel.findById(id, (err, employee)=>{
                    if(JSON.stringify(employee.business)===JSON.stringify(business._id)){
                        employeeModel.findOneAndDelete(id, (err)=>{
                            if(err) res.status(501).json({code:"01", message:"error deleting employee"})
                            res.status(200).json({code:"00", message:`${employee.name} deleted successfully`})
                        })
                    }else{
                        res.status(501).json({code:"01", message:"unauthorised to delete employee"})
                    }
                })
            })
        }catch(e){
            console.log(e)
        }
    }

    getUserById(req, res){
        var id={_id:req.params.id}
        try{
            employeeModel.findById(id, (err, employee)=>{
                if(err)res.status(501).json({code:"01", message:"error getting user"})
                res.status(200).json({code:"00", message:employee})
            })
        }catch(e){
            console.log(e)
        }
    }
}

module.exports=new Employee();