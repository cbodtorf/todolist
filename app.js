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

  },
  events: function(){
    $('input').keypress(function(e){
      //enter pressed ?
      if(e.which == 10 || e.which == 13) {
          console.log("the enter button works on...", this);
          console.log($(this).val());
            }
    })

  },
  create: function(){
    $.ajax({
      url: app.url,
      data: todos,
      method:"POST",
      success: function(data){
        console.log("hey hey create", data);
        var todoStr = app.todoGenerator(data);
        $('.todos').append(todoStr);
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
      success: function(){

      },
      error: function(){
        console.error("dang son!")
      }
    })
  },
  update: function(){
    $.ajax({
      url: app.url,
      data: todos,
      method:"PUT",
      success: function(){

      },
      error: function(){
        console.error("dang son!")
      }
    })
  },
  delete: function(){
    $.ajax({
      url: app.url,
      method:"DELETE",
      success: function(){

      },
      error: function(){
        console.error("dang son!")
      }
    })
  },
  todoGenerator: function (data){
    var tmpl = _.template(`<input type="text" name="todo" readonly="true" ondblclick="this.readOnly='';" value="<%= value %>" data-id="">`);
    return tmpl({value: data})
  }
}
