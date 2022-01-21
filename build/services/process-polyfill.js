window.process = {
    env: {
        NODE_ENV: window.location.hostname === 'ovwc5-5yaaa-aaaae-qaa5a-cai.ic0.app' ? 'production' : window.location.hostname.includes('.netlify.com') ? 'staging' : 'development',
        testing: false
    },
    argv: []
};