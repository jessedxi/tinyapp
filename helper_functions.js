const generateRandomString = function () {
  const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
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


const urlsForUser = function(id, object) {
  let urlArray = []
  for (const key in object) {
    console.log(object[key]);
    if(object[key].userID === id) {
    urlArray.push(key);
    };
  };
  return urlArray;
}




module.exports = {generateRandomString, createNewUser, findUser, urlsForUser};