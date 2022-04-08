


document.addEventListener("DOMContentLoaded", () => {


    let dbleDiction = [];

    let dict = [];

    let myUrl = ['https://rocky-fjord-08212.herokuapp.com/https://www-cs-faculty.stanford.edu/~knuth/sgb-words.txt']

    async function fetchData() {
        return (fetch(myUrl[0])
            .then(response =>
                response.text().then(text => text.split(/\r|\n/))));
    }

    fetchData();

    const start = Promise.all(myUrl.map(fetchData)).then(results => {
        dbleDiction = results;
        dict.push(dbleDiction[0]);

    });
    //waiting until Promise is resolved, so that dict is complete//
    start.then(f => {
        createGrid();

        dict = dict[0];

        dict.pop();

        dict.push("trope");

        let guessedWordAcc = 0;

        let availSpace = 1;

        let myAcc = 0;

        const bestStarters = ["crane", "irate", "adieu", "canoe"];

        let startWord = bestStarters[Math.floor(Math.random() * bestStarters.length - 1)];

        function deleteWrong(guessed_string, gray_indices) {
            let oldList = gray_indices;
            if (oldList.length == 0) {
            } else {
                let index0 = gray_indices[0]
                let char = guessed_string[index0]
                let arr = []
                oldList.shift()
                for (let dict_index = 0; dict_index < dict.length; dict_index++) {
                    dict[dict_index].toLowerCase();
                    if ((dict[dict_index]).includes(char)) {
                        arr.push(dict[dict_index]);
                    }
                }
                for (let i = 0; i < arr.length; i++) {
                    dict.splice(dict.indexOf(arr[i]), 1);
                }
                deleteWrong(guessed_string, oldList);

            }
        }

        function hasLetterWrongSpot(guessed_string, yellow_indices) {
            let oldList = yellow_indices;
            if (oldList.length == 0) {
            } else {
                let index0 = yellow_indices[0]
                let char = guessed_string[index0]
                let arr = []
                oldList.shift()
                for (let dict_index = 0; dict_index < dict.length; dict_index++) {
                    dict[dict_index].toLowerCase();
                    if ((dict[dict_index]).includes(char)) {
                        if ((dict[dict_index])[index0] == guessed_string[index0]) {
                            arr.push(dict[dict_index]);
                        } else {
                        }
                    } else {
                        arr.push(dict[dict_index]);
                    }
                }
                for (let i = 0; i < arr.length; i++) {
                    dict.splice(dict.indexOf(arr[i]), 1);
                }
                hasLetterWrongSpot(guessed_string, oldList);
            }
        }

        function letterRightSpot(guessed_string, green_indices) {
            let oldList = green_indices;
            if (oldList.length == 0) {
            } else {
                let index0 = green_indices[0]
                let arr = [];
                oldList.shift()
                for (let dict_index = 0; dict_index < dict.length; dict_index++) {
                    dict[dict_index].toLowerCase();
                    if ((dict[dict_index])[index0] == guessed_string[index0]) {

                    } else {
                        arr.push(dict[dict_index]);
                    }
                }

                for (let i = 0; i < arr.length; i++) {
                    dict.splice(dict.indexOf(arr[i]), 1);
                }
                letterRightSpot(guessed_string, oldList);
            }
        }


        let guessedWord = [[]]

        function randWordReturn() {
            if (dict.length == 1) {
                return dict[0];
            } else {
                let randWord = dict[Math.floor(Math.random() * (dict.length - 1))];
                return (randWord);
            }
        }

        var word;

        function swalStart() {
            Swal.fire({
                title: "Please input your word",
                input: 'text',
                inputAttributes: {
                    autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'Enter',

                showLoaderOnConfirm: true,
                preConfirm: function (text) {
                    if (text.length != 5 || (dict.includes(text) === false)) {
                        swal.showValidationError("Invalid Word!")
                    } else {
                        return text;
                    }
                },
                allowOutsideClick: false
            }).then(function (text) {
                if (text.dismiss !== 'cancel') {
                    let print = Object.values(text);
                    startWord = print[3];
                    word = randWordReturn();
                    //ALLOW FOR CHOICE OF RANDOM/CHOSEN FINAL WORD
                    Swal.fire({
                        icon: 'success',
                        html: "Your Starting Word is: " + '<b>' + startWord + '</b>'
                    }).then((result) => {
                        if (result.isConfirmed) {
                        Swal.fire({
                            title: "Would you like to pick the final word?",
                            showConfirmButton: true,
                            showCancelButton: true,
                            showDenyButton: true,
                            denyButtonText: "Random Word",
                            confirmButtonText: "Choose Word"
                        }).then((choice) => {
                            if (choice.isConfirmed) {
                                swalFinal();
                            } else if (choice.isDenied) {
                                Swal.fire({
                                    title: "The Solution is: ",
                                    html: word
                                })
                            }
                        })
                    }
                    })
                } else {
                }
            })
        }

        function swalRand() {
            word = randWordReturn();
            startWord = startWord;
            Swal.fire({
                title: "The Word for This Puzzle is:",
                html: '<b>' + word + '</b>'
            })
        }

        function swalFinal() {
            Swal.fire({
                title: "Please input your word",
                input: 'text',
                inputAttributes: {
                    autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'Enter',

                showLoaderOnConfirm: true,
                preConfirm: function (text) {
                    if (text.length != 5 || (dict.includes(text) === false)) {
                        Swal.showValidationMessage("Invalid Word!")
                    } else {
                        console.log(text)
                        return text;
                    }
                },
                allowOutsideClick: false
            }).then(function (text) {
                let conf = text.isConfirmed
                if (conf) {
                    let print = Object.values(text);
                    word = print[3];
                    return (Swal.fire({
                        icon: 'success',
                        html: "Your Final Word is: " + '<b>' + word + '</b>'
                    }))
                } else {
                }
            })
        }

        document.getElementById('randButton').addEventListener("click", swalRand);
        document.getElementById('finalButton').addEventListener("click", swalFinal);
        document.getElementById('startButton').addEventListener("click", swalStart);
        document.getElementById('Solve').addEventListener("click", solver);

        function findColors(letter, index) {
            const isCorrectLet = word.includes(letter);
            const letterInThatPosition = word.charAt(index);
            const isCorrectPosition = letter === letterInThatPosition;

            if (!isCorrectLet) {
                return 0;
            }

            if (isCorrectPosition) {
                return 1;
            }

            return 2;

        }

        function solver() {
            solveWord(startWord);
        }

        function solveWord(oneWord) {
            let thisWord = oneWord;
            if (thisWord) {
                if (myAcc > 5) {
                    setTimeout(() => {Swal.fire({
                        title: "You got me! :(",
                        showCancelButton: true,
                        confirmButtonText: "Play Again?"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                        } else {
                        }
                    })}, 500)
                    return -1;
                } else if (thisWord === word) {
                    for (let i = 0; i < 5; i++) {
                        updateGuessedWord(thisWord[i]);
                    }
                    handleEnteredWord();
                    let waitInt = 500 * myAcc;
                    console.log(myAcc);
                    setTimeout(() => { Swal.fire({ 
                        title: "Solved!",
                        showCancelButton: true,
                        confirmButtonText: "Play Again?",
                }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                        } else {
                        }
                    })}, waitInt);
                    return 0;
                } else {
                    greenSpots = [];
                    graySpots = [];
                    yellowSpots = [];

                    for (let i = 0; i < 5; i++) {
                        updateGuessedWord(thisWord[i]);
                        let store = findColors(thisWord[i], i);

                        if (store == 0) {
                            graySpots.push(i);
                        } else if (store == 1) {
                            greenSpots.push(i);
                        } else {
                            yellowSpots.push(i);
                        }
                    }
                    handleEnteredWord();
                    deleteWrong(thisWord, graySpots);
                    hasLetterWrongSpot(thisWord, yellowSpots);
                    letterRightSpot(thisWord, greenSpots);


                    let newRand = randWordReturn();
                    myAcc += 1;
                    setTimeout(() => { solveWord(newRand) }, 500 * myAcc);
                }
            } else {
                Swal.fire({title: "Oops! Refreshing the page!"}, 500).then((result) =>
                 {
                     location.reload();
                 })
            }

        }

        //checking where to put the letter
        function getCurrentWordArr() {
            const numberGuessedWords = guessedWord.length
            return guessedWord[numberGuessedWords - 1];
        }

        //updating index each time a new letter is input
        function updateGuessedWord(letter) {
            const currentWordArr = getCurrentWordArr();

            if (currentWordArr && currentWordArr.length < 5) {
                currentWordArr.push(letter);

                const availSpaceEl = document.getElementById(String(availSpace));
                availSpace = availSpace + 1;

                availSpaceEl.textContent = letter;
            }

        }

        function getTileColor(letter, index) {
            const isCorrectLet = word.includes(letter);

            if (!isCorrectLet) {
                return "rgb(58,58,60)";
            }

            const letterInThatPosition = word.charAt(index);
            const isCorrectPosition = letter === letterInThatPosition;

            if (isCorrectPosition) {
                return ("rgb(83,141,78)");
            }

            return ("rgb(181,159,59)");
        }

        //what to do when 'Enter' would be pressed
        function handleEnteredWord() {
            const currentWordArr = getCurrentWordArr();

            const flipInterval = 100;

            const currentWord = currentWordArr.join('');
            guessedWord.push([]);

            const firstLetterId = guessedWordAcc * 5 + 1;

            currentWordArr.forEach((letter, index) => {
                setTimeout(() => {
                    const tileColor = getTileColor(letter, index);

                    const letterId = firstLetterId + index;
                    const letterEl = document.getElementById(letterId);

                    letterEl.classList.add("animate__flipInX");
                    letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;


                }, flipInterval * index);
            });

            guessedWordAcc += 1;
        }

        //making 'Wordle' chart
        function createGrid() {
            const grid = document.getElementById("board")
            for (let index = 0; index < 30; index++) {
                let square = document.createElement("div");
                square.classList.add("square");
                square.classList.add("animate__animated");
                square.setAttribute("id", index + 1);
                grid.appendChild(square);
            }
        }

    })
});