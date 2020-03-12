(function() {
  var highcharts = document.createElement('script');
  var cdn = 'https://code.highcharts.com/';
  var loaded = 0;

  var scripts = [
    'highcharts.js',
    'modules/stock.js',
    'highcharts-more.js',
    'highcharts-3d.js',
    'modules/data.js',
    'modules/exporting.js',
    'modules/funnel.js',
    'modules/solid-gauge.js',
    'modules/export-data.js',
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
      //put my chart in here
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
