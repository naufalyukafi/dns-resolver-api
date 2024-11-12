const { faker } = require('@faker-js/faker');

function generateUserData (request, context, ee, next) {
    context.vars["name"] = faker.person.fullName();
    context.vars["phone"] = faker.phone.number();
    context.vars["email"] = faker.internet.email();
    context.vars["password"] = faker.internet.password();
    return next();
}

module.exports = {
    generateUserData
}