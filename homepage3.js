const data = [];
const xhr = new XMLHttpRequest();
xhr.responseType = "json";
xhr.open(
  "GET",
  "https://opendata.paris.fr/api/records/1.0/search/?dataset=logement-encadrement-des-loyers&facet=id_zone&facet=nom_quartier&facet=piece&facet=epoque&facet=meuble_txt&rows=50"
);
xhr.send();
xhr.onload = function () {
  if (xhr.status < 400) {
    let reponse = xhr.response.records;
    for (let i = 0; i < reponse.length; i++) {
      let reponse_i = reponse[i].fields;
      data.push({ quartier: reponse_i.nom_quartier, zone: reponse_i.id_zone, id_quartier: reponse_i.id_quartier, value: reponse_i.max, couleur: '#'+(Math.random()*0xFFFFFF<<0).toString(16) });

    }
}   
};
setTimeout(function(){
 

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 20, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select('body').append('svg')
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
  var x = d3.scaleLinear()
  .domain([0, 120])
  .range([ 0, width ]);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// Add Y axis
var y = d3.scaleLinear()
  .domain([0, 100])
  .range([ height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));

// Add a scale for bubble size
var z = d3.scaleLinear()
  .domain([1, 3000])
  .range([ 1, 40]);

  // -1- Create a tooltip div that is hidden by default:
  var tooltip = d3.select("#my_dataviz")
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")

 // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
 const showTooltip = function(event, d) {
    tooltip
      .transition()
      .duration(200)
    tooltip
      .style("opacity", 1)
      .html("Ville: " + d.quartier + ", Loyer de référence : "+ d.value)
      .style("left", (event.x)/2 + "px")
      .style("top", (event.y)/2+30 + "px")
  }
  const moveTooltip = function(event, d) {
    tooltip
      .style("left", (event.x)/2 + "px")
      .style("top", (event.y)/2+30 + "px")
  }
  const hideTooltip = function(event, d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }



// Add dots
svg.append('g')
  .selectAll("dot")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", function (d) { return x(d.zone*6); } )
    .attr("cy", function (d) { return y(d.id_quartier+7); } )
    .attr("r", function (d) { return z(d.value*d.value); } )
    //.style("fill", '#'+(Math.random()*0xFFFFFF<<0).toString(16))
    .style("fill", d => d.couleur)
    .style("opacity", "0.7")
    .attr("stroke", "black") 
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip )

    svg.append('text')
        .attr('x', 270)
        .attr('y', 410)
        .attr('text-anchor', 'middle')
        .text('zone')

        svg.append('text')
        .attr('x', -150)
        .attr('y', -30)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Quartier')

},1000);
