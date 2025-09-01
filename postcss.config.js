export default {
  plugins: [
    require('postcss-import'),
    require('postcss')({
      // Add any additional PostCSS plugins here if needed
    })
  ]
};
