const express = require("express");
const app = express();
const PORT = 8080; // <= Defeault port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');
const { generateRandomString, createNewUser, findUser, urlsForUser } = require("./helper_functions")

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "userRandomID"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "user2RandomID"}
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("pmd", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
}


app.get("/", (req, res) => {
  if(req.cookies["userID"] !== undefined) {
    res.redirect("/urls")
    } else {
      res.redirect("/login")
    }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//generates urls main page
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["userID"]]
  };

  res.render("urls_index", templateVars);
});

//generates registration page
app.get("/register", (req, res) => {

  const templateVars = {
    user: users[req.cookies["userID"]]
  };

  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars ={
    user: users[req.cookies["userID"]]
  };

  res.render("urls_login", templateVars);
})

//creates new url
app.post("/urls", (req, res) => {
  const newUrl = {
    longURL: req.body.longURL,
    userID: req.cookies["userID"]
  };
  let randomID = generateRandomString();
  urlDatabase[randomID] = newUrl;
  res.redirect("/urls/" + randomID);
  console.log(urlDatabase);
});

//shows create new url page
app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies["userID"]]};
  res.render("urls_new", templateVars);
});

//redirects to website asigned to shortURL
app.get("/u/:shortURL", (req, res) => {
  console.log(urlDatabase[req.params.shortURL])
 
  if (urlDatabase[req.params.shortURL] === undefined) {
    res.status(404).send("404 page not found!");
  } else {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
  }
});

//renders edit page
app.get("/urls/:shortURL", (req, res) => {
  
  if(urlDatabase[req.params.shortURL] && urlsForUser(req.cookies["userID"], urlDatabase ).includes(req.param.shortURL).toString()) {
  const templateVars = { shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL].longURL, 
    user: users[req.cookies["userID"]] 
  }
  res.render("urls_show", templateVars);
  } else if (!urlDatabase[req.params.shortURL]) {
    const templateVars = {user: users[req.cookies["userID"]]}
    res.status(404).render("urls_404", templateVars);
  };
  
});

//deletes url when delete is pressed
app.post("/urls/:shortURL/delete", (req, res) => {
  if(urlDatabase[req.params.shortURL].userID === req.cookies["userID"]) {
  console.log("Delete button pressed.");
  console.log(req.params.shortURL);
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
  }
});

//confirms edit when button is pressed
app.post("/urls/:shortURL/edit", (req, res) => {
  if(urlDatabase[req.params.shortURL].userID === req.cookies["userID"]) {
  let newLong = req.body.longURL;
  urlDatabase[req.params.shortURL].longURL = newLong;
  res.redirect("/urls")
  }
})

//logs user in
app.post("/login", (req, res) => {
  
  //finds if user is in DB using find user
  //checks if password is assigned to that user object, passing the result of find user as parameter
  //if all conditions meet, sets cookie as current user
  // redirects to index

  if(findUser(req.body.email, users)) {

    const user = findUser(req.body.email, users);

    if(bcrypt.compareSync(req.body.password, user.password)) {
      res.cookie("userID", user.id);
      res.redirect("/urls");
    } else {
      res.status(403).send('Error 403: Invalid Password')
    
    }
  } else {

  res.status(403).send('Error 403:  Invalid email');
  }
});

//logs user out
app.post("/logout", (req, res) => {
  res.clearCookie('userID');
  res.redirect("/urls");
});

// registers new user
app.post("/register", (req, res) => {
  const email = req.body.email
  const password = bcrypt.hashSync(req.body.password, 10);
  const newUserID = generateRandomString();
  

  if(req.body.email === "" || req.body.password=== "") {
    res.status(400).send('Error, satus code: 400');
  };

  if(findUser(req.body.email, users)) {
    res.status(400).send('Error, status code: 400');
  }

  createNewUser(users, email, password, newUserID)
  console.log(users);
  res.cookie("userID", newUserID);
  res.redirect("/urls");

});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}`);
});