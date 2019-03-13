var listDistanceMade = [84,28,14,23,101]
var listDistanceAttempts = [148,74,39,83,279]

var set1 = new Set();
var jsonFile;
var yearSelect;
var playersSelect;

window.onload = function () {

    playersSelect = document.getElementById("playersName");
    yearSelect = document.getElementById("year");

    var playerNameArray =[] //Array of names

    //Go through the Json Files
    $.getJSON( "playerShootingDistance.json", function( nba ) {
        jsonFile = nba;
        //Find all unique names and Set it to the dropdown menu
        for(var i = 0; i < nba.length; i++) {
            playerName = nba[i]['Player'];
            if(set1.has(playerName) == false){ //If name is not in the set add it to the dropdown menu
                playerNameArray.push(playerName);
                /*var option = document.createElement("option");
                option.name = playerName;
                option.text = playerName;
                playersSelect.add(option);*/
            }
            set1.add(playerName);
        }

        playerNameArray.sort()
        for(var i = 0 ; i < playerNameArray.length ; i++){
            var option = document.createElement("option");
            option.name = playerNameArray[i];
            option.text = playerNameArray[i];
            playersSelect.add(option);
            console.log(playerNameArray[i]);
        }

        playerNameArray.sort();
        console.log(playerNameArray);
        //Set the years accordingly given the name
        firstvalue = playersSelect.value;
        updateSelectYear(firstvalue);
        updateColumnChart(listDistanceMade,listDistanceAttempts)
    });
}

function updateColumnChart(listMade,listAttempts){

    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,

        title:{
            text: playersSelect.value + ", " + yearSelect.value + " Regular Season Shooting Distance Attempts"
        },
        axisX:{
            interval: 1
        },
        axisY2:{
            interlacedColor: "rgba(1,77,101,.2)",
            gridColor: "rgba(1,77,101,.1)",
            title: "Shot Percentage"
        },
        data: [
            {
                type: "column",
                name: "Made",
                axisYType: "secondary",
                color: "#0002ff",
                showInLegend: true,
                dataPoints: [
                    {y: listMade[0], label: "Rim"},
                    {y: listMade[1], label: "3 to 10ft"},
                    {y: listMade[2], label: "10 to 16ft"},
                    {y: listMade[3], label: "16 to 3pt Line"},
                    {y: listMade[4], label: "3pt Line and beyond"}
                ]
            },
            {
                type: "column",
                name: "Attempts",
                axisYType: "secondary",
                showInLegend: true,
                color: "#cd0035",
                dataPoints: [
                    { y: listAttempts[0], label: "Rim" },
                    { y: listAttempts[1], label: "3 to 10ft" },
                    { y: listAttempts[2], label: "10 to 16ft" },
                    { y: listAttempts[3], label: "16 to 3pt Line" },
                    { y: listAttempts[4], label: "3pt Line and beyond" },
                ]
            },
        ]
    });
    chart.render();
}

function updateSelectYear(name){

    yearSelect.innerHTML = "";//Empty DropDown
    var years =[]

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
         yearSelect.add(option);
    }
}

function changeData() {
    var test1 = [148,74,39,83,279]
    var test2 = [240,280,50,100,301]

    console.log(playersSelect.value);
    updateSelectYear(playersSelect.value);
    updateColumnChart(test1,test2);

}