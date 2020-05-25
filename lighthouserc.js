module.exports = {
    ci: {
        upload: {
            target: 'lhci',
            serverBaseUrl: 'https://cryptic-falls-13846.herokuapp.com/',
            token: process.env.LHCI_TOKEN, // could also use LHCI_TOKEN variable instead
        },
    },
};