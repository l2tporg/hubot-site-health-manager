Helper = require('hubot-test-helper')
chai = require 'chai'

expect = chai.expect

helper = new Helper('../src/clinic.js')

describe 'clinic', ->
  beforeEach ->
    @room = helper.createRoom()

  afterEach ->
    @room.destroy()

#  it 'responds to she ex with d', ->
#    @room.user.say('alice', '@hubot she examine with doctor').then =>
#      expect(@room.messages).to.eql [
#        ['alice', '@hubot she examine with doctor']
#        ['hubot', 'added 0: http://yahoo.co.jp, 200']
#      ]

  it 'responds to she list', ->
    @room.user.say('alice', '@hubot she ls').then =>
      expect(@room.messages).to.eql [
        ['alice', '@hubot she ls']
        ['hubot', "0 : 'https://developer.ce/Global_Objects/Array/map' 200"]
        ['hubot', "1 : 'http://go.com' 200"]
        ['hubot', "2 : 'http://yahoo.co.jp' 200"]
      ]
#
  it 'responds to she add', ->
    @room.user.say('alice', '@hubot she add http://yahoo.co.jp 200').then =>
      expect(@room.messages).to.eql [
        ['alice', '@hubot she add http://yahoo.co.jp 200']
        ['hubot', "Adding ERROR: 'http://yahoo.co.jp' already exist."]
        ['hubot', "Adding ERROR: Unexpected Error"]
      ]
#
  it 'responds when she remove', ->
    @room.user.say('alice', '@hubot she rm 9').then =>
      expect(@room.messages).to.eql [

        ['alice', '@hubot she rm 9']
        ['hubot', '']
      ]

  it 'responds when she update', ->
    @room.user.say('alice', '@hubot she ud 9 500').then =>
      expect(@room.messages).to.eql [
        ['alice', '@hubot she ud 9 500']
        ['hubot', '']
      ]

#  it 'hears orly', ->
#    @room.user.say('bob', 'just wanted to say orly').then =>
#      expect(@room.messages).to.eql [
#        ['bob', 'just wanted to say orly']
#        ['hubot', 'yarly']
#      ]
