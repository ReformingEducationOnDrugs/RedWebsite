const { promisify } = require('util');
const {successResponse, errorResponse,authenticate,getSheetByName,convertPresentation,convertTime} = require('./presentationUtil');

exports.handler = function(event, context, callback) {
  console.log('START: Received request.');
  const {identity} = context.clientContext;
  fetch(`${identity.url}/user`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${identity.token}` }
  }).then(response => console.log(response));

  getPresentationForEmail(JSON.parse(event.body).user.email)
    .then(response => successResponse(callback,response))
    .catch(error => errorResponse(callback, error));
};


//Curl command for testing
//curl --header "Content-Type: application/json" --request POST --data @src/functions/payload.json localhost:9000/getPresentations
// getPresentationForEmail("kouroshb26@gmail.com")
//   .then(response => successResponse(function(){},response))
//   .catch(error => errorResponse(function(){}, error));


async function getPresentationForEmail(email){
  let response = { "user":{"email":email},
    "data":[]};

  let doc = await authenticate();
  let presentationSheet = await getSheetByName(doc,"Presentation"); //Master spread sheet denoting all presentations we have

  let presentations =  await promisify(presentationSheet.getRows)({  //Get presentation information
    offset: 1,
    limit: 100,
  });

  let promises = [];
  for (let presentationRow of presentations){
    //Don't process empty presentations
    if(presentationRow.sheetname === "" || presentationRow.sheetname === null|| presentationRow.sheetname === "()"){
      continue;
    }
    //Don't show information about past presentations
    if(new Date(presentationRow.date) < Date.now()){
      continue;
    }
    promises.push(getPresentation(doc,email,presentationRow));
  }

  response.data = await Promise.all(promises); //Wait till all presentations are gathered

  //remove ones that had errors out and sort based on date
  response.data = response.data
    .filter(presentation => presentation !== null)
    .sort((a,b) => new Date(a.date) - new Date(b.date));

  return response;
}


async function getPresentation(doc, email, presentationRow){

  try {
    let timeSheet = await getSheetByName(doc, presentationRow.sheetname); //Get sheet

    let times = await promisify(timeSheet.getRows)({ //Get rows
      offset: 1,
      limit: 100,
    });

    let presentation = convertPresentation(presentationRow); //Convert presentationRow to meet our API

    for (let timeRow of times) {  //Convert the times to meet out API
      presentation.times.push(convertTime(timeRow, email));
    }
    return presentation;

  }catch (e) {//Log errors
    console.log(e);
    return null;
  }
}

