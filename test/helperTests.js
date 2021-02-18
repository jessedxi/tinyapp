const { assert } = require('chai');
const { findUser } = require("../helper_functions.js");

const testUsers = {
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
};

describe('findUser', function() {
  it('should return a valid user when passed a valid email', function () {
    const user = findUser('user@example.com', testUsers)
    const expectedOuput = {
      id: 'userRandomID',
      email: 'user@example.com',
      password: 'purple-monkey-dinosaur'
    }
    assert.equal(user.id, expectedOuput.id);
  });

  it("Should return undefined if passed an invalid email", function () {
    const user = findUser('notUser@example.com', testUsers)
    const expectedOutput = undefined
    assert.equal(user, undefined);
  });

});

