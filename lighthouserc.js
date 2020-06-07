module.exports = {
    ci: {
        collect: {
            startServerCommand: 'npm start',
            url: ['http://localhost:3000/'],
            settings: {
                // Don't run certain audits
                "skipAudits": ["redirects-http"],
                // Don't clear localStorage/IndexedDB/etc before loading the page.
                "disableStorageReset": true,
                // Wait up to 90s for the page to load
                "maxWaitForLoad": 90000,
                // Use applied throttling instead of simulated throttling
                "throttlingMethod": "devtools"
            }
        },
        upload: {
            target: 'lhci',
            serverBaseUrl: 'https://cryptic-falls-13846.herokuapp.com/',
            token: process.env.LHCI_TOKEN
        },
    },
};
