fetch('/firebase', {
    method: 'GET', // or 'PUT'
    headers: {
        'Content-Type': 'application/json'
    }
}).then(res => res.json())
    .then(response => {

        const images = Array.from(Object.values(response), ele => ele);
        const row = document.querySelector('.row');
        row.innerHTML = '';
        images.forEach(function (childData) {
            row.innerHTML +=
                `<div class="gallery">
                <a target="_blank" href=${childData.url}>
                    <img src=${childData.url} alt="image" width="300" height="200">
                </a>
                <div class="desc">${childData.guestTeam} ${childData.guestGoals} - ${childData.homeGoals} ${childData.homeTeam}</div>
            </div>`
                ;
        })
    })
    .catch(error => console.error('Error:', error));



