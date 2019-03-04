
const util = {
    isColor: toTest => /^(?:[0-9a-fA-F]{3}){1,2}$/.test(toTest),
    isName: toTest => /[a-z\d\-_\s]+/i.test(toTest),

    checkNicknameChange: str => /\/nick /.test(str.substr(0,6)) && util.isName(str.substr(6)),
    checkColorChange: str => /\/nickcolor /.test(str.substr(0,11)) && util.isColor(str.substr(11)),
}

module.exports = util