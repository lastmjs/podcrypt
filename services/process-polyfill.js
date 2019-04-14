window.process = {
    env: {
        NODE_ENV: window.location.hostname === 'podcrypt.app' ? 'production' : window.location.hostname.includes('.netlify.com') ? 'staging' : 'development',
        testing: true
    },
    argv: []
};