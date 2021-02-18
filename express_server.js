const express = require("express");
const app = express();
const PORT = 8080; // <= Defeault port 8080
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require('bcrypt');
const { generateRandomString, createNewUser, findUser, urlsForUser } = require("./helper_functions");

app.use(cookieSession({
  name: 'session',
  keys: ['7f69fa85-caec-4d9c-acd7-eebdccb368d5', 'f13b4d38-41c4-46d3-9ef6-8836d03cd8eb'],
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "user2RandomID" }
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
};


app.get("/", (req, res) => {
  if (req.session.user_id && req.session.user_id !== null) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//generates urls main page
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.session.user_id]
  };

  res.render("urls_index", templateVars);
});

//generates registration page
app.get("/register", (req, res) => {
  if (req.session.user_id && req.session.user_id !== null) {
    res.redirect("/urls");
  } else {
    const templateVars = {
      user: users[req.session.user_id]
    };

    res.render("urls_register", templateVars);
  }
});

//renders login page
app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };

  res.render("urls_login", templateVars);
});

//creates new url
app.post("/urls", (req, res) => {
  const newUrl = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  };
  let randomID = generateRandomString();
  urlDatabase[randomID] = newUrl;
  res.redirect("/urls/" + randomID);
  console.log(urlDatabase);
});

//shows create new url page
app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.session.user_id] };
  res.render("urls_new", templateVars);
});

//redirects to website asigned to shortURL
app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL] === undefined) {
    res.status(404).send("404 page not found!");
  } else {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  }
});

//renders edit page
app.get("/urls/:shortURL", (req, res) => {
  const urlDatabaseIncludesShortUrl = urlsForUser(req.session.user_id, urlDatabase).includes(req.param.shortURL).toString();

  if (urlDatabase[req.params.shortURL] && urlDatabaseIncludesShortUrl) {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.session.user_id]
    };

    res.render("urls_show", templateVars);

  } else if (!urlDatabase[req.params.shortURL]) {
    const templateVars = { user: users[req.session.user_id] };
    res.status(404).render("urls_404", templateVars);
  }
});

//deletes url when delete is pressed
app.post("/urls/:shortURL/delete", (req, res) => {
  if (urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    console.log("Delete button pressed.");
    console.log(req.params.shortURL);
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.status(403).send("I can't let you do that, Star Fox! -- ERROR 403!");
  }
});

//confirms edit when button is pressed
app.post("/urls/:shortURL/edit", (req, res) => {
  if (urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    let newLong = req.body.longURL;
    urlDatabase[req.params.shortURL].longURL = newLong;
    res.redirect("/urls");
  } else {
    res.status(403).send('Error 403 - Permission Denied');
  }
});

//logs user in
app.post("/login", (req, res) => {
  if (findUser(req.body.email, users)) {
    const user = findUser(req.body.email, users);

    if (bcrypt.compareSync(req.body.password, user.password)) {
      req.session.user_id = user.id;
      res.redirect("/urls");
    } else {
      res.status(403).send('Error 403: Invalid Password');
    }
  } else {
    res.status(403).send('Error 403:  Invalid email');
  }
});

//logs user out
app.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/urls");
});

// registers new user
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10);
  const newUserID = generateRandomString();

  if (req.body.email === "" || req.body.password === "") {
    res.status(400).send('Error, satus code: 400');
  } else if (findUser(req.body.email, users)) {
    res.status(400).send('Error, status code: 400');
  } else {
    createNewUser(users, email, password, newUserID);
    req.session.user_id = newUserID;
    res.redirect("/urls");
  };
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}`);
});