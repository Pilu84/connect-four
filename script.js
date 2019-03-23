(function() {
    var currentPlayer = "player1";
    var menuActive = "1";
    var menu = $("#menu");
    var single = $(".single");
    var tourmnent = $(".tourment");
    var settings = $(".setting");
    var inputVal = "";
    var gameTyp = "";
    var score = "";
    var animLaunch = true;

    var player1Name = "";
    var player2Name = "";

    if (menuActive == 1) {
        menu.addClass("active");
        $("#blackbackground").css({
            "background-color": "rgba(0, 0, 0, 0.4)",
            "z-index": "0"
        });
    }

    menu.on("mousedown", function(e) {
        if ($(e.target).hasClass("single")) {
            var html =
                '<div class="singlemode"><h2>Please give the first player name!</h2><input type="text" value="" placeholder="Player1"><div class="button nameb"><p>Next</p></div></div>';

            tourmnent.addClass("inactive");
            settings.addClass("inactive");

            $(e.target)
                .parent()
                .html(html);

            var field = $("input").eq(0);
            field.on("input", function() {
                inputVal = this.value;
            });

            $(".nameb").on("mousedown", function(e) {
                player1Name = inputVal;
                var player1NameHtml = "<p>" + player1Name + "</p>";
                $(".player1color").html(player1NameHtml);

                var htmlPlayer2 =
                    '<div class="singlemode"><h2>Please give second player name!</h2><input type="text" value="" placeholder="Player2"><div class="button nameb"><p>Start game!</p></div></div>';
                $(e.target)
                    .parent()
                    .html(htmlPlayer2);

                var field2 = $("input").eq(0);

                field2.on("input", function() {
                    inputVal = this.value;
                });

                $(".nameb").on("mousedown", function() {
                    player2Name = inputVal;
                    var player2NameHtml = "<p>" + player2Name + "</p>";
                    $(".player2color").html(player2NameHtml);
                    menu.removeClass("active");
                    // $(".win").removeClass("anim");
                    $("#blackbackground").css({
                        "background-color": "rgba(0, 0, 0, 0)",
                        "z-index": "-100"
                    });
                });
            });
        } else if ($(e.target).hasClass("tourment")) {
            html =
                '<div class="singlemode"><h2>Please give the first player name!</h2><input type="text" value="" placeholder="Player1"><div class="button nameb"><p>Next</p></div></div>';

            single.addClass("inactive");
            settings.addClass("inactive");

            $(e.target)
                .parent()
                .html(html);

            field = $("input").eq(0);
            field.on("input", function() {
                inputVal = this.value;
            });

            $(".nameb").on("mousedown", function(e) {
                player1Name = inputVal;
                var player1NameHtml = "<p>" + player1Name + "</p>";
                $(".player1color").html(player1NameHtml);

                var htmlPlayer2 =
                    '<div class="singlemode"><h2>Please give second player name!</h2><input type="text" value="" placeholder="Player2"><div class="button nameb"><p>Start game!</p></div></div>';
                $(e.target)
                    .parent()
                    .html(htmlPlayer2);

                var field2 = $("input").eq(0);

                field2.on("input", function() {
                    inputVal = this.value;
                });

                $(".nameb").on("mousedown", function() {
                    player2Name = inputVal;
                    var player2NameHtml = "<p>" + player2Name + "</p>";
                    $(".player2color").html(player2NameHtml);
                    menu.removeClass("active");
                    $("#blackbackground").css({
                        "background-color": "rgba(0, 0, 0, 0)",
                        "z-index": "-100"
                    });
                });

                $.ajax({
                    url: "data.json",
                    method: "GET",
                    success: function(data) {
                        console.log(data);
                    }
                });

                var scoreHtmlPlayer1 =
                    '<div class="player1score"><h2>Your Current Score</h2><p></p></div>';
                var scoreHtmlPlayer2 =
                    '<div class="player2score"><h2>Your Current Score</h2><p></p></div>';

                $("#infoplayerleft").append(scoreHtmlPlayer1);
                $("#infoplayerright").append(scoreHtmlPlayer2);
            });
            //
        } else if ($(e.target).hasClass("setting")) {
            console.log(settings);
        }
    });

    $(".player1color").addClass("active");

    $(".column").on("mousedown", function(e) {
        var col = $(e.currentTarget);
        var slotsInColumn = col.find(".slot");
        var tarIndex = $(".slot").index($(e.target).parent());
        var anim = "";
        var place = "";
        if (currentPlayer == "player1") {
            anim = '<div class="player1hole"></div>';
            place = "player1hole";
        } else {
            anim = '<div class="player2hole"></div>';
            place = "player2hole";
        }

        for (var i = 5; i >= 0; i--) {
            if (
                !slotsInColumn.eq(i).hasClass("player1") &&
                !slotsInColumn.eq(i).hasClass("player2")
            ) {
                break;
            }
        }

        setTimeout(function() {
            slotsInColumn.eq(i).addClass(currentPlayer);

            var slotsInRow = $(".row" + i);

            if (checkForVictory(col, slotsInRow, tarIndex)) {
                win(currentPlayer);
            }

            switchPlayer();
        }, 500);

        slotsInColumn.append(anim);
        $("." + place).css({
            transform: "translateY(" + slotsInColumn.eq(i).offset().top + "px)",
            transition: "transform linear 0.5s"
        });
        slotsInColumn.on("transitionend", function() {
            $("." + place).css({
                visibility: "hidden"
            });
            animLaunch = false;
        });
        return animLaunch;
        // }
    });

    function switchPlayer() {
        if (currentPlayer == "player1") {
            currentPlayer = "player2";
            $(".player1color").removeClass("active");
            $(".player2color").addClass("active");
        } else {
            currentPlayer = "player1";
            $(".player2color").removeClass("active");
            $(".player1color").addClass("active");
        }
    }

    function checkForVictory(col, slotsInRow, tarIndex) {
        var forCheck = [];
        var beginI = slotsInRow.index();
        var upIndex = 0;
        var downIndex = 0;
        var str = "";
        var step = 0;
        var end1,
            end2 = 0;

        for (var o = 0; o < 4; o++) {
            str = "";
            if (o == 0) {
                step = 5;
                end1 = 6;
                end2 = 1;
            } else if (o == 1) {
                step = -7;
                end1 = 6;
                end2 = 1;
            } else if (o == 2) {
                step = 6;
                end1 = 8;
                end2 = 1;
            } else if (o == 3) {
                step = -1;
                end1 = 6;
                end2 = 0;
            }

            forCheck = [];
            upIndex = tarIndex;
            downIndex = tarIndex;

            for (var j = beginI; j < end1; j++) {
                forCheck.push(downIndex);
                downIndex -= step;
            }
            for (var i = beginI; i > end2; i--) {
                upIndex += step;
                forCheck.push(upIndex);
            }
            for (var k = 0; k < forCheck.length; k++) {
                if (
                    $(".slot")
                        .eq(forCheck[k])
                        .hasClass(currentPlayer)
                ) {
                    str += "v";
                }
                if (str.indexOf("vvvv") > -1) {
                    return true;
                }
            }
        }
    }

    function win(currentPlayer) {
        var playerName;

        if (currentPlayer == "player1") {
            playerName = player1Name;
        } else {
            playerName = player2Name;
        }

        if (gameTyp == "tourment") {
            score += 100;
        }

        $(".win").addClass("anim");
        $("#blackbackground").css({
            "background-color": "rgba(0, 0, 0, 0.4)",
            "z-index": "0"
        });

        $("#playername").append("<p>" + playerName + "</p>");
        $("#playername").append('<img src="index.jpg" width="350px">');

        $("#newgamebutton").on("mousedown", function() {
            for (var i = 0; i < $(".player1").length; i++) {
                $(".player1").removeClass("player1");
            }

            for (var j = 0; j < $(".player2").length; j++) {
                $(".player2").removeClass("player2");
            }
            menuActive = 0;
            $(".win").removeClass("anim");
            $("#blackbackground").css({
                "background-color": "rgba(0, 0, 0, 0)",
                "z-index": "-100"
            });
        });
    }
})();
