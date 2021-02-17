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

const checkPassword = function(password, user) {
  if(user.password === password) {
    return true;
  }
  return false;
}


module.exports = {generateRandomString, createNewUser, findUser, checkPassword};