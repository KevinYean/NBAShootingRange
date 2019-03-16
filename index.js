var setPlayerName = new Set();
var jsonFile;
var jsonFileLeagueAverage;
var playersYearSelect;
var playersSelect;

var ctx;
var myChart;

$(document).ready(function(){
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['At Rim', '3 to <10 ft', '10 to <16 ft', '16ft to <3-pt', '3Pt'],
            datasets: [
                {
                    label: '# of Shot Attempts',
                    data: [1, 1, 1, 1, 1],
                    backgroundColor: 'rgba(0, 255, 0, 0.5)',
                    borderWidth: 1
                },{
                    label: 'League Average',
                    data: [1, 1, 1, 1,1],

                    // Changes this dataset to become a line
                    type: 'line',
                    backgroundColor: 'rgba(0, 0, 255, 0.9)',
                    borderColor:'rgba(0, 0, 255, 0.9)',
                    borderWidth:2,
                    fill:false
                }
             ]

        },
        options: {
            legend: {
                display: true,
                position:"left",
                labels: {
                    fontColor: 'black'
                }
            },
            scales: {
                xAxes:[{
                    scaleLabel:{
                        display: true,
                        labelString: 'Shot Distance'
                    }
                }],
                yAxes: [{
                    scaleLabel:{
                        display: true,
                        labelString: 'Shot Number'
                    },
                    ticks: {
                        suggestedMax: 500,
                        min: 0,
                        stepSize: 50,
                        beginAtZero: true,
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

    //Go through JSON file of league average
    $.getJSON( "leagueAverage.json", function( nba ) {
        jsonFileLeagueAverage = nba;
    });

    //Go through the JSON File for Players
    $.getJSON( "playerShootingDistance.json", function( nba ) {
        jsonFile = nba;
        //Find all unique names and add it to the set
        for(var i = 0; i < nba.length; i++) {
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
}

function updateColumnChart(playerName,playerYear){
    for(var i = 0; i < jsonFile.length; i++){
        if(playerName == jsonFile[i]['Player'] && playerYear == jsonFile[i]["Year"]){
                myChart.data.datasets[0].data[0] = (jsonFile[i]["Shot Distribution Attempts"][0]);
                myChart.data.datasets[0].data[1] = (jsonFile[i]["Shot Distribution Attempts"][1]);
                myChart.data.datasets[0].data[2] = (jsonFile[i]["Shot Distribution Attempts"][2]);
                myChart.data.datasets[0].data[3] = (jsonFile[i]["Shot Distribution Attempts"][3]);
                myChart.data.datasets[0].data[4] = (jsonFile[i]["Shot Distribution Attempts"][4]);

                sum = 0
                for (var x = 0; x < jsonFile[i]["Shot Distribution Attempts"].length; x++) {
                    sum += jsonFile[i]["Shot Distribution Attempts"][x];
                }
                console.log(sum)

                dat = jsonFileLeagueAverage.find(el => el['Year'] === playerYear);
                myChart.data.datasets[1].data[0] = dat["shot1Average"] *sum;
                myChart.data.datasets[1].data[1] = dat["shot2Average"] *sum;
                myChart.data.datasets[1].data[2] = dat["shot3Average"] *sum;
                myChart.data.datasets[1].data[3] = dat["shot4Average"] *sum;
                myChart.data.datasets[1].data[4] = dat["shot5Average"] *sum;
                break;
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