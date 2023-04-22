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

async function mainEvent() { 
  // the async keyword means we can make API requests
  const mainForm = document.querySelector(".main_form"); // This class name needs to be set on your form before you can listen for an event on it
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
  const apiSite = "https://api.open5e.com/";
  let searchTerm = "";
  
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
    let results = await fetch(
      apiSite.concat(searchTerm)
    );

    // This changes the response from the GET into data we can use - an "object"
    const storedList = await results.json();
    localStorage.setItem("storedData", JSON.stringify(storedList));
    parsedData = storedList;

    if (parsedData?.length > 0) { 
      generateListButton.classList.remove("hidden");
    }
  });

  generateListButton.addEventListener("click", (event) => {
    console.log("generate new list");
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
}

document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests