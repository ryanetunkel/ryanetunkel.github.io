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
  const textField = document.querySelector("#resto");
  
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
    const results = await fetch(
      "https://api.open5e.com"
    );

    // This changes the response from the GET into data we can use - an "object"
    const storedList = await results.json();
    localStorage.setItem("storedData", JSON.stringify(storedList));
    parsedData = storedList;

    if (parsedData?.length > 0) { 
      generateListButton.classList.remove("hidden");
    }

    // console.table(storedList); 
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
}

document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests