// frontend/tailwind.config.js
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                headerBg: "#e9ab6c59",
                footerBg: "#5a8ee77c",
                dacazBlue: "#022CDC",
                dacazBlueDark: "#021f9c",
                footerText: "#bbb",
            },
            fontFamily: {
                audiowide: ["Audiowide", "cursive"],
            },
            backgroundImage: {
                pageGradient: "linear-gradient(to bottom, theme('colors.footerBg'), theme('colors.headerBg'))",
                pageGradientInverse: "linear-gradient(to top, theme('colors.footerBg'), theme('colors.headerBg'))",
            },
        },
    },
    plugins: [],
}
