const data = [];
const xhr = new XMLHttpRequest();
xhr.responseType = "json";
xhr.open(
  "GET",
  "https://opendata.paris.fr/api/records/1.0/search/?dataset=logement-encadrement-des-loyers&q=ternes&facet=id_zone&facet=nom_quartier&facet=piece&facet=epoque&facet=meuble_txt&rows=50"
);
xhr.send();
xhr.onload = function () {
  if (xhr.status < 400) {
    let reponse = xhr.response.records;
    for (let i = 0; i < reponse.length; i++) {
      let reponse_i = reponse[i].fields;
      data.push({ annee: reponse_i.epoque, value: reponse_i.max });
    }
}   
};
setTimeout(function(){

    data1 = [];
    data1.push({annee: "Avant 1946", value: 0})
    data1.push({annee: "1946-1970", value: 0})
    data1.push({annee: "1971-1990", value: 0})
    data1.push({annee: "Apres 1990", value: 0})    
    for(i=0;i<data.length;i++)
    {
        for(j=0;j<4;j++){
            if(data[i].annee==data1[j].annee)
            {
                data1[j].value = data1[j].value + ((data[i].value)/50)
            }
        }
    }
    console.log(data1[0]);
    console.log(data1[1]);
    console.log(data1[2]);
    console.log(data1[3]);
    

    const margin = 80;
const width = 1000 - 2 * margin;
const height = 600 - 2 * margin;

const svg = d3.select('body').append('svg')

const chart = svg.append('g')
    .attr('transform', `translate(${margin}, ${margin})`);
const yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 20]);
chart.append('g')
    .call(d3.axisLeft(yScale));
    const xScale = d3.scaleBand()
    .range([0, width])
    .domain(data1.map((s) => s.annee))
    .padding(0.2)

chart.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

    chart.selectAll()
    .data(data1)
    .enter()
    .append('rect')
    .attr('x', (data1) => xScale(data1.annee))
    .attr('y', (data1) => yScale(data1.value))
    .attr('height', (s) => height - yScale(s.value))
    .attr('width', xScale.bandwidth())
    .style("fill", "#126be0")


chart.append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft()
        .scale(yScale)
        .tickSize(-width, 0, 0)
        .tickFormat(''))

        svg.append('text')
        .attr('x', -(height / 2) - margin)
        .attr('y', margin / 2.4)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Prix moyen du loyer de référence par mètre carré')
    
    svg.append('text')
        .attr('x', width / 2 + margin)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .text('Epoque')

},500);
