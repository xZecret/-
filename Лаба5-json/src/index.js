const express = require("express");
const fs = require("fs");
    
const app = express();
const jsonParser = express.json();
  
app.use(express.static(__dirname + "/../public"));

const filePath = "students.json";
app.get("/students", function(req, res){
       
    const content = fs.readFileSync(filePath,"utf8");
    const students = JSON.parse(content);
    res.send(students);
});
// получение одного пользователя по id
app.get("/students/:id", function(req, res){
       
    const id = req.params.id; // получаем id
    const content = fs.readFileSync(filePath, "utf8");
    const students = JSON.parse(content);
    let student = null;
    // находим в массиве пользователя по id
    for(var i=0; i<students.length; i++){
        if(students[i].id==id){
            student = students[i];
            break;
        }
    }
    // отправляем пользователя
    if(student){
        res.send(student);
    }
    else{
        res.status(404).send();
    }
});
// получение отправленных данных
app.post("/students", jsonParser, function (req, res) {
      
    if(!req.body) return res.sendStatus(400);
      
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const group = req.body.group;
    const updatedAt = new Date().toISOString();

    let student = {
        firstName: firstName,
        lastName: lastName,
        group: group,
        createdAt: updatedAt, // дата создания
        updatedAt: updatedAt // дата редактирования
    };
      
    let data = fs.readFileSync(filePath, "utf8");
    let students = JSON.parse(data);
      
    // находим максимальный id
    const id = Math.max.apply(Math,students.map(function(o){return o.id;}))
    // увеличиваем его на единицу
    student.id = id+1;
    // добавляем пользователя в массив
    students.push(student);
    data = JSON.stringify(students);
    // перезаписываем файл с новыми данными
    fs.writeFileSync("students.json", data);
    res.send(student);
});
 // удаление пользователя по id
app.delete("/students/:id", function(req, res){
       
    const id = req.params.id;
    let data = fs.readFileSync(filePath, "utf8");
    let students = JSON.parse(data);
    let index = -1;
    // находим индекс пользователя в массиве
    for(var i=0; i < students.length; i++){
        if(students[i].id==id){
            index=i;
            break;
        }
    }
    if(index > -1){
        // удаляем пользователя из массива по индексу
        const student = students.splice(index, 1)[0];
        data = JSON.stringify(students);
        fs.writeFileSync("students.json", data);
        // отправляем удаленного пользователя
        res.send(student);
    }
    else{
        res.status(404).send();
    }
});
// изменение пользователя
app.put("/students/:id", jsonParser, function(req, res){
       
    if(!req.body) return res.sendStatus(400);
      
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const group = req.body.group;
    const updatedAt = new Date().toISOString();
      
    let data = fs.readFileSync(filePath, "utf8");
    const students = JSON.parse(data);
    let student;
    for(var i=0; i<students.length; i++){
        if(students[i].id==req.params.id){
            student = students[i];
            break;
        }
    }
    // изменяем данные у пользователя
    if(student){
        student.firstName = firstName;
        student.lastName = lastName;
        student.group = group;
        student.updatedAt = updatedAt;
        data = JSON.stringify(students);
        fs.writeFileSync("students.json", data);
        res.send(student);
    }
    else{
        res.status(404).send(student);
    }
});
   
app.listen(3333, function(){
    console.log("Сервер ожидает подключения...");
});