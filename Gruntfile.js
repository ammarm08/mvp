module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      dist: {
        src: ['client/app/*.js'],
        dest: 'dist/app.js'
      },
      vendor: {
        src: ['client/lib/angular/angular.js', 'client/lib/angular-route/angular-route.js'],
        dest: 'dist/vendor.js'
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    cssmin: {
        css : {
          src: ['client/styles/style.css'],
          dest: 'dist/style.min.css'
        }
    },

    watch: {
      scripts: {
        files: [
          'client/app/*.js',
          'client/lib/**/*.js',
        ],
        tasks: [
          'concat'        ]
      },
      css: {
        files: 'client/styles/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: 'git push azure master' 
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {

    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  grunt.registerTask('build', [ 
    'concat', 'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      grunt.task.run(['shell:prodServer']);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
      'build', 'upload'
  ]);


};