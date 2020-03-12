(function () {
  var highcharts = document.createElement('script');

  var cdn = 'https://code.highcharts.com/';
  var loaded = 0;  
  var encodedUrl = encodeURI('https://https://cloud.highcharts.com//show/--GuppSmB');

  var scripts = [
    "highcharts.js",
    "modules/stock.js",
    "highcharts-more.js",
    "highcharts-3d.js",
    "modules/data.js",
    "modules/exporting.js",
    "modules/funnel.js",
    "modules/solid-gauge.js",
    "modules/export-data.js",
    "modules/accessibility.js"
    /* "modules/series-label.js" */
  ];

  var externalCSS = [
      ];

  var extraScripts = [
  "modules/annotations.js"
  ,"modules/annotations-advanced.js"
  ];

  var options = {"chart":{"backgroundColor":"#e8e8e8"},"title":{"text":""},"subtitle":{"text":""},"yAxis":[{"title":{"text":"Årlig befolkningsökning i procent"}}],"series":[{"data":[],"turboThreshold":0,"_colorIndex":0,"_symbolIndex":0,"type":"line"},{"data":[],"turboThreshold":0,"_colorIndex":1,"_symbolIndex":0,"type":"line"}],"plotOptions":{"series":{"animation":false}},"colors":["#4db4e7","#335cad"],"annotations":[],"credits":{"enabled":true,"text":"Powered by Highcharts Cloud","href":"https://cloud.highcharts.com","style":{"font-size":"16px"}},"data":{"csv":"null;Befolkningsökning %;Befolkningökning riket %\n1990;0.8;0.7\n1991;0.6;0.6\n1992;0.6;0.5\n1993;1.1;0.6\n1994;1.4;0.8\n1995;0.8;0.2\n1996;0.5;0.1\n1997;0.5;0\n1998;0.8;0.1\n1999;0.5;0.1\n2000;0.7;0.2\n2001;0.7;0.3\n2002;0.8;0.4\n2003;0.6;0.4\n2004;0.9;0.4\n2005;0.7;0.4\n2006;1.1;0.7\n2007;1.3;0.8\n2008;1.4;0.8\n2009;1.3;0.9\n2010;0.6;0.8\n2011;1.1;0.7\n2012;1.1;0.8\n2013;0.7;0.9\n2014;1.8;1\n2015;1.9;1\n2016;1.9;1.4\n2017;2;1.3\n2018;1.5;1.1\n2019;1.6;1","seriesMapping":[{"x":0,"y":1},{"x":0,"y":2}]},"stockTools":{"gui":{"enabled":false}}};

  function isScriptAlreadyIncluded(src){
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].hasAttribute('src')) {
        const scriptTag = scripts[i].getAttribute('src') || '';
        if ((scriptTag.indexOf(src) >= 0) || 
            (scriptTag.indexOf('highcharts.src.js') > -1 && src === 'highcharts.js') ||
            ((scriptTag.indexOf('stock/highstock.js') > -1) && src === 'modules/highstock.js')) {
          return true;
        }
      }
    }
    return false;
  }

  function loadCSS() {
    var cssLength = externalCSS.length;
    for(var i=0; i < cssLength; i++) {
      var css = document.createElement('link');
      css.rel  = 'stylesheet';
      css.type = "text/css";
      css.href = externalCSS[i];
      document.body.appendChild(css);
    }
  }

  function createChart() {
    if (typeof window['Highcharts'] !== 'undefined') {


    if (options.yAxis && options.yAxis.length === 1) options.yAxis = options.yAxis[0];
    if (options.xAxis && options.xAxis.length === 1) options.xAxis = options.xAxis[0];
    if (options.zAxis && options.zAxis.length === 1) options.zAxis = options.zAxis[0];

    /*
// Sample of extending options:
Highcharts.merge(true, options, {
    chart: {
        backgroundColor: "#bada55"
    },
    plotOptions: {
        series: {
            cursor: "pointer",
            events: {
                click: function(event) {
                    alert(this.name + " clicked\n" +
                          "Alt: " + event.altKey + "\n" +
                          "Control: " + event.ctrlKey + "\n" +
                          "Shift: " + event.shiftKey + "\n");
                }
            }
        }
    }
});
*/


      if (options && (options.lang || options.global)) {
        Highcharts.setOptions({
          global: options.global || {},
          lang: options.lang || {}
        });
      }

      if (Highcharts.Annotation) {
        Highcharts.Annotation.ControlPoint.prototype.redraw = function (animation) {
          this.graphic[animation ? 'animate' : 'attr'](
              this.options.positioner ? this.options.positioner.call(this, this.target) : null
          );
        };
      }
      
      window.HighchartsCloud.hasLoaded = true;
      new Highcharts.Chart('highcharts---GuppSmB', options);
    }
  }

  function check(scripts, cb) {
    if (loaded === scripts.length) {
      if (cb) {
        cb();
      } else {
        for (var i = 0; i < window.HighchartsCloud.ondone.length; i++) {
          try {
            window.HighchartsCloud.ondone[i]();
          } catch(e) {
            console.error(e);
          }
        }
      }
    }
  }

  function loadScript(s, scripts, cb) {
    if (!s) next();
    
    function next() {
      ++loaded;
      if (loaded < scripts.length) {
        loadScript(scripts[loaded], scripts, cb);
      }
      check(scripts, cb);
    }

    if (isScriptAlreadyIncluded(s)) {
      return next();
    }

    var n = document.createElement('script');

    n.onload = function () {
      next();
    };

    if (s.indexOf('https') >= 0) {
      n.src = s;
    } else {
      n.src = cdn + s;
    }
    document.body.appendChild(n);
  }

  function loadExtraScripts(){
    loaded = 0;
    if (extraScripts.length > 0) {
      loadScript(extraScripts[0], extraScripts);
    }
  }

  function loadExtraScriptsAndMakeChart(){
    loaded = 0;
    if (extraScripts.length > 0) {
      loadScript(extraScripts[0], extraScripts, createChart);
    }
  }

  if (typeof window['HighchartsCloud'] === 'undefined') {
    window.HighchartsCloud = {
      ondone: [createChart],
      hasWrapped: false,
      hasLoaded: false
    };

    loadScript(scripts[0], scripts, loadExtraScripts);
    loadCSS();

  } else {
    if (!window.HighchartsCloud.hasLoaded) window.HighchartsCloud.ondone.push(loadExtraScriptsAndMakeChart);
    else loadExtraScriptsAndMakeChart();
  }

  try {
    var r = new XMLHttpRequest();
    r.open('POST', 'https://cloud-api.highcharts.com:443/chart/204881/9/view', true);
    r.setRequestHeader('Content-Type', 'application/json');
    r.send();
  } catch (e) {
  }

}());
