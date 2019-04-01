


// Using jQuery, read our data and call visualize(...) only once the page is ready:
$(function() {
  d3.csv("uiuc-cleaned.csv").then(function(data) {
    // Write the data to the console for debugging:
    console.log(data);

    // Call our visualize function:
    visualize(data);
  });
});


var visualize = function(data) {
  // Boilerplate:
  var margin = { top: 50, right: 50, bottom: 50, left: 50 },
     width = 960 - margin.left - margin.right,
     height = 500 - margin.top - margin.bottom;
      
  var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("width", width + margin.left + margin.right)
    .style("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Visualization Code:
  var startDate = 1980;
  var endDate = 2018;

  var xScale = d3.scaleLinear().domain([startDate, endDate]).range([0, width / 3]);

  var yScale = d3.scaleLinear().domain([0, 2000]).range([height, 0]);

  var yAxisLeftVariable = d3.axisLeft().scale(yScale);
  var yAxisRightVariable = d3.axisRight().scale(yScale);

  var majorToCounts = new Map();
  data.forEach(function (d, i) {
    if (d["Fall"] == startDate) {
      majorToCounts[d["Major Name"]].set([d["Total"]]);
      
    } else if (majorToCounts.has(d["Major Name"]) && d["Fall"] == endDate) {
      majorToCounts[d["Major Name"]].push(d["Total"]);
      console.log(d["Fall"]);
    }

    console.log(majorToCounts);
  });

  console.log(majorToCounts);

  majorToCounts.forEach((value,key,map)=>
  {
    if (majorToCounts[key].size() == 1 || majorToCounts[key].size() == 0) {
      majorToCounts.delete(key);
    }
  });

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxisLeftVariable);

  svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate( " + (width / 3) + ", 0 )")
    .call(yAxisRightVariable);

  majorToCounts.forEach((value,key,map)=>
  {
    svg.append("line")
        .attr("x1", function (d, i) {
           return xScale( startDate );
         })
         .attr("y1", function (d, i) {
           return yScale( majorToCounts[key][0] );
         })
         .attr("x2", function (d, i) {
           return xScale( endDate );
         })
         .attr("y2", function (d, i) {
           return yScale( majorToCounts[key][1] );
         })
         .attr("stroke-width", 1)
         .attr("stroke", "black");

    console.log(majorToCounts[key][0]);
  });
/*
  svg.selectAll("Fall")
     .data(data)
     .enter()
     .append("line")
     .attr("x1", function (d, i) {
       return xScale( startDate );
     })
     .attr("y1", function (d, i) {
       return yScale( 500 );
     })
     .attr("x2", function (d, i) {
       return xScale( endDate );
     })
     .attr("y2", function (d, i) {
       return yScale( 1500 );
     })
     .attr("stroke-width", 1)
     .attr("stroke", "black");

  svg.selectAll("Fall")
     .data(data)
     .enter()
     .append("circle")
     .attr("r", 3)
     .attr("fill", "black")
     .attr("cx", function (d, i) {
       return xScale( startDate );
     })
     .attr("cy", function (d, i) {
       return yScale( 500 );
     });

  svg.selectAll("Fall")
     .data(data)
     .enter()
     .append("circle")
     .attr("r", 3)
     .attr("fill", "black")
     .attr("cx", function (d, i) {
       return xScale( endDate );
     })
     .attr("cy", function (d, i) {
       return yScale( 1500 );
     });
*/
};