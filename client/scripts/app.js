// // YOUR CODE HERE:

var app = {
  rooms : {},
  friends : [],
  // user : window.location.search.slice(10);
  user : window.location.search.slice(10),
};

app.server = 'https://api.parse.com/1/classes/chatterbox';



app.init = function(){
  $('#main').find('.username').on('click', function(){
      app.addFriend(this.innerHTML);
  }); 


};

app.handleSubmit = function(message){
    this.send(message);
};


app.clearMessages = function(){
  $('#chats').empty();
};

app.addMessage = function(message){
  var room = message.room;
  var text = message.text;
  var username = message.username;
  
  $('#chats').append(
    '<div class = "messagebox">'
    + '<p class = "username">' 
    + username + '</p>' 
    + '<p class = "message">' 
    + text + '</p>' 
    + '</div>');
  // $('#chats').append('<div class = "message" "' + username +'">' + username + ': ' + text + '</div>');

  //mesage = <div class = "username " class = "room" some text </div>
};

app.addRoom = function(roomName){
  $('#roomSelect').append('<div>' + roomName + '</div>');
};


app.addFriend = function(username){
  app.friends.push(username);
};

app.send = function(message){
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message Sent');
    }
    // },
    // error: function (data) {
    //   // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    //   console.error('chatterbox: Failed to send message');
    // }
  });
};

app.fetch = function(room){
    var parameters = encodeURI('order: -createdAt');
    var filter = encodeURI('where={"roomname":"' + room + '"}');

    if(room !== undefined){
      var parameters = parameters + '&' + filter;
    }

    $.ajax({
        url: 'https://api.parse.com/1/classes/chatterbox',
        type: 'GET',
        data : parameters,
        contentType: 'application/json',
        success: function (){
          app.displayData(responsedata);
        }
        // },
        // error: function (data) {
        //   // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        //   console.error('chatterbox: Failed to receive message');
        // }
    });
};

// $("#usermsg").click(function(){
//   var message = {
//     username: ,
//     text: $('usermsg').text(),
//     roomname: 
//   }
//   $("#submitmsg").click(sendMsg(message)        
//     $("#usermsg").attr("value", "");
//   });
// });



var messageObj = {
  username : $('.username').text(),
  text : $('#messages').text(),
  roomname : $(".roomSelect").text()
}



$(document).ready(function(){
  app.init();

  $("#submit").click(app.send(messageObj));

  $('#main').find('.username').on('click', function(){
      app.addFriend(this.innerHTML);
  }); 

  $('#send .submit').on('submit', function(e){
    e.preventDefault();
    var newMessage = {
      username: app.user,
      text: $('#messages').val(),
      roomname: 'lobby'
    };

    app.handleSubmit(newMessage);
  });
})


// app.displayData = function(responsedata){
//   var message = responsedata.results;
//   for(var i = 0; i < message.length; i++){
//     var roomname = message[i]['roomname'];
//     if(roomname === '' || roomname === undefined || roomname === null){
//           roomname = 'lobby';
//           if(app.rooms.hasOwnProperty(roomname)){
//             app.rooms[roomname].unshift({username : message[i]['username'] , 
//                                          text : message[i]['text'], 
//                                          createdAt : message[i]['createdAt'], 
//                                          objectID : message[i]['objectId']
//                                          });
//           }else{
//             app.rooms[roomname] = {username : message[i]['username'] , 
//                                          text : message[i]['text'], 
//                                          createdAt : message[i]['createdAt'], 
//                                          objectID : message[i]['objectId']
//                                          };
//           }
//     }else{
//           if(app.rooms.hasOwnProperty(roomname)){
//             app.rooms[roomname].unshift({username : message[i]['username'] , 
//                                          text : message[i]['text'], 
//                                          createdAt : message[i]['createdAt'], 
//                                          objectID : message[i]['objectId']
//                                          });
//           }else{
//             app.rooms[roomname] = {username : message[i]['username'] , 
//                                          text : message[i]['text'], 
//                                          createdAt : message[i]['createdAt'], 
//                                          objectID : message[i]['objectId']
//                                          };
//           }
//     }
//   }
//   app.addRoom();
//   app.init();
// };
