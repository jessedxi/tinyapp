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

const findUser = function (email, db) {
  const currentUser = Object.values(db).find(user => user.email === email);
  return currentUser;
}


module.exports = {generateRandomString, createNewUser, findUser};