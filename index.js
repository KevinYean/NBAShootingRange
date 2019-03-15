var setPlayerName = new Set();
var jsonFile;
var playersYearSelect;
var playersSelect;

var ctx;
var myChart;

$(document).ready(function(){
    myChart = new Chart(ctx, {
        type: 'bar',
        label: 'Shot Attempts',
        data: {
            labels: ['At Rim', '3 to <10 ft', '10 to <16 ft', '16ft to <3-pt', '3Pt'],
            datasets: [
                {
                    label: 'Number of Shot Attempts',
                    data: [1, 1, 1, 1, 1],
                    backgroundColor: "blue",
                    borderWidth: 1
                }
             ]

        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
});


window.onload = function () {
    playersSelect = document.getElementById("playersName");
    playersYearSelect = document.getElementById("year");
    ctx = document.getElementById('chart').getContext('2d');

    var playerNameArray =[] //Array of names
    //Go through the JSON File
    $.getJSON( "playerShootingDistance.json", function( nba ) {
        jsonFile = nba;
        //Find all unique names and add it to the set
        for(var i = 0; i < nba.length; i++) {
            console.log(i);
            playerName = nba[i]['Player'];
            if(setPlayerName.has(playerName) == false){ //If name is not in the set add it to the dropdown menu array
                playerNameArray.push(playerName);
            }
            setPlayerName.add(playerName); //Ad it to the set
        }
        playerNameArray.sort()
        //Adds all the unique name and ad it to the dropdown menu
        for(var i = 0 ; i < playerNameArray.length ; i++){
            var option = document.createElement("option");
            option.name = playerNameArray[i];
            option.text = playerNameArray[i];
            playersSelect.add(option);
        }
        //Set the years accordingly given the name
        updateSelectYear(playersSelect.value);
        updateColumnChart(playersSelect.value,playersYearSelect.value)
    });
    console.log("Set: " + setPlayerName.size);
}

function updateColumnChart(playerName,playerYear){
    for(var i = 0; i < jsonFile.length; i++){
        if(playerName == jsonFile[i]['Player'] && playerYear == jsonFile[i]["Year"]){
            if(jsonFile[i]["Type"] == ["Attempts"]){
                myChart.data.datasets[0].data[0] = parseInt(jsonFile[i]["At Rim"]);
                console.log(parseInt(jsonFile[i]["At Rim"]));
                myChart.data.datasets[0].data[1] = parseInt(jsonFile[i]["3 to <10 ft"]);
                myChart.data.datasets[0].data[2] = parseInt(jsonFile[i]["10 to <16 ft"]);
                myChart.data.datasets[0].data[3] = parseInt(jsonFile[i]["16ft to <3-pt"]);
                myChart.data.datasets[0].data[4] = parseInt(jsonFile[i]["3-pt"]);
                break;
            }
        }
    }
    myChart.update();
}

function updateSelectYear(name){

    playersYearSelect.innerHTML = "";//Empty DropDown
    var years =[];

    //Get all the years given the name
    for(var i = 0; i < jsonFile.length; i++) {
        playerName = jsonFile[i]['Player'];
        if(playerName == name){
            thisYear = jsonFile[i]['Year'];
            years.push(thisYear);
            i++; //Skip a year
        }
    }
    years = years.sort() //Sort the years

    for(var i = 0; i < years.length; i++) { //Adds the years
         var option = document.createElement("option");
         option.text =years[i];
         playersYearSelect.add(option);
    }
}

function selectedYear(){
    updateColumnChart(playersSelect.value,playersYearSelect.value);
}

function changeData() {
    updateSelectYear(playersSelect.value);
    updateColumnChart(playersSelect.value,playersYearSelect.value);
}