fetch(`nhl97.jelastic.metropolia.fi/teams`, {method: 'GET'}).then((response) => {
    return response.json();
}).then((json) => {
    const dropDown = document.querySelector('#teamDropdown');
    for (let item of json){
        console.log(item.team);
        const dropDownItem = `<a class="dropdown-item team-item" href="#" value=${item._id}>${item.team}</a>`;
        dropDown.innerHTML += dropDownItem;
    }
    const dropDownItems = document.querySelectorAll('.team-item');
    console.log(dropDownItems);
    const title = document.querySelector('.title');
    const stats = document.querySelector('.stats');

    for(let item of dropDownItems){
        item.addEventListener('click', () => {
            let team = item.innerHTML;
            team = team.replace(' ', '%20');
            console.log(team);
            fetch(`http://localhost:3000/team/${team}`, {method: 'GET'}).then((response) => {
                return response.json();
            }).then((json) => {
                title.innerHTML = "";
                stats.innerHTML = "";
                for (let key in json[0]) {
                    if (json[0].hasOwnProperty(key)) {

                        if (key === 'char'){
                            const logo = document.querySelector('#team');
                            logo.innerHTML = json[0][key];
                        } else {
                            if (key === '_id'){

                            }else {
                                console.log(key + " -> " + json[0][key]);
                                const titleElem = document.createElement('p');
                                titleElem.innerHTML = key;
                                title.appendChild(titleElem);
                                const stat = document.createElement('p');
                                stat.innerHTML = json[0][key];
                                stats.appendChild(stat);
                            }
                        }
                    }
                }
                console.log(json);
            }).catch((e) => {
                console.log(e);
            });
        });
    }

}).catch((e) => {
    console.log(e);
});





/*const title = document.querySelector('.title');
const stats = document.querySelector('.stats');

for(let item of dropDown){
    item.addEventListener('click', () => {
        let team = item.innerHTML;
        team = team.replace(' ', '%20');
        console.log(team);
        fetch(`http://localhost:3000/team/${team}`, {method: 'GET'}).then((response) => {
            return response.json();
        }).then((json) => {
            title.innerHTML = "";
            stats.innerHTML = "";
            for (let key in json[0]) {
                if (json[0].hasOwnProperty(key)) {

                    if (key === 'char'){
                        const logo = document.querySelector('#team');
                        logo.innerHTML = json[0][key];
                    } else {
                        if (key === '_id'){

                        }else {
                            console.log(key + " -> " + json[0][key]);
                            const titleElem = document.createElement('p');
                            titleElem.innerHTML = key;
                            title.appendChild(titleElem);
                            const stat = document.createElement('p');
                            stat.innerHTML = json[0][key];
                            stats.appendChild(stat);
                        }
                    }
                }
            }
            console.log(json);
        }).catch((e) => {
            console.log(e);
        });
    });
}*/



