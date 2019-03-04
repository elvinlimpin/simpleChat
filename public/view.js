const ENTER = 13
const MAX_MESSAGES = 13

// keep all Jquery here
const dom = db => {
    const toReturn = {
        addChat({msg, userID: id, timeStamp, name, color}, myUsername) {
            $("#blankMessage").append(() =>
                `<span class="msg">
                    ${timeStamp}
                    <strong>
                        <span style="color:#${color}!important"> ${name} </span>:
                    </strong>
                    ${id===myUsername.id?`<strong>${msg}</strong>` : msg}
                    <br>
                </span>`
            )
            // scroll feature
            if($('.msg').length>=MAX_MESSAGES) {
                $('.to-bottom').css({
                    'bottom': 'auto',
                    })
    
                $('.to-bottom-container').scrollTop(function() { return this.scrollHeight }) // DO NOT TURN TO ARROW FN
            }
        },
        
        usersUpdate(docs) {
            $('#users').html('')
            docs.forEach(({name, id}) => $("#users").append(`<p id="user-${id}">${name}</p>`))
        },
        
        init(myUsername) {
            db.goOnline(myUsername.id)
        
            // name display
            $('#textarea').val('')
            const defaultVal = $('#textarea').val()
            $('#username').html(myUsername.name)
        
            // Entering a message DOM Listner
            $('#textarea').keypress(({which: keypressed}) => {
                if(keypressed==ENTER && $('#textarea').val()!==defaultVal) {
                    db.chats().add({
                        msg: $('#textarea').val(),
                        userID: myUsername.id,
                        timeStamp: null // for backend to calculate
                    })
        
                    setTimeout(() => $('#textarea').val(defaultVal), 50) // "Debouncing"
        
                // blank message case
                } else if($('#textarea').val()===defaultVal && keypressed==ENTER) {
                    setTimeout(() => $('#textarea').val(defaultVal), 50) //"debouncing"
                }
            })
        
            // load old messages
            db.chats().orderBy('fullTimeStamp', 'asc').limit(200).get().then(res => {
                for(let doc of res.docs) {
                    toReturn.addChat(doc.data(), myUsername)
                }
            }).catch(err => {
            })
        },

        changeUser({name}, {id}) {
            $('#username').html(name)
            $(`#user-${id}`).html(name)
        }
    }
    return toReturn
}