const db = require('../db')
const Schema = db.Schema;
console.log('model - database connection state: ', db.connection.readyState)
const userSchema = new Schema({ username: String });
const userModel = db.model('user', userSchema);

module.exports = userModel;