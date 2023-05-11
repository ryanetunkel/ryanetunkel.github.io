function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function injectHTML(list) {
  console.log("fired injectHTML");
  const target = document.querySelector("#restaurant_list");
  target.innerHTML = "";
  list.forEach((item) => {
    const str = `<li>${item.name}</li>`;
    target.innerHTML += str;
  });
}

/* A quick filter that will return something based on a matching input */
function filterList(list, query) {
  return list.filter((item) => {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
}

function cutRestaurantList(list) {
  console.log("fired cut list");   // Array Method that does for-loop math to make code cleaner, easier to read, and use less reasoning
  const range = [...Array(15).keys()]; // ... is a destructuring element, makes an array of 15 elements that definitely only has 15 elements in it
  return (newArray = range.map((item) => { // map does same as foreach but returns new array
    const index = getRandomIntInclusive(0, list.length - 1);
    return list[index];
  }));
}

function initChart(target, data, labels) {
  const chart = new Chart(target, {
    type: 'bar',
    data: {
    labels: labels,   
    datasets: [data]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
  return chart;
}

function processChartData(data) {
  const dataForChart = data.reduce((col, item, idx) => {
    // split by major watershed - major_wshed //switch to spell_level when switch to dnd api
    if (!col[item.major_wshed]) {
      col[item.major_wshed] = 1
    }
    else {
      col[item.major_wshed] += 1
    }
    return col;
  }, {});

  const labels = Object.keys(dataForChart);
  const dataSet = {
    label: "Times Cleaned of Trash",
    data: Object.values(dataForChart),
    borderWidth: 1
  }

  // console.log(dataForChart); // uncomment to see results of stuff in inspect console tab
  return [dataSet, labels];
}

function updateChart(chart, newInfo) {
  const chartData = processChartData(newInfo);
  chart.data.labels = chartData[1];
  console.log(chartData);
  chart.data.datasets[0].data = chartData[0];
  chart.update();
}

async function mainEvent() { 
  // the async keyword means we can make API requests
  const loadDataButton = document.querySelector("#data_load");
  const generateListButton = document.querySelector("#generate");
  const textField = document.querySelector("#list_selector");
  const chart = document.querySelector("#myChart");

  const loadAnimation = document.querySelector("#data_load_animation");
  loadAnimation.style.display = "none";
  generateListButton.classList.add("hidden");

  const storedData = localStorage.getItem("storedData");
  let parsedData = JSON.parse(storedData);
  if (parsedData?.length > 0) { // If we have parsed data, then check to see if have length, if not, pass right through
    generateListButton.classList.remove("hidden");
  }

  let currentList = []; // this is "scoped" to the main event function
  

  const chartData = processChartData(parsedData);
  const newChart = initChart(chart, chartData[0], chartData[1]);

  /* We need to listen to an "event" to have something happen in our page - here we're listening for a "submit" */
  loadDataButton.addEventListener("click", async (submitEvent) => { 
    // async has to be declared on every function that needs to "await" something 
    console.log("Loading data"); // this is substituting for a "breakpoint" - it prints to the browser to tell us we successfully submitted the form
    loadAnimation.style.display = "inline-block";

    // Basic GET request - this replaces the form Action
    const results = await fetch(
      "https://data.princegeorgescountymd.gov/resource/9tsa-iner.json" //already replaced with litter dataset
      // "https://api.open5e.com/spells/?format=json"
    );

    // Need to get it so the results that stores the json got from the fetch() request specifies the "results" 
    // array in the dnd api json request - 37:25 in the video was where was when was getting an array to return
    // albeit full of undefined results when was trying to implement the dnd version

    // This changes the response from the GET into data we can use - an "object"
    console.log(results);
    const storedList = await (results).json();
    localStorage.setItem("storedData", JSON.stringify(storedList));
    parsedData = storedList;

    if (parsedData?.length > 0) { 
      generateListButton.classList.remove("hidden");
    }

    loadAnimation.style.display = "none";
    console.table(storedList); 
  });

  generateListButton.addEventListener("click", (event) => {
    console.log("generate new list");
    currentList = cutRestaurantList(parsedData);
    console.log(currentList);
    injectHTML(currentList);
    updateChart(newChart, currentList);
  });

  textField.addEventListener("input", (event) => {
    console.log("input", event.target.value);
    const newList = filterList(currentList, event.target.value);
    console.log(newList);
    injectHTML(newList);
    updateChart(newChart, newList);
  });
}

document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests