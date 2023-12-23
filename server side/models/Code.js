
const {Schema, model} = require('mongoose');

const UserSchema = Schema({
  code: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
   
});

const Code = model('Code', UserSchema);
module.exports = Code;

