const xhttp = new XMLHttpRequest();
xhttp.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json", true);
xhttp.send();
xhttp.onreadystatechange = function() {
    if(this.readyState==4 && this.status==200){ 
        const dataset = JSON.parse(this.responseText);
        drawChart(dataset);
        console.log(dataset)
    }      
};

function drawChart(dataset) {
   // SVG variables
   const padding = 60;
   const w = 1200;
   const h = 600;
  
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
                    .range([h - padding, padding]);
                    
   // const yScale = d3.scaleTime()
                  //   .domain(d3.extent(dataset, time2Date).reverse())
                  //   .range([h - padding, padding]);
   
   // adding axes
   const months = [ "January", "February", "March", "April", "May", "June", 
   "July", "August", "September", "October", "November", "December" ];

   const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
   const yAxis = d3.axisLeft(yScale).tickFormat(d => months[d-1]);

   
   svg.append("g")
      .attr("transform", "translate(0," + (h - padding) + ")")
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
      .attr("y", h - padding/2)
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
   .text(`${minYear} - ${maxYear}: base temperature ${dataset.baseTemperature}℃`);
}
