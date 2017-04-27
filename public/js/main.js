'use strict';

const socket = io.connect('http://localhost:8080', {
    secure: true
});
socket.on('newgame', function(msg) {
    const resultTable = document.querySelector('.result-table-body');
    resultTable.innerHTML = '';
    getGames();
});

const populateView = (games) => {
    const resultTable = document.querySelector('.result-table-body');
    for (let game of games) {
        console.log(game);
        console.log(game.guestTeam);
        const gameItem = `<tr>
      <th scope="row">${game.date}</th>
      <td>${game.guestTeam}</td>
      <td>${game.guestGoals}</td>
      <td>${game.homeGoals}</td>
      <td>${game.homeTeam}</td>
      <td>${game.guestShots}</td>
      <td>${game.homeShots}</td>
      <td>${game.isOvertime}</td>
      <td>${game.isShootout}</td>
    </tr>`;
        resultTable.innerHTML += gameItem;
    }
}
const getGames = () => {
    fetch('/games', {
        method: 'GET'
    }).then((response) => {
        return response.json();
    }).then((games) => {
        populateView(games);
    }).catch((e) => {
        console.log(e);
    });
}
getGames();