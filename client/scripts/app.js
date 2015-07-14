// YOUR CODE HERE:
var app = {};

app.rooms = {};
app.friends = [];

app.init = function(){
    this.server = 'https://api.parse.com/1/classes/chatterbox';
    this.fetch();
    setInterval(this.fetch, 1000);
};

//SENDING MESSAGE
app.send = function (message) {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(message),
    success: function(data) {
      console.log('Success!');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.fetch = function () {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      packageAndDisplay(data);
    }
  });
};

app.clearMessages = function() {
    $('.message').empty();
};

//ADDING MESSAGE TO THE CHAT AREA USING APPEND
app.addMessage =  function(message){

  //first append the empty div to #chats and .message
  $('#chats').append('<div class="message"></div>');
  $('.message').append('<span class="username"></span>');
  $('.message').append('<span class="text"></span>');

  //fill in the text
  $('.username').text(message.username);
  $('.text').text(message.text);
};

//ADDING A NEW ROOM TO THE OPTION DROPDOWN
app.addRoom =  function(roomname){
    $('.rooms').append($('<option>', {
      value: roomname,
      text: roomname
    }));
};

//ADDING NEW FRIENDS TO LIST OF FRIEND
app.addFriend =  function(username){
  //first append the empty div
  $('.friendsList').append('<div class="friend"></div>');

  //fill in the value
  $('.friend').text(username);
};

//HANDLING SUBMIT, PRODUCTING MESSAGE OBJECT AND INVOKE SEND()
app.handleSubmit =  function(username, text, room){
  var newMsg = {
    username: username,
    text : text,
    roomname: room
  };
  this.send(newMsg);
};

var packageAndDisplay = function(data, userName){
  displayMessage(data, userName);
  displayRoom();
};


var displayMessage = function(data){
  if (data.results) {
  app.clearMessages();
  
  for(var i=0; i<data.results.length; i++){
      if (!app.rooms[data.results[i].roomname]) {
        app.rooms[data.results[i].roomname] = [];
      }

      app.rooms[data.results[i].roomname].push({
        username: data.results[i].username, 
        text: data.results[i].text
      });

      if(data.results[i].username) {
        $('.message').append('<div class="messageGroup"></div>');
        $('.messageGroup').last().append('<span class="username"></span>');
        $('.messageGroup').last().append('<span>: </span>');
        $('.messageGroup').last().append('<span class="text"></span>');
        $('.username').last().text(data.results[i].username);
        $('.text').last().text(data.results[i].text); 
      }
    }
  }
};

var displayRoom = function(){
  $('.rooms').children().remove();
  for (var room in app.rooms) {
    app.addRoom(room);
    $('.rooms').append('<option class="room"></option>');
    $('.room').last().text(room);
  }
}

$(document).ready(function() {

  app.init();
  $('#message').on('click', '.username', function(){
    console.log($(this).text());
    app.addFriend($(this).text());
  });

  $('.message').on('click', '.username', function(){
    var user = $(this).text();
    console.log(user);
    app.fetchUsername(user);
  });

  $('#send').on('submit', function(e){
    e.preventDefault();
    var roomValue = $('.rooms').val();
    
    if($('#room').val()){
      roomValue = $('#room').val();
      app.addRoom(roomValue);
    }

    app.handleSubmit(decodeURI(GetUrlValue('username')), $('#message').val(), roomValue);
    console.log("submitted");
    $('#name').val("");
    $('#message').val("");
    $('#room').val(""); 
  });

  app.fetchUsername = function (userName) {
    var params = encodeURI('order=createdAt&where={"username":"' + userName +'"}');
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      data : params,
      contentType: 'application/json',
      success: function (data) {
        packageAndDisplay(data);
      }
    });
  };
});

var GetUrlValue = function (VarSearch){
  var SearchString = window.location.search.substring(1);
  var VariableArray = SearchString.split('&');
  for(var i = 0; i < VariableArray.length; i++){
    var KeyValuePair = VariableArray[i].split('=');
    if(KeyValuePair[0] == VarSearch){
        return KeyValuePair[1];
    }
  }
}