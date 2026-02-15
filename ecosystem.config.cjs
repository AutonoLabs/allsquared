module.exports = {
  apps: [{
    name: 'allsquared',
    script: 'dist/index.js',
    cwd: '/Users/claudia/clawd/allsquared-repo',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      PORT: 3300,
    },
    env_file: '.env.production',
    error_file: '/Users/claudia/clawd/allsquared-repo/logs/error.log',
    out_file: '/Users/claudia/clawd/allsquared-repo/logs/out.log',
    log_file: '/Users/claudia/clawd/allsquared-repo/logs/combined.log',
    time: true,
  }]
};
