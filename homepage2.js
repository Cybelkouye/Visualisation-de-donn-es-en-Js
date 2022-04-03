const data1 = [];
const nonMeuble=0;
const meuble=0;
const xhr = new XMLHttpRequest();
xhr.responseType = "json";
xhr.open(
  "GET",
  "https://opendata.paris.fr/api/records/1.0/search/?dataset=logement-encadrement-des-loyers&q=&sort=meuble_txt&facet=id_zone&facet=nom_quartier&facet=piece&facet=epoque&facet=meuble_txt"
);
xhr.send();
xhr.onload = function () {
  if (xhr.status < 400) {
    let reponse = xhr.response.facet_groups;
    let reponse_i = reponse[0].facets;
    for (let i = 0; i < reponse_i.length; i++) {
      let reponse1 = reponse_i[i];
      data1.push({ nom: reponse1.name, value: reponse1.count });
    }
    var width = 1000, height = 900;
    var colors = d3.scaleOrdinal(d3.schemeDark2);
    var svg = d3.select("body").append("svg")

                .attr("width",width).attr("height",height);
    var data = d3.pie().sort(null).value(function(d){
                    return d.value;
                })(data1);
    console.log(data);
    var segments = d3.arc()
                     .innerRadius(250)
                     .outerRadius(180)
                     .padAngle(.05)
                     .padRadius(50);
    var sections = svg.append("g").attr("transform", "translate(250,250)").selectAll("path").data(data);
    sections.enter().append("path").attr("d",segments).attr("fill", function(d){
        return colors(d.data.value);
    });
    var content = d3.select("g").selectAll("text").data(data);

    content.enter().append("text").classed("inside", true).each(function(d){

        var center = segments.centroid(d);

        d3.select(this).attr("x", center[0]).attr("y", center[1]).text(d.data.value)

    })
    var legends = svg.append("g").attr("transform", "translate(600, 50)").selectAll(".legends").data(data);
    var legend = legends.enter().append("g").classed("legends", true)
                .attr("transform", function(d,i){
                    return "translate(0,"+ (i+1)*30 +")";
                });
                legend.append("rect").attr("width", 10).attr("height", 10).attr("fill", function(d){

                    return colors(d.data.value);
            
                });
                legend.append("text").classed("label", true).text(function(d){return d.data.nom;})    
                                     .attr("fill", function(d){return colors(d.data.value); })
                                     .attr("x", 20)
                                     .attr("y", 5);
                legend.append("text").classed("label", true).text(function(d){return d.data.value;})      
                .attr("fill", function(d){return colors(d.data.value); })          
                .attr("x", 100)            
                .attr("y", 10);
                }}            