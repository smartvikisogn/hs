let sport = 'aquatics',
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
  femaleColor = 'red';

function boxplotParameters(arr, color) {
  let min, q1, median, q3, max;
  min = jStat.min(arr);
  q1 = jStat.quartiles(arr)[0];
  median = jStat.quartiles(arr)[1];
  q3 = jStat.quartiles(arr)[2];
  max = jStat.max(arr);
  return { low: min, q1: q1, median: median, q3: q3, high: max, color: color };
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

    Highcharts.chart('containerHeight', {
      chart: {
        type: 'boxplot'
      },
      accessibility: {
        description: ''
      },
      title: {
        text: title + ' </b> height male vs female'
      },
      xAxis: {
        categories: ['Male', 'Female'],
        title: {
          text: null
        },
        labels: {
          enabled: true
        },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true
      },
      yAxis: {
        title: {
          text: null
        },
        labels: {
          format: '{value} m'
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
        formatter: function() {
          return (
            '<b>' +
            this.series.name +
            '</b><br/>' +
            'Height: ' +
            this.x +
            'm <br/> Weight: ' +
            this.y +
            'kg'
          );
        }
      },

      series: [
        {
          name: title + ' male',
          color: maleColor,
          data: [maleBoxplotHeight, femaleBoxplotHeight]
        },
        {
          name: 'male jitter',
          type: 'scatter',
          inverted: true,
          data: maleHeightJitter,
          jitter: {
            x: 0.24 // Exact fit for box plot's groupPadding and pointPadding
          },
          marker: {
            radius: 1
          },
          color: maleColor,
          tooltip: {
            //pointFormat: 'Value: {point.y}'
            formatter: function() {
              return this;
            }
          }
        },
        {
          name: 'female jitter',
          type: 'scatter',
          color: femaleColor,
          inverted: true,
          data: femaleHeightJitter,
          jitter: {
            x: 0.24 // Exact fit for box plot's groupPadding and pointPadding
          },
          marker: {
            radius: 1
          },
          color: femaleColor,
          tooltip: {
            //pointFormat: 'Value: {point.y}'
            formatter: function() {
              return this;
            }
          }
        }
      ]
    });
    /*  Highcharts.chart('containerWeight', {
 chart: {
    type: 'boxplot',
  },
  accessibility: {
    description: ''
  },
  title: {
    text: title+' </b>male vs female'
  },
  xAxis: {
    title: {
      text: null
    }
  },
  yAxis: {
    title: {
      text: 'Weight'
    },
    labels: {
      format: '{value} m'
    }
  },
  legend: {
    enabled: true,
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
    formatter: function() {
      return '<b>'+ this.series.name + '</b><br/>' + 'Weight: ' + this.x + 'm <br/> Weight: ' + this.y + 'kg';
    }
  },

  series: [{
    name: title +' male',
    color: maleColor,
    data: maleBoxplotWeight
  },{
    name: title+ ' female',
    color: femaleColor,
    data: femaleBoxplotWeight
  }]
        });*/
  }
);
