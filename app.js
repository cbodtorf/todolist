$(document).ready(function(){
  app.init();
})

var app = {
  url: "http://tiny-tiny.herokuapp.com/collections/whatitdo-cab",
  todos: [],
  init: function(){
    app.styles();
    app.events();
  },
  styles: function(){
    app.read();
  },
  events: function(){

// CREATE NEW TODO BY HITTING ENTER.


    $('#create').keypress(function(e){
      //enter pressed ?
      if(e.which == 10 || e.which == 13) {
          console.log("the enter button works on...", $('input').siblings());
          var newTodo = $(this).val();
          console.log(newTodo);
            app.create({value: newTodo, check:" "});
            $(this).val("");
            }
    })

// EDIT EXISTING TODO LIST ITEM

    $('form').keypress("input[type=text]", function(e){
      //enter pressed ?
      if(e.which == 10 || e.which == 13) {
          var $thisCheck = $(":input:not([readonly])");
          var thisEl = $thisCheck.filter(function(i,e,a){
            return $(e).hasClass('tofind');
            }).each(function(i,e,a){
              var obj = {
                id: $(e).data('id'),
                value: $(e).val()
              }
              console.log(obj);
              app.update({value: obj.value, _id: obj.id});
              })
            }
    })
// CHANGE CHECKBOX STATE FOR COMPLETED TASK

$("form").on('click', ".check-circle", function(){
   var $this = $(this);
   var $text = $this.text();
   var cirId = $this.data('id');
   console.log(cirId);
   if ($text === " ") {
      console.log(this,"on");
      $this.text('✓');
      var $check = $this.text();
      console.log($check);
      app.update({check: $check, _id: cirId })
   } else {
      console.log(this,"off");
      $this.text(' ');
      var $check = $this.text();
      app.update({check: $check, _id: cirId })
   }
});

//DELETE COMPLETED ITEMS

    $('#clear').on('click', function(event) {
        event.preventDefault();
        var checkArr = $('.todos').children().toArray();
        console.log("array bay",checkArr);
        var checks = checkArr.filter(function(e,i,a){
          var $checked = $(e).children();
          return $checked.text() === "✓" ;
        }).forEach(function(e,i,a){
          var todoId = $(e).data('id');
          app.delete(todoId);
        })
    })

    // ALL
    $('.all').on('click', function(event){
      event.preventDefault();
      app.read();
    })

    // ACTIVE
    $('.active').on('click', function(event){
      event.preventDefault();
      $.ajax({
        url: app.url,
        method: "GET",
        success: function(data) {
          $("form").html("");
          console.log(data.check);
          data.filter(function(e,i,a){
            return e.check === " ";
          }).forEach(function(e,i,a){
            var todoStr = app.todoGenerator(e);
            $('.todos').append(todoStr);
            app.todos.push(e);
          })
        },
        error: function(){
          console.error("dang son!");
        }
      })
    })

    // COMPLETED
    $('.completed').on('click', function(event){
      event.preventDefault();
      $.ajax({
        url: app.url,
        method: "GET",
        success: function(data) {
          $("form").html("");
          console.log(data.check);
          data.filter(function(e,i,a){
            return e.check === "✓";
          }).forEach(function(e,i,a){
            var todoStr = app.todoGenerator(e);
            $('.todos').append(todoStr);
            app.todos.push(e);
          })
        },
        error: function(){
          console.error("dang son!");
        }
      })
    })
  },
  create: function(todos){
    $.ajax({
      url: app.url,
      data: todos,
      method:"POST",
      success: function(data){
        console.log("hey hey create", data);
        var todoStr = app.todoGenerator(data);
        $('.todos').prepend(todoStr);
        app.read();
      },
      error: function(){
        console.error("dang son!")
      }
    })
  },
  read: function(){
    $.ajax({
      url: app.url,
      method:"GET",
      success: function(data){
        console.log("hey hey get", data);
        $("form").html("");
        var num = data.length;
        $('.numLeft').text(num + " items left")
        data.forEach(function(e,i,a){
          var todoStr = app.todoGenerator(e);
          $('.todos').append(todoStr);
          app.todos.push(e);
        })
      },
      error: function(){
        console.error("dang son!")
      }
    })
  },
  update: function(todos){
    $.ajax({
      url: app.url + "/" + todos._id,
      data: todos,
      method:"PUT",
      success: function(data){
        console.log("update baby", data);
        var todoStr = app.todoGenerator(data);
        app.read();

      },
      error: function(data){
        console.error("dang son!")
      }
    })
  },
  delete: function(todoId){
    // find blog to delete from our blog data;
    var deleteUrl = app.url + "/" + todoId;
    $.ajax({
      url: deleteUrl,
      method:"DELETE",
      success: function(data){
        console.log("WE DELETED SOMETHING", data);
        app.read();

      },
      error: function(){
        console.error("dang son!")
      }
    })
  },
  todoGenerator: function (data){
    var tmpl = _.template(`<div class="check-to" data-id="<%= _id %>">
    <div class="check-circle" data-id="<%= _id %>"><%= check %></div>
    <input class="tofind" type="text" name="todo" readonly="true" ondblclick="this.readOnly='';" value="<%= value %>" data-id="<%= _id %>">
    </div>`);
    return tmpl(data)
  }
}
