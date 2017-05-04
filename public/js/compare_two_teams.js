let teamData;
let team1;
let team2;



const addNewTeamToCarousels = (team) => {
	console.log('socket');
	console.log(team);
};
const populateCarousel = (teams) => {
    const carousel1 = document.querySelector('#carousel1');
    const carousel2 = document.querySelector('#carousel2');
    carousel1.innerHTML = null;
    carousel2.innerHTML = null;
    let index = 0;
    for (let team of teams) {
        if (index === 0) {
            const carouselItem = `<div class="carousel-item active team-item" value=${team.team}><p class="teamChar">${team.teamChar}</p></div>`;
            const carouselItem2 = `<div class="carousel-item active team-item team2" value=${team.team}><p class="teamChar">${team.teamChar}</p></div>`;
            carousel1.innerHTML += carouselItem;
            carousel2.innerHTML += carouselItem2;
            team1 = document.querySelector('.active').getAttribute('value');
            team2 = document.querySelector('div.carousel-item.active.team-item.team2').getAttribute('value');
            leftTableHeader = document.querySelector('#teamOnLeft');
            leftTableHeader.innerHTML = team1;
            rightTableHeader = document.querySelector('#teamOnRight');
            rightTableHeader.innerHTML = team2;
            index++
        } else {
            const carouselItem = `<div class="carousel-item team-item" value=${team.team}><p class="teamChar">${team.teamChar}</p></div>`;
            const carouselItem2 = `<div class="carousel-item team-item team2" value=${team.team}><p class="teamChar">${team.teamChar}</p></div>`;
            carousel1.innerHTML += carouselItem;
            carousel2.innerHTML += carouselItem2;
        }
    }
}



const populateViewWithTeamStatistics = (rightTeam) => {
    const compareTable = document.querySelector('.compare-table-body');
    compareTable.innerHTML = null;
    console.log(rightTeam);


    const statRow = `<tr>
      <td>${rightTeam.loses}</td>
      <td>Wins</td>
      <td>${rightTeam.wins}</td> 
    </tr>
    <tr>
      <td>${rightTeam.guestLoses}</td>
      <td>Home Wins</td>
      <td>${rightTeam.homeWins}</td> 
    </tr>
    <tr>
      <td>${rightTeam.homeLoses}</td>
      <td>Guest Wins</td>
      <td>${rightTeam.guestWins}</td> 
    </tr>
    <tr>
      <td>${rightTeam.goalsAgainst}</td>
      <td>Goals For</td>
      <td>${rightTeam.goalsFor}</td> 
    </tr>
    <tr>
      <td>${rightTeam.shotsAgainst}</td>
      <td>Shots For</td>
      <td>${rightTeam.shotsFor}</td> 
    </tr>
    <tr>
      <td>Overtimes</td>
      <td>${rightTeam.overtimes}</td> 
    </tr>
    <tr>
      <td>${rightTeam.overtimeLoses}</td>
      <td>Overtime Wins</td>
      <td>${rightTeam.overtimeWins}</td> 
    </tr>
    <tr>
      <td>Shootouts</td>
      <td>${rightTeam.shootouts}</td> 
    </tr>
    <tr>
      <td>${rightTeam.shootoutLoses}</td>
      <td>Shootout Wins</td>
      <td>${rightTeam.shootoutWins}</td> 
    </tr>`;
    compareTable.innerHTML += statRow;

}

$("#teamCarousel1").on('slid.bs.carousel', () => {
    const currentTeam = document.querySelector('.active').getAttribute('value');
    team1 = currentTeam;
    leftTableHeader = document.querySelector('#teamOnLeft');
    leftTableHeader.innerHTML = team1;
    if (team1 === team2) {
        const compareTable = document.querySelector('.compare-table-body');
        compareTable.innerHTML = `<tr>
								      <td></td>
								      <td>No Statistics</td>
								      <td></td>
								    </tr>`;
    } else {
        for (let item of teamData) {
            if (item['team'] === team1) {
                for (let otherTeam of item.otherTeams) {
                    if (otherTeam.team === team2) {
                        populateViewWithTeamStatistics(otherTeam);
                    }
                }
            }
        }
    }
});

$("#teamCarousel2").on('slid.bs.carousel', () => {
    const currentTeam = document.querySelector('div.carousel-item.active.team-item.team2').getAttribute('value');
    team2 = currentTeam;
    rightTableHeader = document.querySelector('#teamOnRight');
    rightTableHeader.innerHTML = team2;
    if (team1 === team2) {
        const compareTable = document.querySelector('.compare-table-body');
        compareTable.innerHTML = `<tr>
								      <td></td>
								      <td>No Statistics</td>
								      <td></td>
								    </tr>`;
    } else {
        for (let item of teamData) {
            if (item['team'] === team1) {
                for (let otherTeam of item.otherTeams) {
                    if (otherTeam.team === team2) {
                        populateViewWithTeamStatistics(otherTeam);
                    }
                }
            }
        }
    }
});

const getTeams = () => {
    fetch('/teams', {
        method: 'GET'
    }).then((response) => {
        return response.json();
    }).then((teams) => {
        teamData = teams;
        populateCarousel(teams);
    }).catch((e) => {
        console.log(e);
    });
}

const socket = io.connect('http://localhost:8080', {
    secure: true
});
socket.on('newgame', function(msg) {

});
socket.on('newteam', function(team) {
    getTeams();
});

getTeams();