const express = require('express');
const app = express() // Creating a exprss 
const port = 3000 // Assining the port numnber
var  MongoClient = require('mongodb').MongoClient;
var  url =  "mongodb://localhost:27017/user"; // database name is mydb
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.set('views', './');
app.set("view engine", "ejs");

app.post('/registerUser', function(req, response) {
    var first_nameV = req.body.first_name;
    var last_nameV = req.body.last_name;
    var ageV = req.body.age;
    var emailV = req.body.email;
    var phoneV = req.body.phone;
    var passwordV = req.body.password;
    var data = { result: "User Registered Sucsessfully" };;

    if (first_nameV == "" || last_nameV == "" || ageV == "" || emailV == "" || phoneV == "" || passwordV == "") {
        response.statusCode = 404;
        data = { result: "Empty fields" };
        response.send(data);
    } else {
        MongoClient.connect(url,   { useUnifiedTopology: true }, function(err, db) {
            if  (err)  {
                res.statusCode = 404;
                data = { result: "Failed" };
            } else {
                var  dbo = db.db("user");
                var  myobj = { first_name: first_nameV, last_name: last_nameV, age: ageV, email: emailV, phone: phoneV, password: passwordV };
                console.log(myobj);
                dbo.collection("user").findOne({ email: emailV }, function(err, document) {
                    //console.log(document);
                    //data = {result: "Email already exist"};                      
                    if (document != null) {
                        document.statusCode = 404;
                        console.log("Email already exists");
                        data = { result: "Email already exists" };

                    } else {
                        dbo.collection("user").insertOne(myobj,  function(err, res) {
                            if (err) {
                                res.statusCode = 404;
                                console.log("Inserted failed");
                                data = { result: "Failed" };
                            } else {
                                res.statusCode = 200;
                                console.log("1 Document inserted Sucsessfully");
                                db.close();
                            }

                        });
                    }
                    response.send(data);
                });
            }

        });
    }
    //        response.send(data);
});


app.post('/loginUser', function(req, response) {
    var emailV = req.body.email;
    var passwordV = req.body.password;
    var data = { result: "Default" };

    if (emailV == "" || passwordV == "") {
        response.statusCode = 404;
        data = { result: "Empty fields" };
        response.send(data);

    } else {
        MongoClient.connect(url,   { useUnifiedTopology: true }, function(err, db) {
            if  (err)  {
                res.statusCode = 404;
                data = { result: "Failed" };
            } else {
                var  dbo = db.db("user");
                var  myobj = { email: emailV, password: passwordV };
                console.log(myobj);
                dbo.collection("user").findOne({ email: emailV }, function(err, document) {
                    console.log(document);
                    if (err) {
                        res.statusCode = 404;
                        console.log("Login failed");
                    }
                    if (document == null) {
                        db.statusCode = 200;
                        data = { result: "Please Register" };
                        return response.sendFile(__dirname + '/register.html');

                    } else {
                        console.log("Email exists");
                        if (document.email == emailV && document.password == passwordV) {
                            document.statusCode = 200;
                            console.log("1 document found");
                            data = { user: document };
                            return response.render('dashboard', data);
                            db.close();
                        } else {
                            console.log("Password invalid, please verify and try again");
                            data = { result: "Password invalid, please verify and try again" };
                        }
                    }
                    response.send(data);
                });
            }
        });
    }
    //response.send(data);

});

app.get('/editProfile/:email', function(req, response) {
    MongoClient.connect(url,   { useUnifiedTopology: true }, function(err, db) {
        if  (err)  {
            res.statusCode = 404;
            data = { result: "Failed" };
        } else {
            var  dbo = db.db("user");
            console.log('req.params.email', req.params.email);
            dbo.collection("user").findOne({ email: req.params.email }, function(err, document) {
                console.log(document);
                if (err) {
                    res.statusCode = 404;
                    console.log("Login failed");
                }
                if (document == null) {
                    db.statusCode = 200;
                    data = { result: "Please Register" };
                    return response.sendFile(__dirname + '/register.html');

                } else {
                    console.log("Email exists");
                    document.statusCode = 200;
                    console.log("1 document found");
                    data = { user: document };
                    return response.render('edit', data);
                    db.close();
                }
                response.send(data);
            });
        }
    });
});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})