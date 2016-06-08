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
    // $( ".todos" ).focus(function() {
    //   $(this).children().prop('readOnly', true);
    //
    //   });
    //maybe bind the keypress under a click event that toggles class.

    $('#create').keypress(function(e){
      //enter pressed ?
      if(e.which == 10 || e.which == 13) {
          console.log("the enter button works on...", this);
          var newTodo = $(this).val();
          console.log(newTodo);
            app.create({value: newTodo});
            $(this).val("");
            }
    })

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

    $('#clear').on('click', function(event) {
        event.preventDefault();
        console.log(this);
        var checkArr = $('.todos').children().toArray();
        var checks = checkArr.filter(function(e,i,a){
          return $(e).children().prop("checked") === true
        }).forEach(function(e,i,a){
          var todoId = $(e).data('id');
          app.delete(todoId);
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
        $('.todos').append(todoStr);
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
        console.log("what the heck", data);
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
    var tmpl = _.template(`<div class="check-to" data-id="<%= _id %>"><input type="checkbox" id="<%= _id %>"><input class="tofind" type="text" name="todo" readonly="true" ondblclick="this.readOnly='';" value="<%= value %>" data-id="<%= _id %>"></div>`);
    return tmpl(data)
  }
}
