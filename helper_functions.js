const generateRandomString = function () {
  const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 7; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
};

const createNewUser = function (dataBase, emailInput, passwordInput, ID) {

  const newUser = {
    id: ID,
    email: emailInput,
    password: passwordInput
  };

  dataBase[ID] = newUser;
};

//finds if a user is within a current database by a registered email
const findUser = function (email, db) {
  const currentUser = Object.values(db).find(user => user.email === email);
  return currentUser;
};

// Rendered useless with bcrypt, held onto in case of changes.
/*
const checkPassword = function(password, user) {
  if(user.password === password) {
    return true;
  }
  return false;
} */

/*const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "userRandomID"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "user2RandomID"}
};*/

const urlsForUser = function(id, object) {
  let urlArray = []
  for (const key in object) {
    console.log(object[key]);
    if(object[key].userID === id) {
    urlArray.push(key);
    }
  };
  return urlArray;
}

//console.log(urlsForUser("userRandomID", urlDatabase));



module.exports = {generateRandomString, createNewUser, findUser, urlsForUser};