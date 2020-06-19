export function getEntities() {
    return new Promise((resolve, reject) => {
        fetch('/data/lastmod')
            .then(data => data.json())
            .then(data => {
                if (localStorage.getItem('lastMod') && localStorage.getItem('lastMod') === data.lastModified) {
                        getRemoteEntities('old')
                            .then(entities => {
                                resolve(entities)
                            })
                            .catch(err => {
                                reject(err);
                            })
                    } else {
                        getRemoteEntities('new')
                            .then(entities => {
                                localStorage.setItem('lastMod', data.lastModified)
                                resolve(entities);
                            })
                            .catch(err => {
                                reject(err);
                            })
                    }

                function getRemoteEntities(suffix) {
                    return new Promise((resolve, reject) => {
                        fetch(`/data/getentities/${suffix}`)
                            .then(res => {
                                if (res.ok) {
                                    return res.json();
                                } else {
                                    console.error(res.error());
                                    reject("Fetch failed");
                                }
                            })
                            .then(data => {
                                resolve(data);
                            });
                    })
                }
            })
            .catch(err => {
                reject(err)
            })
    })
}

function clearEntities() {
    return new Promise((resolve, reject) => {
        fetch("/data/clear", {
            method: "POST"
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    console.error(res.error());
                    reject(res.error());
                }
            })
            .then(data => {
                resolve(data);
            });
    })
}

export function addEntitiy(json) {
    return new Promise((resolve, reject) => {
        fetch("/data/addentity", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    console.error(res.error());
                    reject(res.error());
                }
            })
            .then(data => {
                resolve(data);
            });
    })
}

export function clearDataset() {
    toggleLoading();
    clearEntities().then(() => {
        window.location.href = "/";
    })
}

function toggleLoading() {
    const main = document.querySelector('main');
    const loading = document.querySelector('.loading');
    main.classList.toggle('blurred');
    loading.classList.toggle('inactive');
    loading.classList.toggle('active');
}
