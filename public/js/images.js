// Initialize Firebase
const config = {
    apiKey: "AIzaSyCgbZRG3O3UhT-4JDkSOcoP-Fnj5zSDYOY",
    authDomain: "nhl97-db00e.firebaseapp.com",
    databaseURL: "https://nhl97-db00e.firebaseio.com",
    projectId: "nhl97-db00e",
    storageBucket: "nhl97-db00e.appspot.com",
    messagingSenderId: "890172597821"
};
firebase.initializeApp(config);

// Get a reference to the database service
const database = firebase.database();
const ref = firebase.database().ref('urls');

const row = document.querySelector('.row');
console.log(row);

ref.on("value", function(snapshot) {
	row.innerHTML = null;
    snapshot.forEach(function(childSnapshot) {

        const childData = childSnapshot.val();
        console.log(childData);

        row.innerHTML += `<div class="gallery">
  <a target="_blank" href=${childData.url}>
    <img src=${childData.url} alt="image" width="300" height="200">
  </a>
  <div class="desc">${childData.guestTeam} ${childData.guestGoals} - ${childData.homeGoals} ${childData.homeTeam}</div>
</div>
  `;
    });
}, function(error) {
    console.log("Error: " + error.code);
});

