export function getEntities() {
    return new Promise((resolve, reject) => {
        fetch('/data/lastmod')
            .then(data => data.json())
            .then(data => {
        if (localStorage.getItem('lastMod')) {
            const locLastMod = localStorage.getItem('lastMod');
                    if (data.lastModified === locLastMod) {
                        resolve(JSON.parse(localStorage.getItem('dataset')))
                    } else {
                        getRemoteEntities()
                            .then(dataset => {
                                localStorage.setItem('lastMod', data.lastModified)
                                localStorage.setItem('dataset', JSON.stringify(dataset))
                                resolve(dataset);
                            })
                            .catch(err => {
                                console.error(err);
                            })
                    }

        } else {

            getRemoteEntities()
                .then(dataset => {
                    localStorage.setItem('lastMod', data.lastModified)
                    localStorage.setItem('dataset', JSON.stringify(dataset))
                    resolve(dataset);
                })
                .catch(err => {
                    console.error(err);
                })
        }

        function getRemoteEntities() {
            return new Promise((resolve, reject) => {
                fetch("/data/getentities")
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
    });
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

export function clearDataset() {
    triggerLoading();
    clearEntities().then(() => {
        window.location.href = "/";
    })
}

function triggerLoading() {
    const main = document.querySelector('main');
    const loading = document.querySelector('.loading');
    main.classList.toggle('blurred');
    loading.classList.toggle('inactive');
    loading.classList.toggle('active');
}
