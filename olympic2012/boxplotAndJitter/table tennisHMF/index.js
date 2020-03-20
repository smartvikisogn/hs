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
      let sport = 'table tennis',
        title = sport.charAt(0).toUpperCase() + sport.slice(1);

      let maleWeight = [],
        maleWeightJitter = [],
        maleHeight = [],
        maleHeightJitter = [],
        femaleWeight = [],
        femaleWeightJitter = [],
        femaleHeight = [],
        femaleHeightJitter = [];
      let maleColor = 'blue',
        maleColorJitter = '#5DADE2',
        femaleColor = 'red',
        femaleColorJitter = '#F1948A';

      function boxplotParameters(arr, color) {
        let min, q1, median, q3, max;
        min = jStat.min(arr);
        q1 = jStat.quartiles(arr)[0];
        median = jStat.quartiles(arr)[1];
        q3 = jStat.quartiles(arr)[2];
        max = jStat.max(arr);
        return {
          low: min,
          q1: q1,
          median: median,
          q3: q3,
          high: max,
          color: color
        };
      }

      Highcharts.getJSON(
        'https://raw.githubusercontent.com/mekhatria/demo_highcharts/master/olympic2012.json?callback=?',
        function(data) {
          //weight
          data.forEach(elm => {
            if (elm.sport == sport && elm.weight > 0 && elm.height > 0) {
              if (elm.gender == 'male') {
                maleWeight.push(elm.weight);
                maleWeightJitter.push([0, elm.weight]);
                maleHeight.push(elm.height);
                maleHeightJitter.push([0, elm.height]);
              } else {
                femaleWeight.push(elm.weight);
                femaleWeightJitter.push([1, elm.weight]);
                femaleHeight.push(elm.height);
                femaleHeightJitter.push([1, elm.height]);
              }
            }
          });

          let maleBoxplotHeight = [],
            femaleBoxplotHeight = [];
          maleBoxplotHeight = boxplotParameters(maleHeight, maleColor);
          femaleBoxplotHeight = boxplotParameters(femaleHeight, femaleColor);

          Highcharts.chart('container-' + sport, {
            chart: {
              type: 'boxplot',
              height: 150 + '%',
              marginLeft: 35
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
            credits: { enabled: false },
            xAxis: {
              categories: ['M', 'F'],
              title: {
                text: null
              },
              labels: {
                enabled: false
              },
              lineWidth: 0,
              startOnTick: true,
              endOnTick: true,
              showLastLabel: true
            },
            yAxis: {
              title: {
                text: null
              },
              labels: {
                format: '{value}'+'<br/>m',
                style: {
                  fontSize: '8px'
                }
              },
              startOnTick: false,
              endOnTick: false,
              min: 1.3,
              max: 2.2
            },
            legend: {
              enabled: false
            },
            plotOptions: {
              scatter: {
                marker: {
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
outside:true,
              formatter: function() {
                if (this.series.userOptions.type === 'scatter') {
                  return this.y + ' m';
                } else {
                  return (
                    'Max: ' +
                    this.point.high +
                    'm <br/> Q3: ' +
                    this.point.q3 +
                    'm<br/>Median: ' +
                    this.point.median +
                    'm<br/>Q1: ' +
                    this.point.q1 +
                    'm<br/>Min: ' +
                    this.point.low +
                    'm'
                  );
                }
              }
            },

            series: [
              {
                name: 'male jitter',
                type: 'scatter',
                inverted: true,
                data: maleHeightJitter,
                jitter: {
                  x: 0.24
                },
                marker: {
                  radius: 1
                },
                color: maleColorJitter
              },
              {
                name: 'female jitter',
                type: 'scatter',
                inverted: true,
                data: femaleHeightJitter,
                jitter: {
                  x: 0.24
                },
                marker: {
                  radius: 1
                },
                color: femaleColorJitter
              },
              {
                name: title + ' male',
                color: maleColor,
                fillColor: 'transparent',
                data: [maleBoxplotHeight, femaleBoxplotHeight]
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
