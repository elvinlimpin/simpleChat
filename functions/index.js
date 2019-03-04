 // firebase
const firebase = require("firebase-admin")
const functions = require('firebase-functions')
firebase.initializeApp(functions.config().firebase)

const app = require('express')()

// local
const regexUtil = require('./regexUtil')
const db = require('./db')()

// serving the client side
app.get('/', (req, res) => res.sendFile(`${__dirname}/index.html`))

db.onEachNewChat(res => {
    // destructuring to get chat object
    const [chatID, {msg, userID}] = [res.id, res.data()]

    // /nick <>
    if(regexUtil.checkNicknameChange(msg)) {
        db.users(userID).update({
            name: msg.substr(6)
        })

        db.chats(chatID).delete() // not meant to show on chatbox

    // /nickcolor <>
    } else if(regexUtil.checkColorChange(msg)) {
        db.users(userID).update({
            color: msg.substr(11)
        })

        db.chats(chatID).delete() // not meant to show on chatbox

    } else {
        
         // timestamp calculated in backend
        db.users(userID).get().then(res => {
            const {name, color} = res.data()
            
            db.chats(chatID).update({
                timeStamp: new Date().toString().substr(16,8),
                fullTimeStamp: Date.now(),
                name,
                color
            })
            return true

            }).catch(err => {
                console.log("can't find chats")
                console.log(err)
        }).catch(err => {
            console.log("can't find user")
            console.log(err)
        })
    }
})

exports.app = functions.https.onRequest(app)