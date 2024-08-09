/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                wregular: ["WorkSans-Regular", "sans-serif"],
                wmedium: ["WorkSans-Medium", "sans-serif"],
                wsemibold: ["WorkSans-SemiBold", "sans-serif"],
                rbold : ["RedHatText-Bold", "sans-serif"]
            }
        },
    },
    plugins: [],
}

