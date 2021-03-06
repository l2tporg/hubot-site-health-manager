Helper = require('hubot-test-helper')
chai = require 'chai'

expect = chai.expect

helper = new Helper('../src/clinic.js')

describe 'clinic', ->
  beforeEach ->
    @room = helper.createRoom()

  afterEach ->
    @room.destroy()

#  it 'responds to she test', ->
#    @room.user.say('alice', '@hubot she test').then =>
#      expect(@room.messages).to.eql [
#        ['alice', '@hubot she test']
#        ['hubot', 'kokoni cronjob ga demasu']
#      ]
#  it 'responds to she restart cron', ->
#    @room.user.say('alice', '@hubot she restart cron').then =>
#      expect(@room.messages).to.eql [
#        ['alice', '@hubot she restart cron']
#        ['hubot', 'kokoni cronjob ga demasu']
#      ]
#  it 'responds to she test list', ->
#    @room.user.say('alice', '@hubot she test list').then =>
#      expect(@room.messages).to.eql [
#        ['alice', '@hubot she test list']
#        ['hubot', 'kokoni cronjob ga demasu']
#      ]
#  it 'responds to she test list crons', ->
#    @room.user.say('alice', '@hubot she test list crons').then =>
#      expect(@room.messages).to.eql [
#        ['alice', '@hubot she test list crons']
#        ['hubot', 'kokoni cronjob ga demasu']
#      ]
#
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
        ['hubot', "0 : 'http://yahoo.co.jp' 200"]
        ['hubot', "1 : 'http://google.co.jp' 200"]
      ]
##
#  it 'responds to she add', ->
#    @room.user.say('alice', '@hubot she add http://yahoo.co.jp 200').then =>
#      expect(@room.messages).to.eql [
#        ['alice', '@hubot she add http://yahoo.co.jp 200']
#        ['hubot', "Adding SUCCESS: 'http://yahoo.co.jp' 200"]
#      ]
#  it 'responds to she list', ->
#    @room.user.say('alice', '@hubot she ls').then =>
#      expect(@room.messages).to.eql [
#        ['alice', '@hubot she ls']
#        ['hubot', 'Getting ERROR: empty']
#      ]
#  it 'responds to she add', ->
#    @room.user.say('alice', '@hubot she add http://yahoo.co.jp 200').then =>
#      expect(@room.messages).to.eql [
#        ['alice', '@hubot she add http://yahoo.co.jp 200']
#        ['hubot', "Adding ERROR: 'http://yahoo.co.jp' already exist."]
#        ['hubot', "Adding ERROR: Unexpected Error"]
#      ]
#
#  it 'responds when she remove', ->
#    @room.user.say('alice', '@hubot she rm 0').then =>
#      expect(@room.messages).to.eql [
#        ['alice', '@hubot she rm 0']
#        ['hubot', '']
#      ]
#
#  it 'responds when she update', ->
#    @room.user.say('alice', '@hubot she ud 9 500').then =>
#      expect(@room.messages).to.eql [
#        ['alice', '@hubot she ud 9 500']
#        ['hubot', '']
#      ]

#  it 'hears orly', ->
#    @room.user.say('bob', 'just wanted to say orly').then =>
#      expect(@room.messages).to.eql [
#        ['bob', 'just wanted to say orly']
#        ['hubot', 'yarly']
#      ]
