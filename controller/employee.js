const employeeModel=require('../models/employees')
const auth=require('../helpers/auth')

class Employee{
    addEmployee(req, res){
        var data={
        user:'',
        name:req.body.name,
        employees:req.body.employees
        }
        try{
            auth.verifyToken(req.token).then(user=>{
                if(user.account_type!=='Business'){
                    res.status(201).json({code:"01", message:"account type unauthorised from creating employee group"})
                }else{
                    data.user=user._id
                    data.employees= data.employees.split(',')
                        employeeModel.create(data, (err, employee)=>{
                            if(err)res.status(501).json({code:"01", err:err, message:"error adding employee"})
                            res.status(200).json({code:"00", message:employee})
                        })
                }
            })
        }catch(e){;
            res.status(501)
        }
    }
    
    
    editName(req, res){
        var data={
            name:req.body.name
        }
        var id={_id:req.params.id}
        try{
            auth.verifyToken(req.token).then(user=>{
                employeeModel.findById(id, (err, employee)=>{
                    if(JSON.stringify(employee.user)===JSON.stringify(user._id)){  
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
            auth.verifyToken(req.token).then(user=>{
                employeeModel.findById(id, (err, employee)=>{
                    if(JSON.stringify(employee.user)===JSON.stringify(user._id)){
                        employeeModel.findByIdAndDelete(id, (err)=>{
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
            auth.verifyToken(req.token).then(async (user)=>{
                employeeModel.paginate({user:user._id}, options, (err, employee))
                if(err)res.status(201).json({code:"01", message:"error getting employee list"})
                res.status(200).json({code:"00", message:employee})
            })
        }catch(e){
            res.status(501)
        }
    }

    addNameToGroup(req, res){
        var data={
            employees:req.body.employees
        }
        var id={_id:req.params.id}
        try{
            auth.verifyToken(req.token).then(user=>{
                employeeModel.findById(id, (err, group)=>{
                    if(JSON.stringify(group.user)===JSON.stringify(user._id)){
                        var new_name= data.employees.split(',')
                        var employees= group.employees.concat(new_name)
                    employeeModel.findByIdAndUpdate(id, {employees}, (err)=>{
                        if(err)res.status(501).json({code:"01", message:"error updating names"})
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

    getGroupById(req, res){
        var id={_id:req.params.id}
        try{
            employeeModel.findById(id, (err, group)=>{
                if(err) res.status(501).status({code:"01", message:"error getting group"})
                res.status(200).json({code:"00", message:group})
            })
        }catch(e){
           res.status(500)
        }
    }

    deleteNameFromGroup(req, res){
        var id={_id:req.params.id}
        var data={
            name:req.body.name
        }
        try{
            auth.verifyToken(req.token).then(user=>{
                employeeModel.findById(id, (err, group)=>{
                    if(JSON.stringify(user.id)!==JSON.stringify(group.user)){
                        res.status(201).json({code:"01", message:"unauthorized to delete group"})
                    }else{
                        if(group.employees.includes(data.name)){
                            group.employees.splice(group.employees.indexOf(data.name), 1)
                            group.save()
                            res.status(200).json({code:"00", message:"name removed successfully"})
                        }else{
                            res.status(201).json({code:"01", message:"name not included in group"})
                        }
                    }
                })
            }).catch(err=>{
                console.log(err)
            })
        }catch(e){
            res.status(500)
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