


// Using jQuery, read our data and call visualize(...) only once the page is ready:
$(function() {
  d3.csv("uiuc-cleaned.csv").then(function(data) {
    // Write the data to the console for debugging:
    console.log(data);

    // Call our visualize function:
    visualize(data, "Engineering", "#chart-engineering", 1980, 2018, false);
    visualize(data, "LAS", "#chart-las", 1980, 2018, false);
    visualize(data, "ACES", "#chart-aces", 1980, 2018, false);
    visualize(data, "Applied Health Sciences", "#chart-ahs", 1980, 2018, false);
    visualize(data, "Business", "#chart-business", 1980, 2018, false);
    visualize(data, "Education", "#chart-education", 1980, 2018, false);
    visualize(data, "Fine and Applied Arts", "#chart-fine-applied-arts", 1980, 2018, false);
    visualize(data, "Media", "#chart-media", 1980, 2018, false);
    sliders(data);
  });
});

var visualize = function(data, college, id, startDate, endDate, replace = true) {
  // Boilerplate:

  var margin = { top: 50, right: 50, bottom: 50, left: 50 },
     width = 280 - margin.left - margin.right,
     height = 600 - margin.top - margin.bottom;

  if(replace){
      d3.select(id).selectAll("svg").remove();
  }

  var svg = d3.select(id)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("width", width + margin.left + margin.right)
    .style("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



  // Visualization Code:
  // var startDate = 1980;
  // var endDate = 2018;

  var xScale = d3.scaleLinear().domain([startDate, endDate]).range([0, width]);

  var yScale = d3.scaleLinear().domain([0, 1700]).range([height, 50]);

  var yAxisLeftVariable = d3.axisLeft().scale(yScale);
  var yAxisRightVariable = d3.axisRight().scale(yScale);

  

  // Major label
  var label = svg.append("text");
  label.attr("x", 50).attr("y", 50).attr("text-anchor", "middle").attr("font-size","14px");

  // College label
  svg.append("text")
     .attr("class", "college-label")
     .attr("x", xScale((startDate + endDate) / 2))
     .attr("y", 0)
     .attr("text-anchor", "middle")
     .attr("font-size", "18px")
     .text(college);

  svg.append("text")
     .attr("class", "year-label")
     .attr("x", xScale(startDate))
     .attr("y", 25)
     .attr("text-anchor", "middle")
     .attr("font-size", "14px")
     .text(startDate);

  svg.append("text")
     .attr("class", "year-label")
     .attr("x", xScale(endDate))
     .attr("y", 25)
     .attr("text-anchor", "middle")
     .attr("font-size", "14px")
     .text(endDate);

  var labelLine = svg.append("line");
  labelLine.attr("opacity", 0)
           .attr("stroke", "white")
           .attr("stroke-width", 1);


  var tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
      return d[0] + "<br>" +
             d[1][0] + " &#8594; " + d[1][3] + " students" + "<br>" +
             (Math.round(100 * d[1][1] / d[1][0] * 10) / 10) + "% &#8594; " + (Math.round(100 * d[1][4] / d[1][3] * 10) / 10) + "% Male" + "<br>" +
             (Math.round(100 * d[1][2] / d[1][0] * 10) / 10) + "% &#8594; " + (Math.round(100 * d[1][5] / d[1][3] * 10) / 10) + "% in-state";
    });
  svg.call(tip);

  // {Key: Major name, Value: [startDateTotal, endDateTotal]}
  var majorToCounts = new Map();
  data.forEach(function (d, i) {
    if (d["College"] == college) {
      if (d["Fall"] == startDate) {
        majorToCounts.set(d["Major Name"], [d["Total"]]);
        majorToCounts.get(d["Major Name"]).push(d["Male"]);
        majorToCounts.get(d["Major Name"]).push(d["Illinois"]);
      } else if (majorToCounts.has(d["Major Name"]) && d["Fall"] == endDate) {
        majorToCounts.get(d["Major Name"]).push(d["Total"]);
        majorToCounts.get(d["Major Name"]).push(d["Male"]);
        majorToCounts.get(d["Major Name"]).push(d["Illinois"]);
      }
    }
  });

  majorToCounts.forEach((value, key, map)=>
  {
    if (majorToCounts.get(key).length <= 3) {
      majorToCounts.delete(key);
    }
  });

  svg.append("g")
    .attr("class", "y-axis")
    .call(yAxisLeftVariable);

  svg.append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate( " + (width) + ", 0 )")
    .call(yAxisRightVariable);

  majorToCounts.forEach((value,key,map)=>
  {
    var xCenter = xScale((startDate + endDate) / 2);
    var yCenter = (yScale( majorToCounts.get(key)[0] ) + yScale( majorToCounts.get(key)[3] )) / 2;

    var currLine = svg.append("line")
                      .attr("class", "slope-line")
                      .attr("id", key)
                      .attr("x1", function (d, i) {
                         return xScale( startDate );
                       })
                       .attr("y1", function (d, i) {
                         return yScale( majorToCounts.get(key)[0] );
                       })
                       .attr("x2", function (d, i) {
                         return xScale( endDate );
                       })
                       .attr("y2", function (d, i) {
                         return yScale( majorToCounts.get(key)[3] );
                       })
                       .attr("stroke-width", 2)
                       .attr("stroke", "white")
                       .attr("opacity", 0.8);

    svg.append("line")
        .attr("class", "slope-line-hitbox")
        .attr("id", key)
        .attr("x1", function (d, i) {
           return xScale( startDate );
         })
         .attr("y1", function (d, i) {
           return yScale( majorToCounts.get(key)[0] );
         })
         .attr("x2", function (d, i) {
           return xScale( endDate );
         })
         .attr("y2", function (d, i) {
           return yScale( majorToCounts.get(key)[3] );
         })
         .attr("stroke-width", 8)
         .attr("stroke", "black")
         .attr("opacity", 0)
         .on("mouseover", function(d) {
            d3.selectAll(".slope-line")
              .transition()
              .attr("duration", 200)
              .attr("opacity", 0.2);
            currLine.transition()
              .attr("duration", 200)
              .attr("opacity", 0.8)
              .attr("stroke-width", 3);

            tip.direction('n');
            tip.offset( [-(Math.min(yScale( majorToCounts.get(key)[3] ), yScale( majorToCounts.get(key)[0] )) - yCenter) - 20, 0] );
            tip.show([key, value], this);
         })
         .on("mouseout", function(d) {
            d3.selectAll(".slope-line")
              .transition()
              .attr("duration", 200)
              .attr("opacity", 0.8)
              .attr("stroke-width", 2);

            tip.hide(key, this);
         });
  });

};



var sliders = function(data){
  var startDate = 1980;
  var endDate = 2018;

  var yearRange = d3.range(0, 39).map(function(d) {
      if((1980 + d) % 5 == 0 || (1980 + d) == 2018){
        return new Date(1980 + d, 1, 1);
      }
  });

  var sliderRange = d3
    .sliderHorizontal()
    .min(d3.min(yearRange))
    .max(d3.max(yearRange))
    .step(1000 * 60 * 60 * 24 * 365)
    .width(500)
    .fill('#13294c')
    .displayValue(true)
    .tickFormat(d3.timeFormat('%Y'))
    .default([new Date(1980, 1, 1), new Date(2018, 1, 1)])
    .on('onchange', val => {
      startDate = Number(val.map(d3.timeFormat('%Y'))[0]);
      endDate = Number(val.map(d3.timeFormat('%Y'))[1]);
      d3.select('#sliderYears').text(val.map(d3.timeFormat('%Y')).join(' - '));

      d3.select('h1').text(
        "UIUC Undergraduate Majors from " + 
        val.map(d3.timeFormat('%Y')).join(' to ')
      );

      visualize(data, "Engineering", "#chart-engineering", startDate, endDate);
      visualize(data, "LAS", "#chart-las", startDate, endDate);
      visualize(data, "ACES", "#chart-aces", startDate, endDate);
      visualize(data, "Applied Health Sciences", "#chart-ahs", startDate, endDate);
      visualize(data, "Business", "#chart-business", startDate, endDate);
      visualize(data, "Education", "#chart-education", startDate, endDate);
      visualize(data, "Fine and Applied Arts", "#chart-fine-applied-arts", startDate, endDate);
      visualize(data, "Media", "#chart-media", startDate, endDate);
    });


    // var gRange = d3
    //   .select('div#slider-range')
    //   .append('svg')
    //   .attr('width', 500)
    //   .attr('height', 100)
    //   .append('g')
    //   .attr('transform', 'translate(30,30)');
    //
    // gRange.call(sliderStart);
    //
    d3.select('#sliderYears').text(
      sliderRange
        .value()
        .map(d3.timeFormat('%Y'))
        .join(' - ')
    );

    d3.selectAll("h1").text (
      "UIUC Undergraduate Majors from " +
      sliderRange
        .value()
        .map(d3.timeFormat('%Y'))
        .join(' to ')
    );


    d3.select('#slider')
       .append('svg')
       .attr('width', 700)
       .attr('height', 100)
       .append('g')
       .attr('transform', 'translate(100,50)')
       .call(sliderRange);

}
