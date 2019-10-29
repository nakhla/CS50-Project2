document.addEventListener('DOMContentLoaded', () => {

      var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port)
      var currentUserName;
      var currentChannel;
      var pmchannel;

            // By default, send and create buttons are disabled
            document.querySelector('#send').disabled = true;
            document.querySelector('#create').disabled = true;
            // Enable buttons only if there are text in their input fields
            document.querySelector('#mymessage').oninput = () => {
                if (document.querySelector('#mymessage').value.length > 0)
                    document.querySelector('#send').disabled = false;
                else
                    document.querySelector('#send').disabled = true;
            }

            document.querySelector('#channel').oninput = () => {
                if (document.querySelector('#channel').value.length > 0)
                    document.querySelector('#create').disabled = false;
                else
                    document.querySelector('#create').disabled = true;
            }


      socket.on('connect', () => {
      		//socket.send('user has connected')
      		//console.log('user has connected')
          if (localStorage.getItem('username')){
            document.querySelector('#username').value = localStorage.getItem('username');
            document.querySelector('#login').click();
          }
      })


      socket.on('message', (data) => {
          renderMessage(data);
      })
      socket.on('bunchofmessages', (dataList) => {
          for (i = 0; i < dataList.length; i++ ){
              renderMessage(dataList[i]);
            }
      })

      socket.on('systemmessage', (data) => {

        const div = document.createElement('div')
        div.setAttribute('class', 'alert alert-warning');
        div.innerHTML = data;
        document.querySelector('#chat').append(div)
        var elem = document.getElementById('chat');
        elem.scrollTop = elem.scrollHeight;
        console.log('systemmessage received')
      })

      socket.on('users_links', (data) => {

        const div = document.createElement('div')
        div.setAttribute('class', 'alert alert-warning');
        let users_hyperlinked ="| "
        for (i=0; i<data.length; i++){
          users_hyperlinked += '<a href="#" onclick="pm(\'' + data[i] + '\', \'' + currentUserName + '\');" id="usr_' + data[i] +'">' + data[i] + '</a> |'
        }
        div.innerHTML = users_hyperlinked;
        document.querySelector('#chat').append(div)
        var elem = document.getElementById('chat');
        elem.scrollTop = elem.scrollHeight;
        console.log('systemmessage received')
      })

      socket.on('defaultChannelSuccess', (chnl) =>{
        currentChannel = chnl;
        let currentChannelFormatted = currentChannel.replace(/ /g, '_');
        document.querySelector('#li_' + currentChannelFormatted).click();
      })

      socket.on('add channel', (chnl) =>{
        let currentChannelFormatted = chnl.replace(/ /g, '_');
        var li = document.createElement('li')
        li.setAttribute('class', 'list-group-item channel');
        li.setAttribute('id', 'li_' + currentChannelFormatted);
        li.innerHTML = chnl;
        document.querySelector('#channels').append(li);
        var elem = document.getElementById('channels');
        elem.scrollTop = elem.scrollHeight;
        console.log(chnl + ' channel added')



        document.querySelector('#li_' + currentChannelFormatted).onclick = function() {


            let currentChannelFormatted = currentChannel.replace(/ /g, '_');
            document.querySelector('#li_' + currentChannelFormatted).classList.remove('active')
            this.classList.add('active');
            document.querySelector('#chat').innerHTML = "";

            document.querySelector('#li_' + currentChannelFormatted).style.pointerEvents = 'auto';
            this.style.pointerEvents = 'none';

            let lastChannel = currentChannel;
            currentChannel =  this.innerHTML;


            localStorage.setItem('LastSelectedChannel' , currentChannel)
            socket.emit('join', { 'channel': currentChannel , 'username': currentUserName , 'lastchannel': lastChannel, 'isPrivate': '0'});


          }
      })



      document.querySelector('#send').onclick = () =>{
        const message = document.querySelector('#mymessage').value;
        socket.emit('messageSent', { 'channel': currentChannel , 'msg': message, 'sender': currentUserName });
        document.querySelector('#mymessage').value = '';
        document.querySelector('#mymessage').focus();
        document.querySelector('#send').disabled = true;
        console.log('message sent')
        return false;
      }

      document.querySelector('#login').onclick = () =>{
        const username = document.querySelector('#username').value;
        if (!localStorage.getItem('username'))
          localStorage.setItem('username', username);
        currentUserName = username;
        socket.emit('new user', username)
        let currentChannelFromLocalStorage = '';
        if(localStorage.getItem('LastSelectedChannel')){
          currentChannelFromLocalStorage = localStorage.getItem('LastSelectedChannel');
        }
        socket.emit('default channel', currentChannelFromLocalStorage);
        document.querySelector('#userformarea').style.display = "none";
        document.querySelector('#messagearea').style.display = "flex";
        document.querySelector('#username').value = '';
        return false;
      }

      document.querySelector('#create').onclick = () =>{
        const channel = document.querySelector('#channel').value
        socket.emit('new channel', channel);
        document.querySelector('#channel').value = '';
        document.querySelector('#channel').focus();
        document.querySelector('#create').disabled = true;
        return false;
      }
///////////
      socket.on('add private channel', (chnl) =>{
        let currentChannelFormatted = chnl.replace(/ /g, '_');
        var li = document.createElement('li')
        li.setAttribute('class', 'list-group-item list-group-item-success channel');
        li.setAttribute('id', 'li_' + currentChannelFormatted);
        li.innerHTML = chnl;
        document.querySelector('#channels').append(li);
        var elem = document.getElementById('channels');
        elem.scrollTop = elem.scrollHeight;
        console.log(chnl + ' private channel added')



        document.querySelector('#li_' + currentChannelFormatted).onclick = function() {


            let currentChannelFormatted = currentChannel.replace(/ /g, '_');
            document.querySelector('#li_' + currentChannelFormatted).classList.remove('active')
            this.classList.add('active');
            document.querySelector('#chat').innerHTML = "";

            document.querySelector('#li_' + currentChannelFormatted).style.pointerEvents = 'auto';
            this.style.pointerEvents = 'none';

            let lastChannel = currentChannel;
            currentChannel =  this.innerHTML;



            //localStorage.setItem('LastSelectedChannel' , currentChannel)
            socket.emit('join', { 'channel': currentChannel , 'username': currentUserName , 'lastchannel': lastChannel , 'isPrivate': '1'});


          }
      })
///////////

})

function pm(pmchannel,currentUserName ) {
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port)
    const hyperlinkedhtml = document.querySelector('#usr_' + pmchannel).innerHTML
    //alert(hyperlinkedhtml)

    socket.emit('new private channel', {'pmUser': hyperlinkedhtml , 'currentUserName': currentUserName})
}

function renderMessage(data){

          const div = document.createElement('div')
          div.setAttribute('class', 'alert alert-success');
          div.innerHTML = `<strong>${data.sender}: </strong>${data.msg}<small class="text-muted d-flex justify-content-end">${data.sent_at}</small>`;
          document.querySelector('#chat').append(div)
          var elem = document.getElementById('chat');
          elem.scrollTop = elem.scrollHeight;
          console.log('message received')
}
