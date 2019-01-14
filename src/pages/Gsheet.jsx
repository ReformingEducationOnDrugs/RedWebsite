import React from "react";

export default function Gsheet() {
  document.title = "RED | Vision";
  callGetPresentation({user:{email:"kouroshb26@gmail.com"}});

  return (
    <main>
      <div className="container">
        <h1>Google Sheet Data</h1>
      </div>


    </main>
  );
}



function callGetPresentation(data) {
  return fetch('/.netlify/functions/getPresentations', {
    body: JSON.stringify(data),
    method: 'POST',
  }).then(function(response) {
    return response.json();
  }).then(function(data) {
    console.log(data);  // { "userId": 1, "id": 1, "title": "...", "body": "..." }
  });
}






