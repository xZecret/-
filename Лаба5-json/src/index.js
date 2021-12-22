const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const jsonParser = express.json();
const fs = require("fs");

const pathfile = __dirname + "/students.json";

//Получаем весь список студентов
app.get("/student", function (req, res) {
  let spisok = fs.readFileSync(pathfile, "utf8");
  const students = JSON.parse(spisok);
  res.send(students);
});

//Получаем конкретного студента
app.get("/student/:id", function (req, res) {
  let spisok = fs.readFileSync(pathfile, "utf8");
  const id = req.params.id;
  const students = JSON.parse(spisok);
  let student = null;
  for (var i = 0; i < students.length; i++) {
    if (students[i].id == id) {
      student = students[i];
      break;
    }
  }
  if (student) {
    res.send(student);
  } else {
    res.status(404).send();
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Добавляем нового студента
app.post("/student", jsonParser, function (req, res) {
  if (!req.body) return res.sendStatus(400);
  let spisok = fs.readFileSync(pathfile, "utf8");

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const group = req.body.group;

  let student = JSON.parse(
    JSON.stringify({
      id: null,
      firstName: firstName,
      lastName: lastName,
      group: group
    })
  );
  let students = JSON.parse(spisok);
  const id = Math.max.apply(
    Math,
    students.map(function (a) {
      return a.id;
    })
  );
  student.id = id + 1;
  student.createdAt = new Date().toISOString();
  student.updatedAt = student.createdAt;
  students.push(student);
  spisok = JSON.stringify(students);
  fs.writeFileSync(pathfile, spisok);
  res.send(student);
});

app.delete("/student/:id", function (req, res) {
  let spisok = fs.readFileSync(pathfile, "utf8");
  const id = req.params.id;
  let students = JSON.parse(spisok);
  let del_id = -1;
  for (var i = 0; i < students.length; i++) {
    if (students[i].id == id) {
      del_id = i;
      break;
    }
  }
  if (del_id > -1) {
    const student = students.splice(del_id, 1)[0];
    spisok = JSON.stringify(students);
    fs.writeFileSync(pathfile, spisok);
    res.send(student);
  } else {
    res.status(404).send();
  }
});

//Изменение определенного студента
app.put("/student", jsonParser, function (req, res) {
  if (!req.body) return res.sendStatus(400);
  let spisok = fs.readFileSync(pathfile, "utf8");

  const id = req.body.id;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const group = req.body.group;

  const students = JSON.parse(spisok);
  let student;
  for (var i = 0; i < students.length; i++) {
    if (students[i].id == id) {
      student = students[i];
      break;
    }
  }
  // изменяем данные у пользователя
  if (student) {
    student.firstName = firstName;
    student.lastName = lastName;
    student.group = group;
    student.updatedAt = new Date().toISOString();
    spisok = JSON.stringify(students);
    fs.writeFileSync(pathfile, spisok);
    res.send(student);
  } else {
    res.status(404).send(student);
  }
});

app.listen(8080);
