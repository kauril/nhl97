'use strict';

let currentSortParam = document.querySelector('.active').getAttribute('value');

const socket = io.connect('http://localhost:8080', {
    secure: true
});

socket.on('newgame', (msg) => {
  console.log('newgame');
    getStatistics(currentSortParam);
});

socket.on('newteam', (team) => {
    getStatistics(currentSortParam);
});

const populateView = (results) => {
    const overallTable = document.querySelector('.overall-table-body');
    for (let result of results) {
        const resultItem = `<tr>
      <th scope="row">${result.team}</th>
      <td>${result.wins}</td>
      <td>${result.loses}</td>
      <td>${result.goalsFor}</td>
      <td>${result.goalsAgainst}</td>
      <td>${result.shotsFor}</td>
      <td>${result.shotsAgainst}</td>
    </tr>`;
        overallTable.innerHTML += resultItem;
    }
}

$("#sortCarousel").on('slid.bs.carousel', () => {
    currentSortParam = document.querySelector('.active').getAttribute('value');
    getStatistics(currentSortParam);
});

const getStatistics = (param) => {
    fetch(`/overall_statistics/${param}`, {
        method: 'GET'
    }).then((response) => {
        return response.json();
    }).then((result) => {
    	const overallTable = document.querySelector('.overall-table-body');
    overallTable.innerHTML = '';
        populateView(result);
    }).catch((e) => {
        console.log(e);
    });
}



getStatistics(currentSortParam);