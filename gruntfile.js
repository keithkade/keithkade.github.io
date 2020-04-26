/*global module*/
module.exports = function(grunt) {
  grunt.initConfig({
    imagemin: {
        jpg: {
          options: {
            progressive: true
          },
          files: [
            {
              expand: true,
              cwd: 'img/',
              src: ['**/*.jpg'],
              dest: 'img/compressed/',
              ext: '.jpg'
            }
          ]
        },
        png: {
            files: [
            {
              expand: true,
              cwd: 'img/',
              src: ['**/*.png'],
              dest: 'img/compressed/',
              ext: '.png'
            }
          ]
        }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.registerTask('default', ['imagemin']);
};
