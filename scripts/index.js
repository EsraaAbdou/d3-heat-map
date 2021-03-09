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
  
   // create SVG
   const svg = d3.select("div")
                 .append("svg")
                 .attr("preserveAspectRatio", "xMinYMin meet")
                 .attr("viewBox", `0 0 ${w} ${h}`)
                 .style("background-color", "white")
   
   // create dynamic scales
   console.log(dataset.monthlyVariance)
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
      .attr("fill", d => {
         const temp = baseTemp + d.variance;
         if(temp > 11.7) return "#D73027";
         if(temp > 10.6) return "#F46D43";
         if(temp > 9.5) return "#FDAE61";
         if(temp > 8.3) return "#FEE090";
         if(temp > 7.2) return "#FFFFBF";
         if(temp > 6.1) return "#E0F3F8";
         if(temp > 5.0) return "#ABD9E9";
         if(temp > 3.9) return "#74ADD1";
         if(temp > 2.8) return "#4575B4";
         else return "#FFFFFF";
      })
}