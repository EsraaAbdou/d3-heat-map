const xhttp = new XMLHttpRequest();
xhttp.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json", true);
xhttp.send();
xhttp.onreadystatechange = function() {
    if(this.readyState==4 && this.status==200){ 
        const dataset = JSON.parse(this.responseText);
        drawChart(dataset);
    }      
};

function drawChart(dataset) {
   // SVG variables
   const padding = 60;
   const w = 1200;
   const h = 600;
   const baseTemp = dataset.baseTemperature;
   // Legend variables
   const colors = ["#D73027", "#F46D43", "#FDAE61", "#FEE090", "#FFFFBF", "#E0F3F8", "#ABD9E9", "#74ADD1", "#4575B4", "#FFFFFF"];
   const tempBreakpoints = [12.8, 11.7, 10.6, 9.5, 8.3, 7.2, 6.1, 5, 3.9, 2.8];
  
   // create SVG
   const svg = d3.select("div")
                 .append("svg")
                 .attr("preserveAspectRatio", "xMinYMin meet")
                 .attr("viewBox", `0 0 ${w} ${h}`)
                 .style("background-color", "white")
   
   // create dynamic scales
   const minYear = d3.min(dataset.monthlyVariance, (d) => d.year);
   const maxYear = d3.max(dataset.monthlyVariance, (d) => d.year);

   const xScale = d3.scaleLinear()
                    .domain([minYear, maxYear])
                    .range([padding, w - padding]);

   const yScale = d3.scaleLinear()
                    .domain([d3.min(dataset.monthlyVariance, (d) => d.month), d3.max(dataset.monthlyVariance, (d) => d.month)])
                    .range([h - 2 * padding, 2 * padding]);
                      
   // adding axes
   const months = [ "January", "February", "March", "April", "May", "June", 
   "July", "August", "September", "October", "November", "December" ];

   const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
   const yAxis = d3.axisLeft(yScale).tickFormat(d => months[d-1]);

   svg.append("g")
      .attr("transform", "translate(0," + (h - 2* padding) + ")")
      .attr("id", "x-axis")
      .call(xAxis);

   svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 )
      .attr("x",0 - (h / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Months");
   
   svg.append("g")
      .attr("transform", "translate(" + padding+ ",0)")
      .attr("id", "y-axis")
      .call(yAxis);
   
   svg.append("text")
      .attr("y", h - 2 * padding + 20)
      .attr("x",  w/2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Years");

   // adding title
   svg.append("text")
   .attr("x", w/2)
   .attr("y", 0)
   .attr("dy", "1em")
   .attr("id","title")
   .style("text-anchor", "middle")
   .text("Monthly Global Land-Surface Temperature");

   // adding description
   svg.append("text")
   .attr("x", w/2)
   .attr("y", "2em")
   .attr("dy", "1em")
   .attr("id","description")
   .style("text-anchor", "middle")
   .text(`${minYear} - ${maxYear}: base temperature ${baseTemp}℃`);

   // adding dots
   svg.selectAll("rect")
      .data(dataset.monthlyVariance)
      .enter()
      .append("rect")
      .attr("data-year", d => d.year)
      .attr("data-month", d => d.month -1)
      .attr("data-temp", d => d.variance)
      .attr("x", d => xScale(d.year))
      .attr("y", d => yScale(d.month + 1))
      .attr("width", d => xScale(d.year + 1) - xScale(d.year))
      .attr("height", d => yScale(d.month ) - yScale(d.month + 1))
      .attr("class", "cell")
      .attr("fill", d => fillColor(baseTemp + d.variance, tempBreakpoints, colors));

   // legend
   const legendScale = d3.scaleLinear()
                    .domain([d3.min(tempBreakpoints), d3.max(tempBreakpoints)])
                    .range([200, 600]);

   const legendAxis = d3.axisBottom(legendScale).tickValues(tempBreakpoints).tickFormat(d3.format(".1f"));
                 
   const legend = svg.append("g")
                     .attr("id", "legend")
                     .attr("transform", "translate(0," + (h -  padding/2) + ")")
                     .call(legendAxis);

   legend.selectAll("rect")
         .data(tempBreakpoints.slice(1, tempBreakpoints.length))
         .enter()
         .append("rect")
         .attr("x", d => legendScale(d))
         .attr("y", -30)
         .attr("width", (d, i) => legendScale(tempBreakpoints[i]) - legendScale(tempBreakpoints[i+1]))
         .attr("height", 30)
         .attr("fill", d => fillColor(d, tempBreakpoints, colors))
}

function fillColor(temp, arr, colors) {
   console.log(arr)
   if(temp >= arr[1]) return colors[0];
   if(temp >= arr[2]) return colors[1];
   if(temp >= arr[3]) return colors[2];
   if(temp >= arr[4]) return colors[3];
   if(temp >= arr[5]) return colors[4];
   if(temp >= arr[6]) return colors[5];
   if(temp >= arr[7]) return colors[6];
   if(temp >= arr[8]) return colors[7];
   if(temp >= arr[9]) return colors[8];
   else return colors[9];
}