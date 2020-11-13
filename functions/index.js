const admin = require('firebase-admin');
const functions = require('firebase-functions');
const firebase = require('./firebase');
admin.initializeApp()

exports.pushNotificationCheck = functions.runWith({memory: '2GB'}).pubsub.schedule('* * * * *').onRun(async() => {
  const fb = new firebase();
  // fb.connect();
  fb.getAllUsers(admin);
  return 'hello';
})