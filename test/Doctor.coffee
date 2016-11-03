Helper = require('hubot-test-helper')
chai = require 'chai'

expect = chai.expect

helper = new Helper('../src/Doctor.js')

describe 'Doctor', ->
  beforeEach ->
    @room = helper.createRoom()

  afterEach ->
    @room.destroy()

#  it 'responds to she ls', ->
#    @room.user.say('alice', '@hubot she ls').then =>
#      expect(@room.messages).to.eql [
#        ['alice', '@hubot she ls']
#        ['hubot', 'empty']
#      ]
#
#  it 'responds to she add she ls', ->
#    @room.user.say('alice', '@hubot she add http://yahoo.co.jp 200').then =>
#      expect(@room.messages).to.eql [
#        ['alice', '@hubot she add http://yahoo.co.jp 200']
#        ['hubot', 'added 0: http://yahoo.co.jp, 200']
#      ]


#  it 'responds when she ls with emptying', ->
#    @room.user.say('alice', '@hubot she ex').then =>
#      expect(@room.messages).to.eql [
#        ['alice', '@hubot she ex']
#        ['hubot', '']
#      ]

#  it 'hears orly', ->
#    @room.user.say('bob', 'just wanted to say orly').then =>
#      expect(@room.messages).to.eql [
#        ['bob', 'just wanted to say orly']
#        ['hubot', 'yarly']
#      ]
