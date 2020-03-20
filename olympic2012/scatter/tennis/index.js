(function() {
  var highcharts = document.createElement('script');
  var cdn = 'https://code.highcharts.com/';
  var loaded = 0;

  var scripts = [
    'highcharts.js',
    'highcharts-more.js',
    'modules/data.js',
    'modules/accessibility.js',
    'https://cdn.jsdelivr.net/npm/jstat@latest/dist/jstat.min.js'
    /* "modules/series-label.js" */
  ];
  var externalCSS = [];
  function isScriptAlreadyIncluded(src) {
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].hasAttribute('src')) {
        const scriptTag = scripts[i].getAttribute('src') || '';
        if (
          scriptTag.indexOf(src) >= 0 ||
          (scriptTag.indexOf('highcharts.src.js') > -1 &&
            src === 'highcharts.js') ||
          (scriptTag.indexOf('stock/highstock.js') > -1 &&
            src === 'modules/highstock.js')
        ) {
          return true;
        }
      }
    }
    return false;
  }
  function loadCSS() {
    var cssLength = externalCSS.length;
    for (var i = 0; i < cssLength; i++) {
      var css = document.createElement('link');
      css.rel = 'stylesheet';
      css.type = 'text/css';
      css.href = externalCSS[i];
      document.body.appendChild(css);
    }
  }
  function createChart() {
    if (typeof window['Highcharts'] !== 'undefined') {
      let sport = 'tennis',
        title = sport.charAt(0).toUpperCase() + sport.slice(1);

      let male = [],
        female = [];
      let maleColor = 'rgb(30,144,255, 0.5)',
        femaleColor = 'rgb(255,30,144, 0.2)';

      Highcharts.getJSON(
        'https://raw.githubusercontent.com/mekhatria/demo_highcharts/master/olympic2012.json?callback=?',
        function(data) {
          data.forEach(elm => {
            if (elm.sport == sport && elm.weight > 0 && elm.height > 0) {
              if (elm.gender == 'male') {
                male.push({
                  x: elm.height,
                  y: elm.weight,
                  country: elm.country
                });
              } else {
                female.push({
                  x: elm.height,
                  y: elm.weight,
                  country: elm.country
                });
              }
            }
          });
          Highcharts.chart('container-' + sport + 'Scatter', {
            chart: {
              type: 'scatter',
              zoomType: 'xy',
              height: 110 + '%',
              marginLeft: 30,
              marginRight: -1
              //margin: [0, 0, 0, 0]
            },
            accessibility: {
              description: ''
            },
            title: {
              text: title,
              margin: 0,
              style: {
                fontSize: '10px'
              }
            },
            xAxis: {
              title: {
                text: null
              },
              labels: {
                format: '{value}m',
                style: { fontSize: '8px' }
              },

              startOnTick: false,
              endOnTick: false,
              min: 1.3,
              max: 2.2
            },
            yAxis: {
              title: {
                text: null
              },
              labels: {
                format: '{value}' + '<br/>kg',
                style: { fontSize: '8px' }
              },
              startOnTick: false,
              endOnTick: false,
              min: 25,
              max: 180
            },
            legend: {
              enabled: false
            },
            credits: { enabled: false },
            plotOptions: {
              scatter: {
                marker: {
                  lineColor: 'rgb(100,100,100)',
                  lineWidth: 0.2,
                  radius: 3,
                  symbol: 'circle',
                  states: {
                    hover: {
                      enabled: true,
                      lineColor: 'rgb(100,100,100)'
                    }
                  }
                },
                states: {
                  hover: {
                    marker: {
                      enabled: false
                    }
                  }
                }
              }
            },
            tooltip: {
              pointFormat: 'Height: {point.x} m <br/> Weight: {point.y} kg',
              outside: true
            },

            series: [
              {
                name: title + ' male',
                turboThreshold: 15000,
                color: maleColor,
                data: male
              },
              {
                name: title + ' female',
                turboThreshold: 15000,
                color: femaleColor,
                data: female
              }
            ]
          });
        }
      );
    }
  }
  function check() {
    if (loaded === scripts.length) {
      for (var i = 0; i < window.marketingDemo.ondone.length; i++) {
        try {
          window.marketingDemo.ondone[i]();
        } catch (e) {
          console.error(e);
        }
      }
    }
    window.marketingDemo.hasLoaded = true;
  }
  function loadScript(s) {
    if (!s) next();
    function next() {
      ++loaded;
      if (loaded < scripts.length) {
        loadScript(scripts[loaded]);
      }
      check();
    }
    if (isScriptAlreadyIncluded(s)) {
      return next();
    }
    var n = document.createElement('script');
    n.onload = function() {
      next();
    };
    if (s.indexOf('https') >= 0) {
      n.src = s;
    } else {
      n.src = cdn + s;
    }
    document.body.appendChild(n);
  }
  if (typeof window['marketingDemo'] === 'undefined') {
    window.marketingDemo = {
      ondone: [createChart],
      hasWrapped: false,
      hasLoaded: false
    };
    loadScript(scripts[0]);
    loadCSS();
  } else {
    if (window.marketingDemo.hasLoaded) {
      createChart();
    } else {
      window.marketingDemo.ondone.push(createChart);
    }
  }
})();
