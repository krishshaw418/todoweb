const express = require('express');
const fs = require('fs');
const bodyparser = require('body-parser');
const path = require('path');
const cors = require('cors');
const app = express();
const port=4000;
app.use(cors());
app.use(express.static(path.join(__dirname,'index.html')));
app.use(bodyparser.json());

function findIndex(arr,id){
    for(var i = 0; i<arr.length; i++){
        if(arr[i].id==id)
            return i;
    }
    return -1;
}

function removeAtIndex(arr,index){
    const newtodo = [];
    for(var i = 0; i<arr.length; i++){
        if(i!=index)
            newtodo.push(arr[i]);
    }
    return newtodo;
}

app.get('/',(req,res)=>{
   fs.readFile('tododatabase.json','utf8',(err,data)=>{
    if(err)
        res.status(404).send(`Error`);
    else
        res.status(200).json(JSON.parse(data));
   })
})

app.get('/todohard/:id',(req,res)=>{

    fs.readFile('tododatabase.json','utf8',(err,data)=>{
        if (err)
            throw err;
        else {
            const todo = JSON.parse(data);
            var index = findIndex(todo,parseInt(req.params.id));
            res.status(200).json(todo[index]);
        }
    })

})

app.post('/todohard',(req,res)=>{
    const newtodo = {
        id:Math.floor(Math.random()*1000000),
        title:req.body.title,
        description:req.body.description
    };
    fs.readFile('tododatabase.json','utf8',(err,data)=>{
        if(err)
            throw err;
        const todo = JSON.parse(data);
        todo.push(newtodo);
        fs.writeFile('tododatabase.json',JSON.stringify(todo),'utf8',(err)=>{
            if(err)
                throw err;
            res.status(200).json(newtodo);
        })
    })
})

app.delete('/todohard/:id',(req,res)=>{
    fs.readFile('tododatabase.json','utf8',(err,data)=>{
        if (err)
            throw err;
        else{
            var todo = JSON.parse(data);
            var index = findIndex(todo,parseInt(req.params.id));
            if(index == -1)
                throw err;
            else{
                todo = removeAtIndex(todo,index);
            fs.writeFile('tododatabase.json',JSON.stringify(todo),(err)=>{
                if(err)
                    throw err;
                else
                    res.status(200).json(todo);
            })
            }
        }
    })
})

app.put('/todohard/:id',(req,res)=>{
    fs.readFile('tododatabase.json','utf8',(err,data)=>{
        if(err)
            throw err;
        else{
            var todo = JSON.parse(data);
            var index = findIndex(todo,parseInt(req.params.id));
            const updatedTodo = {
                id:parseInt(req.params.id),
                title:req.body.title,
                description:req.body.description
            }
            todo[index] = updatedTodo;
            fs.writeFile('tododatabase.json',JSON.stringify(todo),'utf8',(err)=>{
                if(err)
                    throw err;
                else
                    res.status(200).json(todo);
            })
        }
    })
})

app.listen(port,()=>{
    console.log(`Listening At Port ${port}`);
})