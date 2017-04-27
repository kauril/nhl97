'use strict';
let teamData;

const socket = io.connect('http://localhost:8080', {
    secure: true
});
socket.on('newgame', function(msg) {
    fetch('/teams', {
        method: 'GET'
    }).then((response) => {
        return response.json();
    }).then((json) => {
        teamData = json;
        const currentTeam = document.querySelector('.active').getAttribute('value');
    
    for (let item of teamData) {
        if (item['team'] === currentTeam) {
            const title = document.querySelector('.title');
            const stats = document.querySelector('.stats');
            title.innerHTML = '';
            stats.innerHTML = '';
            populateViewWithTeamStatistics(item);
        }
    }
        
    }).catch((e) => {
        console.log(e);
    });

});
socket.on('newteam', function(team) {
    teamData.push(team);
    addNewTeamToCarousel(team);
});

const addNewTeamToCarousel = (team) => {
    const carousel = document.querySelector('.carousel-inner');
    const carouselItem = `<div class="carousel-item team-item" value=${team.team}><p class="teamChar">${team.teamChar}</p></div>`;
            carousel.innerHTML += carouselItem;
};


const populateCarousel = (teams) => {
    const carousel = document.querySelector('.carousel-inner');
    let index = 0;
    for (let team of teams) {
        if (index === 0) {
            const carouselItem = `<div class="carousel-item active team-item" value=${team.team}><p class="teamChar">${team.teamChar}</p></div>`;
            carousel.innerHTML += carouselItem;
            populateViewWithTeamStatistics(team);
            index++
        } else {
            const carouselItem = `<div class="carousel-item team-item" value=${team.team}><p class="teamChar">${team.teamChar}</p></div>`;
            carousel.innerHTML += carouselItem;
        }
    }
}



$("#teamCarousel").on('slid.bs.carousel', () => {
    const currentTeam = document.querySelector('.active').getAttribute('value');
    socket.emit('message', 'this is a message send by client');
    for (let item of teamData) {
        if (item['team'] === currentTeam) {
            const title = document.querySelector('.title');
            const stats = document.querySelector('.stats');
            title.innerHTML = '';
            stats.innerHTML = '';
            populateViewWithTeamStatistics(item);
        }
    }
});

const clearWhiteSpacesFromTeamNamesForFetch = (team) => {
    team = team.replace(' ', '%20');
    return team;
}

const populateViewWithTeamStatistics = (team) => {
    const title = document.querySelector('.title');
    const stats = document.querySelector('.stats');
    for (let key in team) {
        if (team.hasOwnProperty(key)) {

            if (key != '_id' && key != '__v') {
                const titleElem = document.createElement('p');
                titleElem.innerHTML = key;
                title.appendChild(titleElem);
                const stat = document.createElement('p');
                stat.innerHTML = team[key];
                stats.appendChild(stat);
            }

        }
    }
}

const getTeamStatistics = (team) => {
    fetch(`/team/${team}`, {
        method: 'GET'
    }).then((response) => {
        return response.json();
    }).then((json) => {
        populateViewWithTeamStatistics(json);
    }).catch((e) => {
        console.log(e);
    });
}

const createDropDownItemClickListeners = () => {
    const dropDownItems = document.querySelectorAll('.team-item');
    for (let item of dropDownItems) {
        item.addEventListener('click', () => {
            let team = item.innerHTML;
            let clearedTeam = clearWhiteSpacesFromTeamNamesForFetch(team);
            getTeamStatistics(clearedTeam);
        });
    }
}

const getTeams = () => {
    fetch('/teams', {
        method: 'GET'
    }).then((response) => {
        return response.json();
    }).then((json) => {
        teamData = json;
        populateCarousel(json);
        
    }).catch((e) => {
        console.log(e);
    });
}

getTeams();