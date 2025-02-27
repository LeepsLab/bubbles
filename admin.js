  Redwood.controller("AdminCtrl", ["$rootScope", "$scope", "Admin", function($rootScope, $scope, ra) {

      var new_period = 2;
      var group_size = 2;

      //$('#current_group').html('<small>Current Group Size: ' + group_size + '</small>');

      var Display = { //Display controller

          initialize: function() {

              $("#start-session").click(function() {
                  $("#start-session").attr("disabled", "disabled");
                  ra.trigger("start_session");
              });

              ra.on("start_session", function() {
                  $("#start-session").attr("disabled", "disabled");
                  $("#pause-session").removeAttr("disabled");
              });

              $("#refresh-subjects").click(function() {
                  $("#refresh-subjects").attr("disabled", "disabled");
                  ra.refreshSubjects().then(function() {
                      $("#refresh-subjects").removeAttr("disabled");
                  });
              });

              $("#reset-session").click(function() {
                  ra.reset();
              });

              $("#pause-session").click(function() {
                  $("#pause-session").attr("disabled", "disabled");
                  ra.trigger("pause");
              });
              ra.on("pause", function() {
                  $("#pause-session").attr("disabled", "disabled");
              });

              $("#resume-session").click(function() {
                  $("#resume-session").attr("disabled", "disabled");
                  ra.trigger("resume");
              });
              ra.on("resume", function() {
                  $("#resume-session").attr("disabled", "disabled");
                  $("#pause-session").removeAttr("disabled");
              });

              ra.on_subject_paused(function(userId) {
                  $("#pause-session").attr("disabled", "disabled");
                  $("tr.subject-" + userId).addClass("warning"); //Display current period for each user
                  $("tr.subject-" + userId + " :nth-child(4)").text("Paused"); //Display current period for each user
              });

              ra.on_all_paused(function() {
                  $("#resume-session").removeAttr("disabled");
              });

              ra.on_subject_resumed(function(user) {
                  $("tr.subject-" + user).removeClass("warning"); //Display current period for each user
                  $("tr.subject-" + user + " :nth-child(4)").text(""); //Display current period for each user
              });

              $("#archive").click(function() {
                  var r = confirm("Are you sure you want to archive this session?");
                  if (r == true) {
                      ra.delete_session();
                  }
              });

              ra.on_router_connected(function(connected) { //Display router connection status
                var status = $("#router-status");
                if (connected) {
                  status.text("Router Connected");
                  status.removeClass("alert-danger");
                  status.addClass("alert-success");
                } else {
                  status.text("Router Disconnected");
                  status.removeClass("alert-success");
                  status.addClass("alert-danger");
                }
              });

              ra.on_set_period(function(user, period) {
                  $("tr.subject-" + user + " :nth-child(3)").text(period); //Display current period for each user
              });

              ra.on_set_group(function(user, group) {
                  $("tr.subject-" + user + " :nth-child(2)").text(group); //Display group for each user
              });

              ra.on_register(function(user) { //Add a row to the table to each user
                  $("#subject-list").empty();
                  for (var i = 0, l = ra.subjects.length; i < l; i++) {
                      $("#subject-list").append($("<tr>").addClass("subject-" + ra.subjects[i].user_id).append(
                          $("<td>").text(ra.subjects[i].user_id).after(
                              $("<td>").text(0).after(
                                  $("<td>").text(0).after(
                                      $("<td>").text(""))))));
                  }
              });



              $("#set_period").click(function() {
                  if (new_period !== 0 && new_period !== undefined && new_period !== null && ra.subjects.length > 0) {
                      //do_lottery();
                      for (var i = 0, l = ra.subjects.length; i < l; i++) {
                          ra.set_period(new_period, ra.subjects[i].user_id);
                      }
                      ++new_period;
                  }
                  $("#set_period").html("Start Period: " + new_period);
              });

              $("#set_group_size").click(function() {
                  group_size = Number(document.getElementById('group_size').value);

                  if (group_size > 0 && group_size !== undefined && group_size !== null && !isNaN(group_size)) {
                      ra.trigger("do_lottery");
                  }
                  $('#current_group').html('<small>Current Group Size: ' + group_size + '</small>');

              });

              ra.on("do_lottery", function() {
                  setGroups = true;
                  var i = 0;
                  var tmp = [];

                  for (var i = 0, l = ra.subjects.length; i < l; i++) {
                      var subj = {};
                      subj.userid = ra.subjects[i].user_id;
                      subj.a = 0;
                      tmp.push(subj);
                  }


                  var curr_group = 1;
                  var count = 0;
                  while (count != tmp.length) {
                      var rand = Math.floor(Math.random() * (tmp.length));
                      if (tmp[rand].a === 0) {
                          tmp[rand].a = 1;

                          ra.set_group(curr_group, tmp[rand].userid);
                          count++;
                          if ((count % group_size === 0) && count !== 0) curr_group++;
                      }
                  }
              });


              ra.on_set_config(function(config) { //Display the config file
                  $("table.config").empty();
                  var a = $.csv.toArrays(config);
                  for (var i = 0; i < a.length; i++) {
                      var row = a[i];
                      var tr = $("<tr>");
                      for (var j = 0; j < row.length; j++) {
                          var cell = row[j];
                          var td = $((i == 0 ? "<th>" : "<td>")).text(cell);
                          tr.append(td);
                      }
                      $("table.config").append(tr);
                  }

              });



          }
      };

      var resetGroups = function() {
          var config = ra.get_config(1, 0) || {};
          for (var i = 0; i < ra.subjects.length; i++) { //set all subjects to group 1 (this is so that matching can be changed per period)
              if ($.isArray(config.groups)) {
                  for (var groupId = 0; groupId < config.groups.length; groupId++) {
                      if ($.isArray(config.groups[groupId])) {
                          var id = parseInt(ra.subjects[i].user_id);
                          if (config.groups[groupId].indexOf(parseInt(ra.subjects[i].user_id)) > -1) { //Nested group array
                              ra.set_group(groupId + 1, ra.subjects[i].user_id);
                          }
                      } else {
                          ra.set_group(1, ra.subjects[i].user_id);
                      }
                  }
              } else {
                  ra.set_group(1, ra.subjects[i].user_id);
              }
          }
      };



      Display.initialize();

      ra.on_load(function() {
          resetGroups(); //Assign groups to users
      });

      ra.on_register(function(user) { //Add a row to the table to each user
          resetGroups();
      });

      ra.on("start_session", function() {
          ra.start_session();
      });

      ra.on("pause", function() {
          ra.pause();
      });

      ra.on("resume", function() {
          ra.resume();
      });




  }]);