const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = {
    plugins: {
        tailwindcss: { config: './assets/config/tailwind.config.js' },
        autoprefixer: {},
    }
};
