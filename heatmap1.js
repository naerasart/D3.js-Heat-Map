let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
let req = new XMLHttpRequest();

req.open('GET', url, true);
req.onload = () => {
    var data = JSON.parse(req.responseText);



    var svg = d3.select("svg")
        .attr("width", 1000)
        .attr("height", 1000)
        .append("g")
        .attr("transform", "translate(45 15)");





    var tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style("height", "40px")
        .style("width", "500px")
        .style("z-index", "500")
        .style("visibility", "visible")
        .style("text-align", "center")
        .style("color", "black")
        .style("position", "fixed")
        .style("bottom", "80px")
        .style("left", "50%");




    var xScale = d3.scaleLinear()
        .domain([(d3.min(data.monthlyVariance, (d) => {
            return d.year;
        })), (d3.max(data.monthlyVariance, (d) => {
            return d.year;
        })) + 1])
        .range([80, 600 - 80]);

    var yScale = d3.scaleTime()
        .domain([new Date(0, 0, 0), new Date(0, 12, 0)])
        .range([80, 400 - 80]);



    svg.selectAll('rect')
        .data(data.monthlyVariance)
        .enter()
        .append('rect')
        .attr('class', 'cell')

    .attr('data-month', function(d) {
            return d.month - 1;
        })
        .attr('y', function(d) {
            return yScale(new Date(0, d.month - 1, 0));
        })
        .attr('height', (400 - 80 * 2) / 12)
        .attr('data-year', function(d) {
            return d.year;
        })
        .attr('x', function(d) {
            return xScale(d.year);
        })


    .attr('width', function(d) {

            return (600 - 80 * 2) / ((d3.max(data.monthlyVariance, (d) => {
                return d.year;
            })) - (d3.min(data.monthlyVariance, (d) => {
                return d.year;
            })));
        })
        .attr('data-temp', function(d) {
            return data.baseTemperature + d.variance;
        })


    .attr('fill', function(d) {

            if (d.variance <= -1) {
                return 'green'
            }
            if (d.variance <= 0) {
                return 'orange'
            }
            if (d.variance < 1) {
                return 'red'
            }
            if (d.variance >= 1) {
                return 'black'
            }
        })
        .on('mouseover', function(d) {
            tooltip.style('visibility', 'visible');
            tooltip.text([d.month - 1] + "/" + d.year + ', ' +
                '  Temperature: ' + (data.baseTemperature + d.variance).toFixed(2) + "℃" + ', ' + 'Temperature Variance: ' +

                (d.variance) + "˚C");



            tooltip.attr('data-year', d.year);

        })

    .on('mouseout', function(d) {

        tooltip.style('visibility', 'hidden');

    })








    svg.append('g')
        .attr('id', 'x-axis')

    .call(d3.axisBottom(xScale)

        .tickFormat(d3.format('d')))

    .attr('transform', 'translate(0,' + (400 - 80) + ')')


    svg.append('g')
        .attr('id', 'y-axis')
        .call(d3.axisLeft(yScale)
            .tickFormat(d3.timeFormat('%B')))

    .attr('transform', 'translate(' + 80 + ',0)')














}



req.send();

//Reference: https://codepen.io/snowie508/pen/WNxBbre