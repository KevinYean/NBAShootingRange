var setPlayerName = new Set();
var jsonFile;
var jsonFileLeagueAverage;
var playersYearSelect;
var playersSelect;

var ctx;
var myChart;

$(document).ready(function(){

    $.getJSON( "leagueAverage.json", function( nba ) {
        jsonFileLeagueAverage = nba;
    });

    $.getJSON( "playerShootingDistance.json", function( nba ) {
        jsonFile = nba;
    });

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['At Rim', '3 to <10 ft', '10 to <16 ft', '16ft to <3-pt', '3Pt'],
            datasets: [
                {
                    label: '# of Shot Made',
                    data: [1, 1, 1, 1, 1],
                    backgroundColor: 'rgba(0, 255, 0, 0.5)',
                    borderWidth: 1
                },
                {
                    label: '# of Shot Missed',
                    data: [1, 1, 1, 1, 1],
                    backgroundColor: 'rgba(255, 0, 0, 0.5)',
                    borderWidth: 1
                }
                ,{
                    label: 'Average # of Shot Attempt per Distance',
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
                    stacked: true,
                    scaleLabel:{
                        display: true,
                        labelString: 'Shot Distance'
                    }
                }],
                yAxes: [{
                    stacked: true,
                    scaleLabel:{
                        display: true,
                        labelString: '# Shot Attempts'
                    },
                    ticks: {
                        suggestedMax: 350,
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
        console.log(jsonFileLeagueAverage)
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

function updateGraph(sum){
    if(sum < 50){
        myChart.options.scales.yAxes[0].ticks.suggestedMax = 50;
        myChart.options.scales.yAxes[0].ticks.stepSize = 10;
    }
    else if(sum < 100 && sum >= 50){
        myChart.options.scales.yAxes[0].ticks.suggestedMax = 100
        myChart.options.scales.yAxes[0].ticks.stepSize = 10;
    }
    else if(sum < 300 && sum >= 100){
        myChart.options.scales.yAxes[0].ticks.suggestedMax = 200;
        myChart.options.scales.yAxes[0].ticks.stepSize = 25;
    }
    else if(sum < 500 && sum >=300){
        myChart.options.scales.yAxes[0].ticks.suggestedMax = 350;
        myChart.options.scales.yAxes[0].ticks.stepSize = 25;
    }
    else{
        myChart.options.scales.yAxes[0].ticks.suggestedMax = 500;
        myChart.options.scales.yAxes[0].ticks.stepSize = 50;
    }
}

function updateColumnChart(){

    playerName = playersSelect.value
    playerYear = playersYearSelect.value

    for(var i = 0; i < jsonFile.length; i++){
        if(playerName == jsonFile[i]['Player'] && playerYear == jsonFile[i]["Year"]){
                //Made
                myChart.data.datasets[0].data[0] = (jsonFile[i]["Shot Distribution Made"][0]);
                myChart.data.datasets[0].data[1] = (jsonFile[i]["Shot Distribution Made"][1]);
                myChart.data.datasets[0].data[2] = (jsonFile[i]["Shot Distribution Made"][2]);
                myChart.data.datasets[0].data[3] = (jsonFile[i]["Shot Distribution Made"][3]);
                myChart.data.datasets[0].data[4] = (jsonFile[i]["Shot Distribution Made"][4]);
                //Misses
                myChart.data.datasets[1].data[0] = (jsonFile[i]["Shot Distribution Attempts"][0])-(jsonFile[i]["Shot Distribution Made"][0]);
                myChart.data.datasets[1].data[1] = (jsonFile[i]["Shot Distribution Attempts"][1])-(jsonFile[i]["Shot Distribution Made"][1]);
                myChart.data.datasets[1].data[2] = (jsonFile[i]["Shot Distribution Attempts"][2])-(jsonFile[i]["Shot Distribution Made"][2]);
                myChart.data.datasets[1].data[3] = (jsonFile[i]["Shot Distribution Attempts"][3])-(jsonFile[i]["Shot Distribution Made"][3]);
                myChart.data.datasets[1].data[4] = (jsonFile[i]["Shot Distribution Attempts"][4])-(jsonFile[i]["Shot Distribution Made"][4]);

                sum = 0
                for (var x = 0; x < jsonFile[i]["Shot Distribution Attempts"].length; x++) {
                    sum += jsonFile[i]["Shot Distribution Attempts"][x];
                }

                //RADIO BUTTON
                var radioValueOne = $("input[name='firstOption']:checked").val();
                var radioValueTwo = $("input[name='secondOption']:checked").val();
                dat = jsonFileLeagueAverage.find(el => el['Year'] === playersYearSelect.value);
                if(radioValueOne == 'league'){
                    if(radioValueTwo == "Attempts"){
                        myChart.data.datasets[2].data[0] = dat["shotDistributionAttempts"][0] / dat["Players"];
                        myChart.data.datasets[2].data[1] = dat["shotDistributionAttempts"][1] / dat["Players"];
                        myChart.data.datasets[2].data[2] = dat["shotDistributionAttempts"][2] / dat["Players"];
                        myChart.data.datasets[2].data[3] = dat["shotDistributionAttempts"][3] / dat["Players"];
                        myChart.data.datasets[2].data[4] = dat["shotDistributionAttempts"][4] / dat["Players"];
                    }
                    else{
                        myChart.data.datasets[2].data[0] = dat["shotDistributionMade"][0] / dat["Players"];
                        myChart.data.datasets[2].data[1] = dat["shotDistributionMade"][1] / dat["Players"];
                        myChart.data.datasets[2].data[2] = dat["shotDistributionMade"][2] / dat["Players"];
                        myChart.data.datasets[2].data[3] = dat["shotDistributionMade"][3] / dat["Players"];
                        myChart.data.datasets[2].data[4] = dat["shotDistributionMade"][4] / dat["Players"];
                    }
                }
                else{
                    if (radioValueTwo == "Attempts"){
                        //League Average Attempts
                        console.log(dat["shotAttemptsRatio"][0]);
                        myChart.data.datasets[2].data[0] = dat["shotAttemptsRatio"][0] * sum;
                        myChart.data.datasets[2].data[1] = dat["shotAttemptsRatio"][1] * sum;
                        myChart.data.datasets[2].data[2] = dat["shotAttemptsRatio"][2] * sum;
                        myChart.data.datasets[2].data[3] = dat["shotAttemptsRatio"][3] * sum;
                        myChart.data.datasets[2].data[4] = dat["shotAttemptsRatio"][4] * sum;

                        console.log("sum " + sum);
                        console.log( dat["shotAttemptsRatio"][0] + dat["shotAttemptsRatio"][1] + dat["shotAttemptsRatio"][2] + dat["shotAttemptsRatio"][3] + dat["shotAttemptsRatio"][4] )
                    }
                    else{
                        //League Average Attempts
                        myChart.data.datasets[2].data[0] = dat["shotDistributionMade"][0]/dat["shotDistributionAttempts"][0] * jsonFile[i]["Shot Distribution Attempts"][0];
                        myChart.data.datasets[2].data[1] =  dat["shotDistributionMade"][1]/dat["shotDistributionAttempts"][1]*jsonFile[i]["Shot Distribution Attempts"][1];
                        myChart.data.datasets[2].data[2] =  dat["shotDistributionMade"][2]/dat["shotDistributionAttempts"][2] * jsonFile[i]["Shot Distribution Attempts"][2];
                        myChart.data.datasets[2].data[3] = dat["shotDistributionMade"][3]/dat["shotDistributionAttempts"][3] *jsonFile[i]["Shot Distribution Attempts"][3];
                        myChart.data.datasets[2].data[4] =  dat["shotDistributionMade"][4]/dat["shotDistributionAttempts"][4] * jsonFile[i]["Shot Distribution Attempts"][4];
                    }
                }

                myChart.update();


                updateGraph(sum);

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
    updateColumnChart();
}

function changeData() {
    updateSelectYear(playersSelect.value);
    updateColumnChart();
}