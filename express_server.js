const express = require("express");
const app = express();
const PORT = 8080; // <= Defeault port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { generateRandomString, createNewUser, findUser } = require("./helper_functions")

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//generates urls main page
app.get("/urls", (req, res) => {
console.log(req.cookies["userID"]);
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

//creates new url
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  let randomID = generateRandomString();
  urlDatabase[randomID] = longURL;
  res.redirect("/urls/" + randomID);
});

//shows create new url page
app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies["userID"]]};
  res.render("urls_new", templateVars);
});

//redirects to website asigned to shortURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  if (longURL === undefined) {
    res.render("urls_404");
  }
  res.redirect(longURL);
});

//renders edit page
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL], 
    user: users[req.cookies["userID"]] 
  };

  if (!urlDatabase[req.params.shortURL]) {
    res.render("urls_404");
  }
  res.render("urls_show", templateVars);
});

//deletes url when delete is pressed
app.post("/urls/:shortURL/delete", (req, res) => {
  console.log("Delete button pressed.");
  console.log(req.params.shortURL);
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//confirms edit when button is pressed
app.post("/urls/:shortURL/edit", (req, res) => {
  let newLong = req.body.longURL;
  urlDatabase[req.params.shortURL] = newLong;
  res.redirect("/urls");
})

//logs user in
app.post("/login", (req, res) => {
  let cookie = req.body.username
  res.cookie('userID', cookie);
  res.redirect("/urls");
});

//logs user out
app.post("/logout", (req, res) => {
  res.clearCookie('userID');
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const email = req.body.email
  const password = req.body.password;
  const newUserID = generateRandomString();
  

  if(req.body.email === "" || req.body.password=== "") {
    res.send('Error, please input valid information')
  };

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