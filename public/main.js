'use strict';



const populateDropDown = (teams) => {
    const dropDown = document.querySelector('#teamDropdown');
    for (let item of teams) {
        console.log(item.team);
        const dropDownItem = `<a class="dropdown-item team-item" href="#" value=${item._id}>${item.team}</a>`;
        dropDown.innerHTML += dropDownItem;
    }
}

const clearWhiteSpacesFromTeamNamesForFetch = (team) => {
    team = team.replace(' ', '%20');
    return team;
}

const populateViewWithTeamStatistics = (team) => {
    const title = document.querySelector('.title');
    const stats = document.querySelector('.stats');
    title.innerHTML = "";
    stats.innerHTML = "";
    for (let key in team[0]) {
        if (team[0].hasOwnProperty(key)) {
            if (key === 'teamChar') {
                const logo = document.querySelector('#team');
                logo.innerHTML = team[0][key];
            } else {
                if (key != '_id' && key != '__v') {
                    const titleElem = document.createElement('p');
                    titleElem.innerHTML = key;
                    title.appendChild(titleElem);
                    const stat = document.createElement('p');
                    stat.innerHTML = team[0][key];
                    stats.appendChild(stat);
                }
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
        populateDropDown(json);
        createDropDownItemClickListeners();
    }).catch((e) => {
        console.log(e);
    });
}

getTeams();