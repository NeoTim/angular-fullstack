'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CustomerSchema = new Schema({
   company: String,
   number: Number, 
   phone: String,
   email: String,
   address:{
  	  street: String,
     address: String,
     city: String, 
     state: String, 
     zip: String, 
     country: String,
  },
  active: Boolean,
  position: Number
});

module.exports = mongoose.model('Customer', CustomerSchema);