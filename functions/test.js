const should = require('chai').should() // do not remove, this is required
const regexUtil = require('./regexUtil')

describe('REGEXUTIL TESTS', () => {
    describe('NICKNAME TESTS', () => {
        it('should pass a nickname change with a valid nickname', done => {
            const output = regexUtil.checkNicknameChange(`/nick onepunchman`)
            output.should.be.true
            done()
        })
    
        it('should fail a nickname change with an invalid nickname', done => {
            const output = regexUtil.checkNicknameChange(`/nick onepunjfsofd 2 3 chman`)
            output.should.be.false
            done()
        })
    
        it('should fail a nickname change without the nick flag', done => {
            const output = regexUtil.checkNicknameChange(`nick onepunchman`)
            output.should.be.false
            done()
        })
    })

    describe('COLOR TESTS', () => {
        it('should pass a color change with a valid color', done => {
            const output = regexUtil.checkColorChange(`/nickcolor FFF3F3`)
            output.should.be.true
            done()
        })

        it('should pass a color change with a shorthand color', done => {
            const output = regexUtil.checkColorChange(`/nickcolor 3F3`)
            output.should.be.true
            done()
        })
    
        it('should fail a color change with an invalid color', done => {
            const output = regexUtil.checkColorChange(`/nickcolor FFFFFF#`)
            output.should.be.false
            done()
        })
    
        it('should fail a nickname change without the nick flag', done => {
            const output = regexUtil.checkColorChange(`nickcolor FFF`)
            output.should.be.false
            done()
        })
    })
})