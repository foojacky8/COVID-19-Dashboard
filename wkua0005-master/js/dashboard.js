/**
 * Javascript for index.html.
 * Include the code to get date from API and plot the graph for widget.
 * 
 * @author Jacky Foo <jfoo0016@student.monash.edu>
 * @author Hou Ruiqian <rhou0006@student.monash.edu>
 * @author Kuan Wai Shuet <wkua0005@student.monash.edu>
 * @author Arvind <acha0094@student.monash.edu>
 * @author Joshua Ee <jeee0002@student.monash.edu>
 * @author Jordan Poon <jord0004@student.monash.edu>
 * 
 * 
 * Created at     : 2021-09-14 02:30
 * Last modified  : 2021-09-21 20:00 
 */

 firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        window.location = "login-register.html";
    }
  });

let url = 'https://covid.ourworldindata.org/data/owid-covid-data.json';
let src = 'https://disease.sh/v3/covid-19/countries/Malaysia?yesterday=true';

let url2 = 'https://disease.sh/v3/covid-19/all' // use this for global overview
let url3 = 'https://disease.sh/v3/covid-19/countries/Malaysia?yesterday=true'   // get the recover cases for malaysia (yesterday only due to slow update)

fetch(url).then(response => response.json()).then(data => {
    let malaysia_data = data["MYS"]["data"];
    
    get_daily_cases(malaysia_data);
    get_vaccination_data(malaysia_data);
    get_death_cases(malaysia_data);
    let malaysia_population = data["MYS"]["population"];
    
    get_cumulative_vacc(malaysia_data, malaysia_population);

    get_Malaysia_overview(malaysia_data);
    get_daily_vaccinations(malaysia_data);
});

fetch(url2).then(response => response.json()).then(data => {
    let global_data = data;
    
    get_Global_Overview(global_data);
});

fetch(url3).then(response => response.json()).then(data => {
    let malaysia_data = data;
    
    get_Malaysia_recover(malaysia_data);
    get_Malaysia_daily_overview(malaysia_data);

});

// This function is used to prepare the data for daily confirmed cases widget.
function get_daily_cases(malaysia_data){
    let daily_cases = [];
    let daily_cases_date = [];
    for (let i = 0; i < malaysia_data.length; i++){
        for (let key in malaysia_data[i]){
            if (key == "new_cases"){
                daily_cases.push(malaysia_data[i][key]);
                daily_cases_date.push(malaysia_data[i]["date"]);
            }
        }
    }
    daily_cases_graph(daily_cases,daily_cases_date);
}

// This function is used to plot the graph in the widget for the daily cases.
function daily_cases_graph(graph_data,graph_x_axis_label){
    let chartRef = document.getElementById("daily-cases-chart").getContext('2d');
    let myChart = new Chart(chartRef, {
        type: 'line',
        data: {
            labels: graph_x_axis_label,
            datasets: [{
                label: "Number of new cases",
                data: graph_data,
                fill: false,
                borderColor: "#55bae7",
                backgroundColor: "#55bae7",
                pointBackgroundColor: "#55bae7",
                pointBorderColor: "#55bae7",
                pointHoverBackgroundColor: "#55bae7",
                pointHoverBorderColor: "#55bae7",
            }] 
        },
    });
}

// This function is used to prepare the data for vaccination status widget.
function get_vaccination_data(malaysia_data){
    let lables = ["Fully vaccinated", "Partially vaccinated","Not vaccinated" ];

    let people_vaccinated = [];
    let people_fully_vaccinated = [];
    let vaccination_status = [];

    for (let i = 0; i < malaysia_data.length; i++){
        for (let key in malaysia_data[i]){

            if (key == "people_vaccinated"){
                people_vaccinated.push(malaysia_data[i][key]);
            }
            if (key == "people_fully_vaccinated"){
                people_fully_vaccinated.push(malaysia_data[i][key]);
            }
            if (key == "people_vaccinated"){
                people_vaccinated.push(malaysia_data[i][key]);
            }
        }
    }
    vaccination_status.push(people_fully_vaccinated.slice(-1));
    vaccination_status.push(people_vaccinated.slice(-1) - people_fully_vaccinated.slice(-1));
    vaccination_status.push(32700000 - (people_vaccinated.slice(-1)));

    vaccination_piechart_graph(lables,vaccination_status);
}

// This function is used to plot the graph in the widget for the vaccination status.
function vaccination_piechart_graph(lables,vaccination_status){
    let chartRef = document.getElementById("vaccination-status-card-piechart");
    var pieColors = [
        "#b91d47",
        "#00aba9",
        "#2b5797",
        "#e8c3b9",
      ]

    new Chart(chartRef, {
        type: "pie",
        data: {
          labels: lables,
          datasets: [{
            backgroundColor: pieColors,
            data: vaccination_status
          }]
        },
        options: {
          title: {
            display: true,
            text: "Pie Chart for vaccination status"
          }
        }
      });
}

// This function is used to prepare the data for daily deaths widget.
function get_death_cases(malaysia_data){
    let death_cases = [];
    let death_cases_date = [];
    for (let i = 0; i < malaysia_data.length; i++){
        for (let key in malaysia_data[i]){
            if (key == "total_deaths"){
                death_cases.push(malaysia_data[i][key]);
                death_cases_date.push(malaysia_data[i]["date"]);
            }
        }
    }
    death_cases_graph(death_cases,death_cases_date);
}

// This function is used to plot the graph in the widget for the daily deaths.
function death_cases_graph(graph_data,graph_x_axis_label){
    let chartRef = document.getElementById("death-cases-chart").getContext('2d');
    let myChart = new Chart(chartRef, {
        type: 'line',
        data: {
            labels: graph_x_axis_label,
            datasets: [{
                label: "Number of death cases",
                data: graph_data,
                backgroundColor: "rbga(246, 18, 52,0.6)",
            }] 
        },
    });
}

// This function get total cumulative data from the data extracted.
function get_cumulative_vacc(malaysia_data,malaysia_population){
    let atleast_1_dose = [];
    let fully_vaccinated = [];
    let vacc_date = [];
    let population_line = [];
    for (let i = 0; i < malaysia_data.length; i++){
        for (let key in malaysia_data[i]){
            if (key == "people_vaccinated"){
                atleast_1_dose.push(malaysia_data[i][key]);
                vacc_date.push(malaysia_data[i]["date"]);   
                fully_vaccinated.push(malaysia_data[i]["people_fully_vaccinated"]);
                population_line.push(malaysia_population)
            }
        }
    }

    plot_cumulative_vacc_graph(atleast_1_dose,fully_vaccinated,population_line,vacc_date)
}

// This function plot the total cumulative data into a triple line graph.
function plot_cumulative_vacc_graph(atleast_1_dose,fully_vaccinated,population_line,graph_x_axis_label){
    let vaccChartRef = document.getElementById("total-cvaccinations-chart").getContext('2d');
    console.log(population_line)
    let vaccChart = new Chart(vaccChartRef, {
        type: 'line',
        data: {
            labels: graph_x_axis_label,
            datasets: [
            {
                label: "Fully vaccinated",
                data: fully_vaccinated,
                borderColor: "rgb(91,185,116)",
                backgroundColor: "rgb(91,185,116)",
                fill: true,
                pointRadius: 2,
            },
            {
                label: "At least 1 dose",
                data: atleast_1_dose,
                borderColor: "rgb(91,185,116)",
                backgroundColor: "rgb(168,218,181)",
                fill: true,
                pointRadius: 2,
            },
            
            {
                label: "Population",
                data: population_line,
                borderColor: "rgb(255,171,64)",
                backgroundColor: "rgb(255,171,64)",
                borderDash: [10, 10],
                borderWidth: 1.2,
                pointRadius : 0,
                fill: false,
            },
            
        ]},
    });
}

// This function is used to prepare the data for daily vaccinations chart.
function get_daily_vaccinations(malaysia_data){
    let daily_vaccinations = [];
    let daily_vaccinations_date = [];
    for (let i = 0; i < malaysia_data.length; i++){
        for (let key in malaysia_data[i]){
            if (key == "new_vaccinations"){
                daily_vaccinations.push(malaysia_data[i][key]);
                daily_vaccinations_date.push(malaysia_data[i]["date"]);
            }
        }
    }
    daily_vaccinations_graph(daily_vaccinations,daily_vaccinations_date);
}

// This function is used to construct the daily vaccinations line chart.
function daily_vaccinations_graph(graph_data,graph_x_axis_label){
    let chartRef = document.getElementById("daily-vaccinations-chart").getContext('2d');
    let myChart = new Chart(chartRef, {
        type: 'line',
        data: {
            labels: graph_x_axis_label,
            datasets: [{
                label: "Number of Daily Vaccinations",
                data: graph_data,
                borderColor: "#8e5ea2",
                backgroundColor: "#8e5ea2",
                pointStyle: 'crossRot',
                pointBorderWidth: '0.1',
                fill: false,
            }] 
        },
    });
}

function get_Malaysia_overview(malaysia_data){
    let total_num_cases = 0;
    let total_num_deaths = 0;

    let total_cases_header = document.querySelector(".total_Malaysia_cases")
    let total_deaths_header = document.querySelector(".total_Malaysia_deaths")

    for (let key in malaysia_data[malaysia_data.length - 1]){
        if (key == "total_cases"){
            total_num_cases = malaysia_data[malaysia_data.length - 1][key]
        }

        if (key == "total_deaths"){
            total_num_deaths = malaysia_data[malaysia_data.length - 1][key]
        }
    }

    total_cases_header.innerHTML = total_num_cases
    total_deaths_header.innerHTML = total_num_deaths
}

function get_Global_Overview(global_data){
    let total_num_cases = 0;
    let total_num_deaths = 0;
    let total_num_recover = 0;

    let total_cases_header = document.querySelector(".total_Global_cases")
    let total_deaths_header = document.querySelector(".total_Global_deaths")
    let total_recover_header = document.querySelector(".total_Global_recover")

    for (let key in global_data){
        if (key == "cases"){
            total_num_cases += global_data[key]
        } else if (key == "recovered"){
            total_num_recover += global_data[key]
        } else if (key == "deaths"){
            total_num_deaths += global_data[key]
        }
    }

    total_cases_header.innerHTML = total_num_cases
    total_deaths_header.innerHTML = total_num_deaths
    total_recover_header.innerHTML = total_num_recover
}

function get_Malaysia_recover(malaysia_data){
    let total_num_recover = 0

    let total_recover_header = document.querySelector(".total_Malaysia_recover")

    for (let key in malaysia_data){
        if (key == "recovered"){
            total_num_recover += malaysia_data[key]
        }
    }

    total_recover_header.innerHTML = total_num_recover
}

function get_Malaysia_daily_overview(malaysia_data){
    let daily_num_cases = 0
    let daily_num_recover = 0
    let daily_num_deaths = 0

    let daily_cases_header = document.querySelector(".daily_Malaysia_cases")
    let daily_recover_header = document.querySelector(".daily_Malaysia_recover")
    let daily_deaths_header = document.querySelector(".daily_Malaysia_deaths")

    for (let key in malaysia_data){
        if (key == "todayCases"){
            daily_num_cases += malaysia_data[key]
        } else if (key == "todayRecovered"){
            daily_num_recover += malaysia_data[key]
        } else if (key == "todayDeaths"){
            daily_num_deaths += malaysia_data[key]
        }
    }

    daily_cases_header.innerHTML = daily_num_cases
    daily_recover_header.innerHTML = daily_num_recover
    daily_deaths_header.innerHTML = daily_num_deaths

}