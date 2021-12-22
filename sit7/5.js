const express = require("express");
const Pool = require('pg').Pool;
const app = express();
const jsonParser = express.json();

const Pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'students',
    password: 'password',
    port: 5432,
}); Pool.connect();

app.get("/students", function (req, res) {
    const query = `
    SELECT *
    FROM student
    `;
 Pool.query(query, (e, r) => {
        if (e) {
            console.error(e);
            return;
        }
        res.send(r.rows);
    });
});
// получение одного пользователя по id
app.get("/students/:id", function (req, res) {

    const id = req.params.id; // получаем id
    const query = `
    SELECT *
    FROM student
    WHERE id=` + id;
 Pool.query(query, (e, r) => {
        if (e) {
            console.error(e);
            return;
        }
        res.send(r.rows[0]);
    });
});
// получение отправленных данных
app.post("/students", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const groupname = req.body.groupname;
    const updated_at = new Date().toISOString();

    const query = `
    INSERT INTO student (firstname, lastname, groupname, created_at, updated_at)
    VALUES ('`+ firstname + `', '` + lastname + `', '` + groupname + `', current_timestamp, current_timestamp) RETURNING id`;
 Pool.query(query, (e, r) => {
        if (e) {
            console.error(e);
            return;
        }
        console.log(r);
        let student = {
            id: r.rows[0]['id'],
            firstname: firstname,
            lastname: lastname,
            groupname: groupname,
            created_at: updated_at, // дата создания
            updated_at: updated_at // дата редактирования
        };
        res.send(student);
    });
});
// удаление пользователя по id
app.delete("/students/:id", function (req, res) {

    const id = req.params.id;
    const query = `
    SELECT *
    FROM student
    WHERE id=` + id;
 Pool.query(query, (e, r) => {
        if (e) {
            console.error(e);
            return;
        }
        res.send(r.rows[0]);
    });
    const query1 = `
    DELETE FROM student
    WHERE id=`+ id;
 Pool.query(query1, (e, r) => {
        if (e) {
            console.error(e);
            return;
        }
    });
});
// изменение пользователя
app.put("/students/:id", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    const id = req.params.id;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const groupname = req.body.groupname;

    const query = `
    UPDATE student
    SET firstname='`+ firstname + `', lastname='` + lastname + `', groupname='` + groupname + `', updated_at=current_timestamp
    WHERE id=`+ id;
 Pool.query(query, (e, r) => {
        if (e) {
            console.error(e);
            return;
        }
    });
    const query1 = `
    SELECT *
    FROM student
    WHERE id=` + id;
 Pool.query(query1, (e, r) => {
        if (e) {
            console.error(e);
            return;
        }
        res.send(r.rows[0]);
    });
});

app.listen(3000, function () {
    console.log("Сервер ожидает подключения...");
});