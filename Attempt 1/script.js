function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function injectHTML(list) {
  console.log("fired injectHTML");
  const target = document.querySelector("#dnd_list");
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

function cutDndList(list) {
  console.log("fired cut list");   // Array Method that does for-loop math to make code cleaner, easier to read, and use less reasoning
  const range = [...Array(15).keys()]; // ... is a destructuring element, makes an array of 15 elements that definitely only has 15 elements in it
  return (newArray = range.map((item) => { // map does same as foreach but returns new array
    const index = getRandomIntInclusive(0, list.length - 1);
    return list[index];
  }));
}

async function mainEvent() { 
  // the async keyword means we can make API requests
  const loadDataButton = document.querySelector("#data_load");
  const clearDataButton = document.querySelector("#data_clear");
  const generateListButton = document.querySelector("#generate");
  const textField = document.querySelector("#text_field");
  const generalSearchFilter = document.querySelector("#general_search");
  const armorFilter = document.querySelector("#armor");
  const backgroundsFilter = document.querySelector("#backgrounds");
  const classesFilter = document.querySelector("#classes");
  const conditionsFilter = document.querySelector("#conditions");
  const featsFilter = document.querySelector("#feats");
  const magicItemsFilter = document.querySelector("#magic_items");
  const monstersFilter = document.querySelector("#monsters");
  const racesFilter = document.querySelector("#races");
  const spellsFilter = document.querySelector("#spells");
  const weaponsFilter = document.querySelector("#weapons");
  const apiSite = "https://api.open5e.com/search/?format=json";
  let searchTerm = "search";
  
  generateListButton.classList.add("hidden");

  const storedData = localStorage.getItem("storedData");
  let parsedData = JSON.parse(storedData);
  if (parsedData?.length > 0) { // If we have parsed data, then check to see if have length, if not, pass right through
    generateListButton.classList.remove("hidden");
  }

  let currentList = []; // this is "scoped" to the main event function
  
  /* We need to listen to an "event" to have something happen in our page - here we're listening for a "submit" */
  loadDataButton.addEventListener("click", async (submitEvent) => { 
    // async has to be declared on every function that needs to "await" something 
    console.log("Loading data"); // this is substituting for a "breakpoint" - it prints to the browser to tell us we successfully submitted the form

    // Basic GET request - this replaces the form Action
    const results = await fetch( // may need to be let
      apiSite
      //apiSite.concat(searchTerm)
    );

    // This changes the response from the GET into data we can use - an "object"
    let storedList = await results.json();
    localStorage.setItem("storedData", JSON.stringify(storedList));
    parsedData = storedList;

    if (parsedData?.length > 0) { 
      generateListButton.classList.remove("hidden");
    }
  });

  generateListButton.addEventListener("click", (event) => {
    console.log("generate new list");
    currentList = cutDndList(parsedData);
    console.log(currentList);
    injectHTML(currentList);
  });

  textField.addEventListener("input", (event) => {
    console.log("input", event.target.value);
    const newList = filterList(currentList, event.target.value);
    console.log(newList);
    injectHTML(newList);
  });

  clearDataButton.addEventListener("click", (event) => {
    console.log("clear browser data");
    localStorage.clear();
    console.log("localStorage Check", localStorage.getItem("storedData"));
  });

  generalSearchFilter.addEventListener("click", (event) => {
    console.log("general search filter");
    searchTerm = "search";
    currentList = cutDndList(parsedData);
    console.log(currentList);
    injectHTML(currentList);
  });

  armorFilter.addEventListener("click", (event) => {
    console.log("armor filter");
    searchTerm = "armor";
  });

  backgroundsFilter.addEventListener("click", (event) => {
    console.log("backgrounds filter");
    searchTerm = "backgrounds";
  });

  classesFilter.addEventListener("click", (event) => {
    console.log("classes filter");
    searchTerm = "classes";
  });

  conditionsFilter.addEventListener("click", (event) => {
    console.log("conditions filter");
    searchTerm = "conditions";
  });

  featsFilter.addEventListener("click", (event) => {
    console.log("feats filter");
    searchTerm = "feats";
  });

  magicItemsFilter.addEventListener("click", (event) => {
    console.log("magic items filter");
    searchTerm = "magicitems";
  });

  monstersFilter.addEventListener("click", (event) => {
    console.log("monsters filter");
    searchTerm = "monsters";
  });

  racesFilter.addEventListener("click", (event) => {
    console.log("races filter");
    searchTerm = "races";
  });

  spellsFilter.addEventListener("click", (event) => {
    console.log("spells filter");
    searchTerm = "spells";
  });

  weaponsFilter.addEventListener("click", (event) => {
    console.log("weapons filter");
    searchTerm = "weapons";
  });

  // const ctx = document.getElementById('dndChart');
    
  //     new Chart(ctx, {
  //       type: 'bar',
  //       data: {
  //         labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  //         datasets: [{
  //           label: 'Quantity',
  //           data: [12, 19, 3, 5, 2, 3],
  //           borderWidth: 1
  //         }]
  //       },
  //       options: {
  //         scales: {
  //           y: {
  //             beginAtZero: true
  //           }
  //         }
  //       }
  //     });
}

document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests