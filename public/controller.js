// "Imports"
const model = database()
const view = dom(model)

// flag
const noCookies = false

const capitalizeFirstLetter = str => `${str.charAt(0).toUpperCase()}${str.slice(1)}`
const makeUsername = () => ({
    name: `${randomWords()}${capitalizeFirstLetter(randomWords())}`,
    color: '000'
})

$(() => {

    // Check cookies before init - you may not need a new user
    let myUsername = noCookies? false: (Cookies.get('chatUser')? JSON.parse(Cookies.get('chatUser')): null)
    if(myUsername)
        view.init(myUsername)
    else {
        myUsername = makeUsername()
        model.users().add(myUsername).then(({id}) => {
            myUsername.id = id
        
            noCookies && Cookies.set('chatUser', JSON.stringify(myUsername))
            view.init(myUsername)
        }).catch(err => {
            console.log("can't post user")
            console.log(err)
        })
    }

//////// listeners

    model.onIOUpdate(view.usersUpdate)

    model.onChatUpdate(snapshot => {
        let changes = snapshot.docChanges()
        changes.some(change => {
            if(change.type=='modified') {
                view.addChat(change.doc.data(), myUsername)
                return true // essentially a break statement. "Abuse" of Array.some function
            }
        })
    })

    model.onUserUpdate(snapshot => {
        let changes = snapshot.docChanges()
        changes.forEach(({doc, type}) => {
            if(type=='modified') {
                if(doc.id==myUsername.id) {
                    const newUser = doc.data()
                    newUser.id = doc.id

                    view.changeUser(newUser, myUsername)

                    noCookies && Cookies.set('chatUser', JSON.stringify(newUser))
                }
            }
        })

        // on modify, the online users DOM must also be updated through DB call
        model.triggerIOUpdate()
    })
})