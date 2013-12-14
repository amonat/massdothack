var map;
var roadSegmentStrokeColor = 'rgb(99,76,124)';
var selectedRoadSegmentStrokeColor = '#ff0000';
var highlightedRoadSegmentStrokeColor = '#00ff00';

var pathClick = function(path) {
  console.log(path.pairId);
  if (selectedRouteSegment) {
    selectedRouteSegment.setOptions({strokeColor: roadSegmentStrokeColor})
  }
  selectedRouteSegment = routeSegments[path.pathIndex];
  selectedRouteSegment.setOptions({strokeColor: selectedRoadSegmentStrokeColor});

  $('#chart svg').children().remove()

  // Add Travel Chart
  nv.addGraph(function() {
   var chart = nv.models.lineChart();

   chart.xAxis
       .axisLabel('Time')
       .tickFormat(d3.format(',r'));

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
       .tickFormat(d3.format(',r'));

   chart.yAxis
       .axisLabel('Travel Time (minutes)')
       .tickFormat(d3.format('.0f'));

   d3.select('#carbonChart svg')
       .datum(sinAndCos())
     .transition().duration(500)
       .call(chart);

   nv.utils.windowResize(function() { d3.select('#carbonChart svg').call(chart) });

   return chart;
  });

  
  /**************************************
  * Simple test data generator
  */

  function sinAndCos() {
    var sin = [],
       cos = [];

    for (var i = 0; i < 100; i++) {
     sin.push({x: i, y: Math.sin(i/10)});
     cos.push({x: i, y: .5 * Math.cos(i/10)});
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

var pathMouseover = function(path) {
  console.log("mouseover " + path.pairId);
  if (highlightedRouteSegment) {
    highlightedRouteSegment.setOptions({strokeColor: (highlightedRouteSegment == selectedRouteSegment ? selectedRoadSegmentStrokeColor : roadSegmentStrokeColor)});
  }
  highlightedRouteSegment = routeSegments[path.pathIndex];
  highlightedRouteSegment.setOptions({strokeColor: highlightedRoadSegmentStrokeColor});
};

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
      // eg: [5490.0, [[42.71946, -71.20996], [42.71941, -71.20972], ...]
      var paths = segmentData[1];
      var segment = paths.map(function(point) {
        return new google.maps.LatLng(point[0], point[1]);
      });

      var path = new google.maps.Polyline({
        path: segment,
        geodesic: true,
        strokeColor: roadSegmentStrokeColor,
        strokeOpacity: 0.8,
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
      path.setMap(map);
      routeSegments.push(path);
    };
    addSegment(segments[i]);
  }
}
google.maps.event.addDomListener(window, 'load', initialize);
