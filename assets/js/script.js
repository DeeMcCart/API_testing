const API_URL = 'https://ci-jshint.herokuapp.com/api';
const API_KEY = 'QhG-Sw9oS5iwKcSb5DMA-iZe-K4';
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e=> getStatus(e));
document.getElementById("submit").addEventListener("click", e=> postForm(e));

function displayException(data) {
    let heading = 'An Exception Occurred';
    results = '<div><b> HTTP returned </b>'+data.status_code + ' ' +
    '<i>'+data.error + '</i>'  
    results += '<b>  Error no: </b>'+data.error_no + '</div> '
    
    modalTitle = document.getElementById("resultsModalTitle");
    modalTitle.innerHTML = heading
    modalBody = document.getElementById("results-content");
    modalBody.innerHTML  = results;   
    resultsModal.show();
    }



async function getStatus(e) {
    /* const queryString = '${API_URL}?api_key=${API_KEY}'; */

    /* Some difficulties getting template strings to work for me 25/09/23:
    const queryString1 = "https://ci-jshint.herokuapp.com/api?api_key=QhG-Sw9oS5iwKcSb5DMA-iZe-K4";
    console.log(queryString1);
    const queryString2 = '${API_URL}?api_key=QhG-Sw9oS5iwKcSb5DMA-iZe-K4';
    console.log(queryString2); */
    const queryString3 = API_URL+'?api_key='+API_KEY;
    console.log(queryString3);
    const response = await fetch(queryString3);
    const data = await response.json();
 if (response.ok) {
    displayStatus(data.expiry);
 }
 else {
    /* Need to add some error handling here for failed API calls */
    console.log (data);
    displayException(data);
    throw new Error(data.error);
 }
}

function displayStatus (data) {
    modalTitle = document.getElementById("resultsModalTitle");
    modalTitle.innerHTML = 'API Key Status'
    modalBody = document.getElementById("results-content");
    modalBody.innerHTML  = 'Your key is valid until ' + data;   
    resultsModal.show();
}

function processOptions(form){
/* Needs to find the index of the selected form field e.g. harsh, strict, and only display the associated errors */
/* Now I'm a bit confused about what we just added in to force the form criteria to be comma selected */
/* why did we do that? - does the resulting screen display all errors, sometimes it shows 4, sometimes it shows 15, sometimes it shows 19? */
  
let optArray=[];
for (let entry of form.entries()) {
    if (entry[0]==="options") {
        optArray.push(entry[1]);
    }
    }
    form.delete("options");
    form.append("options", optArray.join());
    return form;
}
async function postForm(e) {
    /* grab the from data using javascript utility FormData() which pulls together all the data on a particular form into an object */
    /* Our form id (from html) is checksform */
    /* FormData has a number of methods to allow access to the data */
    /* e.g. entries which iterates through the form entries */
    const form = processOptions(new FormData(document.getElementById("checksform")));
    for (let e of form.entries()) {
        console.log(e);
    }

    const response = await fetch(API_URL, {
        method: "POST", 
        headers: {
                    "Authorization": API_KEY,
                 },
        body: form,
    });
      

    const data = await response.json();
     if (response.ok) {
        console.log(data);
        displayErrors(data);
     }  else {
    /* Need to add some error handling here for failed API calls */
    /* Think something to do with error status code... */
    console.log (data);
    displayException(data);
    throw new Error(data.error);
 }
}

function displayErrors(data) {
    let heading = 'JSHint results for ${data.file}';
    if (data.total_errors === 0) {
        results = '<div class="no_errors">No errors found</div>' ;
    }  else {
        results = '<div>Total Errors: <span class="error_count">' + data.total_errors;
        for (let error of data.error_list) {
            /* would really like to be able to show the error number but nevermind:
            results += '<div>'+ findIndex() +': At line <span class="line">'+error.line+'</span>, ' */
            results += '<div> At line <span class="line">'+error.line+'</span>, '
            results += 'col <span class="column">'+error.col +'</span></div>'
            results += '<div class="error"> '+error.error + '</div> '
    }

    modalTitle = document.getElementById("resultsModalTitle");
    modalTitle.innerHTML = heading
    modalBody = document.getElementById("results-content");
    modalBody.innerHTML  = results;   
    resultsModal.show();
    }
}