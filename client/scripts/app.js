
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
var app = {
  server: 'http://127.0.0.1:3000/',

  init: function() {
    app.friends = []; //only runs once vs a property on app directly
    this.fetch();
    window.setInterval(app.fetch, 10000);
    $(document).ready(function(){
       $("#main").on("click", ".username", function(){
         var $newFriend = $(this).find(".username").context.innerHTML;
         app.addFriend($newFriend);
       });

       $("#send").submit(function(event){
         var $pushMessage = $(this).find("#message").val();
         console.log($pushMessage);
         var $room = $(this).find("#roomname").val();
         console.log($room);
         var $newUser = $(this).find("#addUser").val();
         app.handleSubmit($pushMessage, $room, $newUser);
         event.stopImmediatePropagation(); //lookup
       });
       //submit handler for adding a new room-  using a common one
       //take values from text field and dropdown list? Try one at a time
       //var $pushRoom = $(this).find("#roomname").val();
       $("#roomSelect").on('change', function(){
          var currentRoom = $(this).val();
          console.log(currentRoom);
          //get the val hide everything else, show all messages (divs) for the val
          //alternative use Adam's .not selector
          console.log($("#chats > div").find('.'+currentRoom));
          $("#chats > div").not('.'+currentRoom).hide();


       })
    });
  },

  send: function(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data) {
        console.log('chatterbox: Message sent');
      },
      error: function(data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  fetch: function(message) {
    $.ajax({
      url: app.server,
      type: 'GET',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data) {
        app.clearMessages();
        for(var i=0; i< data.results.length; i++){
            app.addMessage(data.results[i]);
        }
      },
      error: function(data) {
        console.error('chatterbox: Failed to fetch message');
      }
    });
  },

// DOM MODIFICATIONS

  clearMessages: function() {
    $('#chats').children().remove();
  },

  addMessage: function(message) {

      //Add after the basic structure, if true just addClass to $text
    var $post = $('<div class = "post"> </div>');
    var $username = $('<div class = "username"> </div>').text(message.username);
    var $text = $('<div class = "text"> </div>').text(message.text);
    var $room = $('<div class = "roomname"></div>').text(message.roomname);
    //filter on roomname
    var newClass = message.roomname;
    $room.addClass(newClass);
    app.addRoom(message.roomname);

    $post.append($username,$text, $room);
      if (app.friends.indexOf(message.username) >= 0) {
      $text.addClass("friend");
      $('#chats').append($post);
    } else {
      $('#chats').append($post);
    }
  },

  addRoom: function(room) {
    $('#roomSelect').append('<option>' + room + '</option>');
    //this should take the value from submit form(handler) and add the room
    //just like add message
  },
  // friends: [],
  addFriend: function(friend) {
    app.friends.push(friend);
    console.log(app.friends);
  },

  handleSubmit: function(message,room, user) {
    var sanitize = function(string){
      return string ? string.replace(/</g, '&lt').replace(/>/g, '&gt') : undefined ; //does &lt work differently than < ?
    }
    var msg = {};
    msg.username = sanitize(user) || window.location.search.split("=")[1];
    msg.text = sanitize(message);
    msg.roomname = sanitize(room);

    app.send(msg);

  }
}

app.init();

/* console.log(data) returns -->
    {
       results: [
          { username: 'John Doe', text: 'Hello!', roomname: 'blah' },
          { username: 'Jenny Doe', text: 'Greetings!', roomname: 'blah blah' }
       ]
    }
*/

// one option: create rooms as objects, and add to DOM only the unique ones
/*$("#roomSelect option").each(function() {
      if($.inArray(message.roomname) === -1){
        app.addRoom(message.roomname);
      } */

