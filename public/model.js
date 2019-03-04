const database = () => {
    const db = firebase.firestore()
    const oldDB = firebase.database() // used for prescence since it's not implemented in firestore

    return({
        users: id => id? db.collection('user').doc(id): db.collection('user'),

        chats: id => id? db.collection('chat').doc(id): db.collection('chat'),

        onChatUpdate: callback => db.collection('chat').onSnapshot(callback),
        onUserUpdate: callback => db.collection('user').onSnapshot(callback),


//////// USER PRESCENCE

        goOnline: id => {
            const me = oldDB.ref(`/prescence/user/${id}`)
            me.set(true)
            console.log("Connected:", id)
            me.onDisconnect(() => {
                console.log("Disconnected:", id)
            }).set(false)
            
        },

        // checks for user prescence
        onIOUpdate: callback => oldDB.ref('prescence').on('value', snapshot => {
            // descture for IDs
            const values = snapshot.val().user, IDs = []

            // "Abuse" of for in (iterator is Object.key LOL)
            for(let key in values) if(values[key]) IDs.push(key)

            db.collection('user').get().then(({docs}) => {
                
                // manipulate array for online users
                callback(docs.map(doc => {
                    const toReturn = doc.data()
                    toReturn.id = doc.id
                    return toReturn
                }).filter(doc => IDs.some(id => id==doc.id)))
            })
        }),

        // essentially calls dbRoutes.onIOupdate
        triggerIOUpdate: () => oldDB.ref('/prescence/timeStamp/').set({
            timeStamp: new Date()
        })
    })
}