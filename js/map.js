var map;
var roadSegmentStrokeColor = 'rgb(99,76,124)';
var selectedRoadSegmentStrokeColor = 'rgb(197,253,115)';
var highlightedRoadSegmentStrokeColor = 'rgb(232,186,180)';

var pathClick = function(path) {
  console.log(path.pairId);
  if (selectedRouteSegment) {
    selectedRouteSegment.setOptions({strokeColor: roadSegmentStrokeColor})
  }
  selectedRouteSegment = routeSegments[path.pathIndex];
  selectedRouteSegment.setOptions({strokeColor: selectedRoadSegmentStrokeColor, strokeOpacity: 1.0});

  $('#chart svg').children().remove()
  $('#carbonChart svg').children().remove()

  // Add Travel Chart
  nv.addGraph(function() {
   var chart = nv.models.lineChart();

   chart.xAxis
       .axisLabel('Time')
       .tickFormat(function(d) { return "" + Math.floor(d/60) + ":" + (d % 60) }).ticks(12);

   chart.yAxis
       .axisLabel('Travel Time (minutes)')
       .tickFormat(d3.format('.0f'));

   d3.select('#chart svg')
       .datum(sinAndCos())
     .transition().duration(500)
       .call(chart);

   nv.utils.windowResize(function() { d3.select('#chart svg').call(chart) });

   return chart;
  });

  // Add Carbon Chart
  nv.addGraph(function() {
   var chart = nv.models.lineChart();

   chart.xAxis
       .axisLabel('Time')
       .tickFormat(function(d) { return "" + Math.floor(d/60) + ":" + (d % 60) }).ticks(12);

   chart.yAxis
       .axisLabel('Travel Time (minutes)')
       .tickFormat(d3.format('.0f'));

   d3.select('#carbonChart svg')
       .datum(sinAndCosCarbon())
     .transition().duration(500)
       .call(chart);

   nv.utils.windowResize(function() { d3.select('#carbonChart svg').call(chart) });

   return chart;
  
  });
  
  /**************************************
  * Simple test data generator
  */

  function sinAndCos() {
    var avg = [],
       min = [],
       max = [];

    for (var i = 0; i < data.length; i++) {
      if (data[i][0] === path.pairId) {
        var rowDate = new Date (new Date().toDateString() + ' ' + data[i][1]);
        var minutes = 5*Math.floor(rowDate.getMinutes()/5);
        var rowDate = rowDate.getHours()*60+minutes;
        if ( (0 < data[i][3]/60) && (data[i][3]/60 < 10) ) {
          if (typeof rowDate !== 'undefined') {
            avg.push({x: rowDate, y: data[i][2]/60});
          }
        }
        if ( (0 < data[i][3]/60) && (data[i][3]/60 < 7) ) {
          if (typeof rowDate !== 'undefined') {
            min.push({x: rowDate, y: data[i][3]/60});
          }
        }
        if ( (5 < data[i][3]/60) && (data[i][3]/60 < 5000) ) {
          if (typeof rowDate !== 'undefined') {
            max.push({x: rowDate, y: data[i][4]/60});
          }
        }
      }
    }

    return [
     {
       values: max,
       key: 'Maxium',
       color: 'rgb(231,186,179)'
     },
     {
       values: min,
       key: 'Minimum',
       color: 'rgb(114,147,50)'
     },
     {
       values: avg,
       key: 'Average',
       color: 'grey'
     }

    ];
  }
  
  function sinAndCosCarbon() {
    var avg = [],
       min = [],
       max = [];

    var averageMpg = 23.1;
    var averageGph = 60/averageMpg;
    var mmBtuPerGallon = 0.125;
    var kgCO2mmBtu = 70.22;
    var kgCH4mmBtu = 0.003;
    var kgN2OmmBtu = 0.0006;

    for (var i = 0; i < data.length; i++) {
      if (data[i][0] === path.pairId) {
        var rowDate = new Date (new Date().toDateString() + ' ' + data[i][1]);
        var rowDate = rowDate.getHours()*60+rowDate.getMinutes();
        
        var avgCO2Kg = data[i][2]/60/60*averageGph*mmBtuPerGallon*kgCO2mmBtu;
        var avgCH4Kg = data[i][2]/60/60*averageGph*mmBtuPerGallon*kgCH4mmBtu;
        var avgN2OKg = data[i][2]/60/60*averageGph*mmBtuPerGallon*kgN2OmmBtu;
        var avgKg = avgCO2Kg+avgCH4Kg+avgN2OKg;

        var minCO2Kg = data[i][3]/60/60*averageGph*mmBtuPerGallon*kgCO2mmBtu;
        var minCH4Kg = data[i][3]/60/60*averageGph*mmBtuPerGallon*kgCH4mmBtu;
        var minN2OKg = data[i][3]/60/60*averageGph*mmBtuPerGallon*kgN2OmmBtu;
        var minKg = minCO2Kg+minCH4Kg+minN2OKg;
        
        var maxCO2Kg = data[i][4]/60/60*averageGph*mmBtuPerGallon*kgCO2mmBtu;
        var maxCH4Kg = data[i][4]/60/60*averageGph*mmBtuPerGallon*kgCH4mmBtu;
        var maxN2OKg = data[i][4]/60/60*averageGph*mmBtuPerGallon*kgN2OmmBtu;
        var maxKg = maxCO2Kg+maxCH4Kg+maxN2OKg;
        
        if ( (0 < data[i][3]/60) && (data[i][3]/60 < 10) ) {
          if (typeof rowDate !== 'undefined') {
            avg.push({x: rowDate, y: avgKg});
          }
        }
        if ( (0 < data[i][3]/60) && (data[i][3]/60 < 7) ) {
          if (typeof rowDate !== 'undefined') {
            min.push({x: rowDate, y: minKg});
          }
        }
        if ( (3 < data[i][3]/60) && (data[i][3]/60 < 5000) ) {
          if (typeof rowDate !== 'undefined') {
            max.push({x: rowDate, y: maxKg});
          }
        }
      }
    }

    return [
     {
       values: max,
       key: 'Maxium',
       color: 'rgb(231,186,179)'
     },
     {
       values: min,
       key: 'Minimum',
       color: 'rgb(155,187,84)'
     },
     {
       values: avg,
       key: 'Average',
       color: 'grey'
     },

    ];
  
    var sin = [],
        cos = [];

    for (var i = 0; i < 100; i++) {

      
      sin.push({x: i, y: kg});
    }

    return [
     {
       values: sin,
       key: '90th Percentile',
       color: '#ff7f0e'
     },
     {
       values: cos,
       key: 'Average',
       color: '#2ca02c'
     }
    ];
  }

};

var highlightedRouteSegment;
var pathMouseover = function(path) {
  if (highlightedRouteSegment) {
    removePathMouseover(path);
  }
  highlightedRouteSegment = routeSegments[path.pathIndex];
  highlightedRouteSegment.setOptions({strokeColor: highlightedRoadSegmentStrokeColor, strokeOpacity: 1.0});
};
var removePathMouseover = function(path) {
  if (highlightedRouteSegment) {
    highlightedRouteSegment.setOptions({strokeColor: (highlightedRouteSegment == selectedRouteSegment ? selectedRoadSegmentStrokeColor : roadSegmentStrokeColor)});
    highlightedRouteSegment.setOptions({strokeOpacity: (highlightedRouteSegment == selectedRouteSegment ? 1.0 : 0.5)});
  }
}
var routeSegments = [];
var selectedRouteSegment = null;
var highlightedRouteSegment = null;

function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(42.358056, -71.063611),
    zoom: 9
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

  for (var i=0; i<segments.length; i++) {
    var addSegment = function(segmentData) {
      var paths = segmentData[1];

      // eg: [5490.0, [[42.71946, -71.20996], [42.71941, -71.20972], ...]
      var x1 = paths[0][0];
      var y1 = paths[0][1];
      var x2 = paths[1][0];
      var y2 = paths[1][1];
      var dx = x1-x2;
      var dy = y1-y2;
      var dist = Math.sqrt(dx*dx + dy*dy);
      dx = dx/dist;
      dy = dy/dist;
      var offset = 0.0;
      x3 = x1 + offset * dy;
      y3 = y1 - offset * dx;
      x4 = x1 - offset * dy;
      y4 = y1 + offset * dx;

      var segment = paths.map(function(point) {
        return new google.maps.LatLng(point[0] + (offset * dy), point[1] - (offset * dx));
      });

      var path = new google.maps.Polyline({
        path: segment,
        geodesic: true,
        strokeColor: roadSegmentStrokeColor,
        strokeOpacity: 0.5,
        strokeWeight: 2,
        pairId: segmentData[0],
        pathIndex: i
      });
      google.maps.event.addListener(path, 'click', function() {
        pathClick(path);
      });
      google.maps.event.addListener(path, 'mouseover', function() {
        pathMouseover(path);
      });
      google.maps.event.addListener(path, 'mouseout', function() {
        removePathMouseover(path);
      });
      path.setMap(map);
      routeSegments.push(path);
    };
    addSegment(segments[i]);
  }
}
google.maps.event.addDomListener(window, 'load', initialize);
