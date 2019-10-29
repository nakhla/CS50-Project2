import os
from flask import Flask, jsonify, render_template, request, url_for
from flask_socketio import SocketIO, emit, send, join_room, leave_room
from collections import deque
from datetime import datetime

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

maxSavedMessages = 100
users = {}
mainchannel = 'main channel'
channels = {mainchannel: deque([], maxlen=maxSavedMessages)}
channelsPrivate = {}

@app.route("/")
def index():
    return render_template("index.html")


@socketio.on("new user")
def newuser(data):
    users[data] = request.sid
    print('username added!')
    print(users)


@socketio.on("default channel")
def defaultchannel(data):
    #print('channelname: ' + data)
    for channel in channels.keys():
        emit('add channel', channel)
    TempChannel = mainchannel # Defaulting the TempChannel by Main Channel in Case the Local Storage is Empty
    if data in channels.keys():
        TempChannel = data #if localstorage Channel is in App's Channels global variable
    elif data != '':
        TempChannel = data #if localstorage Channel is NOT in App's Channels global variable and the LocalStorage having a value
        channels[data] = deque([], maxlen=maxSavedMessages)
        emit('add channel', data, broadcast=True)
    emit('defaultChannelSuccess', TempChannel)
    print(channels)


@socketio.on("new channel")
def newchannel(data):
    print('channelname: ' + data)
    if data not in channels.keys():
       channels[data] = deque([], maxlen=maxSavedMessages)
       emit('add channel', data, broadcast=True)
    else:
        emit('systemmessage', 'there is already a channel with the same name ' + data)
    print(channels)


@socketio.on("new private channel")
def newprivatechannel(data):
    pmUser = data["pmUser"]
    currentUserName = data["currentUserName"]
    print('channelname: ' + pmUser)
    newPMChannelName = pmUser + "_" + currentUserName
    receiversid = users[pmUser]
    if newPMChannelName not in channelsPrivate.keys():
        channelsPrivate[newPMChannelName] = deque([], maxlen=maxSavedMessages)
        join_room(receiversid)
        emit('add private channel', newPMChannelName, room = receiversid )
        leave_room(receiversid)
    else:
        emit('systemmessage', 'there is already a channel with the same name ' + data)
    print(channelsPrivate)


@socketio.on("join")
def on_join(data):
    username = data['username']
    room = data['channel']
    lastRoom = data['lastchannel']
    isPrivate = data['isPrivate']
    if lastRoom != '':
        leave_room(lastRoom)
        emit('systemmessage', username + ' has left the room.', room=lastRoom)
    join_room(room)
    emit('systemmessage', username + ' has entered the room.', room=room)
    if isPrivate == '0' : #Public Channel Room
        emit('bunchofmessages', list(channels[room]))
    else : #Private Channel Room
        emit('bunchofmessages', list(channelsPrivate[room]))


@socketio.on("messageSent")
def on_messageSent(data):
    msg = data['msg']
    room = data['channel']
    now = datetime.now()
    data['sent_at'] = now.strftime("%m/%d/%Y, %H:%M:%S")

    if msg == "/users":
        emit('users_links', list(users))
    else :  #msg != "/users"
        emit('message', data , room=room)
        if  room in channels.keys():
            channels[room].append(data)
        if  room in channelsPrivate.keys():
            channelsPrivate[room].append(data)


if __name__ == '__main__':
    socketio.run(app)
