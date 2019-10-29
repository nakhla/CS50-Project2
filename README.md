# Project 2

## Web Programming with Python and JavaScript
This Project is part of Harvard CS50W course provided by edx portal

## Try flack chat application on Heroku
### <https://flack-eg.herokuapp.com>

## Description
This project contains:
* __Display Name:__ when a user visit our application for the first time, we asked for his/her username, and if we the user closed the chat application for any reason, the username saved in the local storage and we will not ask him again and it will login automatically to the chat application.
* __Channel Creation:__ any user have the ability to create unlimited number of channels as long as the channel names do not conflict, and if it conflicts, a system message appeared inside the chat it self.
* __Channel List:__ public channel list displayed to all users, and selecting one make it active and remove the click event in the selected one, this action (click) will join this channel and leave the last selected channel.
* __Messages:__ the most recent 100 sent messages are saved per channel in server-side memory along with the sender name and the timestamp of the message, all users in the same channel can send and view their messages in the chat area.
* __Remembering the Channel:__ as in remembering Display name in local storage, our application can also remember the last selected channel, so in case of the user closed the browser, the application will take him to the last channel the user was on it. even more if the channel was deleted as in heroku hosting for inactivity as a result of resetting the application, the channel was created from the local storage.
* __Private Messaging:__ as an extra option, our chat application supports private messaging between two users.
  * __How it Works:__
    1.  Type this message ```/users``` in any channel room and send it.
    2.  A list of current connected users to chat application will appeared in the chat area.
    3.  Click the hyperlinked username that you want start chat with.
    4.  A new Tab will be created in light green color to differentiate it from public channel rooms.
    5.  Click the newly created tab and start chat.

![How it works](https://i.imgur.com/7a6jFrA.jpg)

## Setup yours
 ```bash
 # clone repo via git then create virtual environment on windows
 $ py -m venv env

 # activating the virtual environment
 $ .\env\Scripts\activate

 # install all dependencies packages
 $ pip install -r requirements.txt

 # env variables
 $ set FLASK_APP=application.py
 $ set FLASK_DEBUG=1

 # run flack chat application
 $ py application.py
 ```

## This Project by
[Magdi Nakhla](https://fb.me/nakhla)
