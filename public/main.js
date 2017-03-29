const fetchJson = () => {

    const myRequest = new Request('data.json');

    const fetchData = fetch(myRequest).then((response) => {
            return response.json();
}).then((json) => {
        console.log(json);

        const title = document.querySelector('.title');
        const stats = document.querySelector('.stats');
        $('.dropdown-item').click(function() {
            console.log( $(this).text() );
            for (let item of json) {

                if (item.team === $(this).text() ) {
                    title.innerHTML = "";
                    stats.innerHTML = "";
                    for (let key in item) {
                        if (item.hasOwnProperty(key)) {

                            if (key === 'char'){
                                const logo = document.querySelector('#team');
                                logo.innerHTML = item[key];
                            } else {
                                console.log(key + " -> " + item[key]);
                                const titleElem = document.createElement('p');
                                titleElem.innerHTML = key;
                                title.appendChild(titleElem);
                                const stat = document.createElement('p');
                                stat.innerHTML = item[key];
                                stats.appendChild(stat);
                            }
                        }
                    }
                }
            }
        });





}).catch((e) => {
        console.log(e);
});
};

fetchJson();