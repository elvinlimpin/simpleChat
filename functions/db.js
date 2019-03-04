const firebase = require('firebase-admin')

module.exports = (database = firebase.firestore()) => ({
    users: (id=false) => id? database.collection('user').doc(id): database.collection('user'),

    chats: (id=false) => id? database.collection('chat').doc(id): database.collection('chat'),
    
    onEachNewChat: callback => database.collection('chat').onSnapshot(snapshot => {
        let changes = snapshot.docChanges()

        // specifying new chats only
        changes.some(({type, doc}) => {
            if(type==='added') {
                callback(doc)
                return true // essentially a break statement. "Abuse" of Array.some function
            }
        })
    }),
})