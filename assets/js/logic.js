$(document).ready(function () {

    const trivia = {
        questions: [{
            name: "If I am moving at 0.5c where c is the speed of light, how fast do i measure the speed of light?", q1: "c", q2: "0.5c", q3: "0.25c", q4: "Cannot be calculated", ans: "a", gifSearch: "lightspeed", hint: "b"
        }, {
            name: "What two things does Heisenbergs Uncertainty Pricnciple say cannot both be measured exactly, at the same time?", q1: "Weight and speed", q2: "Acceleration and mass", q3: "Position and velocity", q4: "Spin and intensity", ans: "c", gifSearch: "uncertainty", hint: "b"
        }, {
            name: "What can escape a black hole's gravitational pull?", q1: "Sound", q2: "Nothing", q3: "Light", q4: "Particles", ans: "b", gifSearch: "black+hole", hint: "d"
        }, {
            name: "Which one of these is not a quark name?", q1: "Up", q2: "Charm", q3: "Strange", q4: "Common", ans: "d", gifSearch: "quark+particle", hint: "a"
        }, {
            name: "How much resistance (in Ohms) does a (dry) human have?", q1: "10 ohms", q2: "4,000 ohms", q3: "50,000 ohms", q4: "100,000 ohms", ans: "d", gifSearch: "ohm+resistance", hint: "a"
        }, {
            name: "What element are we made of primarily?", q1: "Sulfur", q2: "Carbon", q3: "Oxygen", q4: "Hydrogen", ans: "c", gifSearch: "oxygen+element", hint: "b"
        }, {
            name: "How many colors are there in the spectrum when white light is separated?", q1: "7", q2: "9", q3: "5", q4: "8", ans: "a", gifSearch: "prism+rainbow", hint: "d"
        }, {
            name: "At what temperature does Fahrenheit equal Celcius?", q1: "42", q2: "100", q3: "-40", q4: "0", ans: "c", gifSearch: "thermometer", hint: "a"
        }, {
            name: "What has the highest frequency?", q1: "Gamma rays", q2: "Ultraviolet", q3: "Infrared", q4: "Radio Waves", ans: "a", gifSearch: "gamma+rays", hint: "b"
        }, {
            name: "If your twin left on a rocket at birth near the speed of light then came back 10 years later, has their age changed in relation to yours?", q1: "Yes, older", q2: "No", q3: "Yes, younger", q4: "Cannot be known", ans: "c", gifSearch: "twins", hint: "b"
        }],
        timeThirty: 30,
        qInterval: 0,
        questionNum: 0,
        right: 0,
        wrong: 0,
        unaswered: 0,
        game: function () {
            const trivQ = trivia.question.bind(this);
            const trivG = trivia.gifImage.bind(this);

            $("#startGame").on("click", function (e) {
                $("#questionDiv").removeClass("d-none");
                trivQ();
                $("#startInfo").addClass("d-none");
            });
            $(".nextQuestion").on("click", function (e) {
                $(`#${trivia.questions[trivia.questionNum].hint}`).removeClass("disabled");
                if ($(this).attr("id") === trivia.questions[trivia.questionNum].ans) {
                    trivia.right++;
                    trivG("y");
                }
                else {
                    trivia.wrong++;
                    trivG("n");
                }
                trivia.questionNum++;
                setTimeout(trivQ, 5000);
            });
            $("#restartGame").on("click", function (e) {
                $("#restartGame").addClass("d-none");
                trivia.resetGame();
            });
        },
        question: function () {
            $("#gif").empty();
            $("#response").empty();
            if (this.questionNum === this.questions.length) {
                const gO = this.gameOver.bind(this);
                clearInterval(this.qInterval);
                gO();
            }
            else {
                $("#timeBar").attr("style", `width: 100%`).removeClass("bg-danger").addClass("bg-success");
                $("#questionDiv").removeClass("d-none");
                $("#questionTitle").text(this.questions[this.questionNum].name);
                $("#a").text(this.questions[this.questionNum].q1);
                $("#b").text(this.questions[this.questionNum].q2);
                $("#c").text(this.questions[this.questionNum].q3);
                $("#d").text(this.questions[this.questionNum].q4);
                clearInterval(this.qInterval);
                this.timeThirty = 30;
                this.qInterval = setInterval(this.thirtyCountDisplay.bind(this), 1000);
            }
        },
        //function to run for the question timer
        thirtyCountDisplay: function () {
            this.timeThirty--;
            const percent = this.timeThirty / 30 * 100;
            $("#timeBar").attr("style", `width: ${percent}%`);
            if (this.timeThirty === 15) {
                $("#timeBar").removeClass("bg-success").addClass("bg-danger");
            }
            if (this.timeThirty === 10) {
                this.hint();
            }
            this.checkTimeout();
        },
        checkTimeout: function () {
            if (this.timeThirty === 0) {
                clearInterval(this.qInterval);
                this.unaswered++;
                this.gifImage("t");
                let trivQ = this.question.bind(this);
                setTimeout(trivQ, 5000);
                $(`#${this.questions[this.questionNum].hint}`).removeClass("disabled");
                this.questionNum++;
            }
        },
        gifImage: function (check) {
            $("#questionDiv").addClass("d-none");
            switch (check) {
                case "y":
                    $("#response").text(`Correct!`);
                    break;
                case "n":
                    $("#response").text(`Wrong! The correct answer was ${$("#" + this.questions[this.questionNum].ans).text()}`);
                    break;
                case "t":
                    $("#response").text(`Ooh, time is up! The correct answer is ${$("#" + this.questions[this.questionNum].ans).text()}`);
                    break;
            }
            // Here we construct our URL for ajax call
            let queryURL = `https://api.giphy.com/v1/gifs/search?q=${this.questions[this.questionNum].gifSearch}&api_key=EQQpWAWmSCs1ZQB5CW7mD0dV9HCPnuYh&limit=1&rating=g`;
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                // //this puts the image url from the api into the image tag src
                $("#gif").html($("<img>").attr("src", response.data[0].images.fixed_height.url));
                return null
            })

        },
        gameOver: function () {
            const list = $("<div>").addClass("text-center");
            const listWin = $("<p>").text(`Correct answers: ${this.right}`);
            const listLoss = $("<p>").text(`Incorrect answers: ${this.wrong}`);
            const listUnans = $("<p>").text(`Unanswered: ${this.unaswered}`);
            list.append(listWin, listLoss, listUnans);
            $("#restartGame").removeClass("d-none");
            $("#finalScores").append(list);
        },
        resetGame: function () {
            const trivQ =  this.question.bind(this);
            this.questionNum = 0;
            this.right = 0;
            this.timeThirty = 30;
            this.unaswered = 0;
            this.wrong = 0;
            $("#finalScores").empty();
            trivQ();
        },
        hint: function () {
            $(`#${this.questions[this.questionNum].hint}`).addClass("disabled");

        }

    }

    trivia.game();

});