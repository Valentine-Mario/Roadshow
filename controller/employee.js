const employeeModel=require('../models/employees')
const auth=require('../helpers/auth')

class Employee{
    addEmployee(req, res){
        var data={
        business:'',
        name:req.body.name,
        employees:req.body.employees
        }
        try{
            auth.verifyBusinessToken(req.token).then(business=>{
                data.business=business._id
                data.employees= data.employees.split(',')
                        employeeModel.create(data, (err, employee)=>{
                            if(err)res.status(501).json({code:"01", err:err, message:"error adding employee"})
                            res.status(200).json({code:"00", message:employee})
                        })
            })
        }catch(e){
            res.status(501)
            console.log(e)
        }
    }
    
    
    editName(req, res){
        var data={
            name:req.body.role
        }
        var id={_id:req.params.id}
        try{
            auth.verifyBusinessToken(req.token).then(business=>{
                employeeModel.findById(id, (err, employee)=>{
                    if(JSON.stringify(employee.business)===JSON.stringify(business._id)){  
                            
                                employeeModel.findByIdAndUpdate(id, data, (err)=>{
                                    if(err)res.status(501).json({code:"01", err:err, message:"error updating group"})
                                    res.status(200).json({code:"00", message:"update successful"})
                                })
                            
                          
                    }else{
                        res.status(201).json({code:"01", message:"unauthorised to edit details"})
                    }
                })
            })
        }catch(e){
            res.status(501)
            console.log(e)
        }
    }

    deleteGroup(req, res){
        var id={_id:req.params.id}
        try{
            auth.verifyBusinessToken(req.token).then(business=>{
                employeeModel.findById(id, (err, employee)=>{
                    if(JSON.stringify(employee.business)===JSON.stringify(business._id)){
                        employeeModel.findOneAndDelete(id, (err)=>{
                            if(err) res.status(501).json({code:"01", message:"error deleting group"})
                            res.status(200).json({code:"00", message:`${employee.name} deleted successfully`})
                        })
                    }else{
                        res.status(501).json({code:"01", message:"unauthorised to delete employee"})
                    }
                })
            })
        }catch(e){
            res.status(501)
            console.log(e)
        }
    }

   

    getEmployee(req, res){
        var options={
            page:parseInt(page, 10) || 1,
            limit:parseInt(limit, 10) || 10,
     }
        try{
            auth.verifyBusinessToken(req.token).then(async (business)=>{
                var employee= await employeeModel.paginate({business:business._id}, options)
                return res.status(200).json({code:"00", message:employee})
            })
        }catch(e){
            res.status(501)
            console.log(e)
        }
    }

    addNameToGroup(req, res){
        var data={
            names:req.body.names
        }
        var id={_id:req.params.id}
        try{
            auth.verifyBusinessToken(req.token).then(business=>{
                employeeModel.findById(id, (err, group)=>{
                    if(JSON.stringify(group.business)===JSON.stringify(business._id)){
                        new_name= data.names.split(',')
                        name=group.name.concat(new_name)
                    employeeModel.findByIdAndUpdate(id, {name}, (err)=>{
                        if(err)res.status(501).message({code:"01", message:"error updating names"})
                        res.status(200).json({code:"00", message:"name updated successfully"})
                    })
                    }else{
                        res.status(402).json({code:"01", message:"unauthorized to access this route"})
                    }
                    
                })
            })
        }catch(e){
            res.status(501)
        }
    }

    getEmployeeForUse(id){
        return new Promise((res, rej)=>{
        employeeModel.find({business:id}, '-_id -__v -business', (err, employee)=>{
            if(err)rej(err)
            res(employee)
        })
    })
    }
}

module.exports=new Employee();