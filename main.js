const express = require('express');
const dotenv = require('dotenv');
const Joi = require('joi');
dotenv.config();
const { get } = require('express/lib/response');
const app = express();
app.use(express.json())
const courses = [
    { id: 1, name: "course1" },
    { id: 2, name: "course2" },
    { id: 3, name: "course3" },
];

app.get("/", (req, res) => {
    res.send("Hello world");
});

app.get("/api/courses", (req, res) => {
    res.send(courses);
});

//Single Param
app.get("/api/courses/:id", (req, res) => {
    const id = req.params.id;
    const course = courses.find(c => c.id === parseInt(id));
    if (!course) return res.status(404).send("The course with given id was not found");
    res.send(course);
});

//Multiple Params
app.get("/api/courses/:year/:month", (req, res) => {
    res.send(req.params);
});

//query Params example route : /q?sortBy=month
app.get("/api/courses/:year/:month/q", (req, res) => {
    res.send(req.query);
});

//POST to add new course
app.post("/api/courses", (req, res) => {
    const schema = {
        name: Joi.string().min(3).required()
    };
    const result = Joi.validate(req.body, schema);
    console.log(result);
    if (result.error) {
        res.status(400).send(result.error.details[0].message); //you can find out what is error oject by using result.error
        return;
    }

    // below code is to do input validations without joi class dependencey
    // if(!req.body.name || req.body.name.length <3){
    //     res.status(400).send("Name is required and name should be atlease 3 characters");
    //     return;   
    // }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {

    //Search whether course is available, if not send 404
    const id = req.params.id;
    const course = courses.find(c => c.id === parseInt(id));
    if (!course) return res.status(404).send("The course with given id was not found");

    //Validate request, if request is bad send 400
    const { error } = validateCourse(req.body); //equivalent to result.error
    if (error) {
        res.status(400).send(error.details[0].message); //you can find out what is error oject by using result.error
        return;
    }
    //Update the data of course
    course.name = req.body.name;
    res.send(course);
});

app.delete("/api/courses/:id",(req,res)=>{
    const id = req.params.id;
    const course = courses.find(c=>c.id=== parseInt(id));
    if(!course) return res.status(404).send("The course with given id was not found");

    const index = courses.indexOf(course);
    courses.splice(index,1);
    console.log(courses);
    res.send(course);
});

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening to port ${port}`));