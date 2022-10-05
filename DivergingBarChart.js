//Declare the width and the height we'll use for our canvas
var width = 1000
var height = 1000
var padding = 10

const colorScale = d3.scaleQuantize().range(colorbrewer.RdBu[5])

//Create an svg element and define some attributes
const svg = d3.select('body')
    .append("svg")
    .attr("width", width)
    .attr("height", height);

//Render function
var render = data => {
    const xValue = d => d.jobRate;
    const yValue = d => d.State;

    //colorScale.domain([d3.min(data, d => d.jobsLost), d3.max(data, d => d.jobsLost)])
    //Create margins for a better formatted chart
    const margin = {
        top: 10,
        right: 50,
        bottom: 30,
        left: 50
    }
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    //Translate the svg element using our newly created margins
    const g = svg.append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    //create xScale
    const xScale = d3.scaleLinear()
        .domain([d3.min(data, xValue), d3.max(data, xValue)])
        .range([margin.left + 15, innerWidth - 15]);
    console.log(d3.max(data, xValue))
    console.log(d3.min(data, xValue))

    //Figures out the appropriate bar width given the amount of entries in the dataset
    //and the size of our canvas, yScale
    const yScale = d3.scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])

    colorScale.domain([d3.min(data, d => d.jobRate), d3.max(data, d => d.jobRate)])

    //Create an x and y-axis according to the scale of our values
    const yAxis = d3.axisLeft(yScale)
    const xAxis = d3.axisBottom(xScale)
    //Add an attribute translate to have them meet the needs of our margins
    g.append('g').call(d3.axisLeft(yScale))
        .attr("transform", "translate( " + margin.left + "," + 0 + ")")
    g.append('g').call(d3.axisBottom(xScale))
        .attr("transform", "translate( " + 15 + "," + innerHeight + ")")

    //Make a group called rectangles that will handle all of our rectangles we make
    const rectangles = g.append("g")
    //For every time we make a rectangle associated with our 'rectangles' group:
    const rects = rectangles.selectAll('rect')
        .data(data)
        .enter()
        .append('rect');
    //console.log(xScale(xValue(d)))
    //Assign the following attributes to the tag:
    data.forEach(d =>{
        rects
            .attr("width", 150)
            .attr('x', d => Math.min(xScale(0), xScale(d.jobRate)) + padding + 5) //d => width / 2 - xValue
            .attr('y', d => yScale(yValue(d)))
            .attr('width', d => Math.abs(xScale(d.jobRate) - xScale(0)))
            .attr('height', yScale.bandwidth() - 5) //5 pixels in between each bar
            .attr('fill', d => colorScale(d.jobRate))
            .attr("stroke", "black")
            .attr("stroke-width", "0.25");
    })

    // rects
    //     .attr("width", 150)
    //     .attr('x', width / 2 - 2) //d => width / 2 - xValue
    //     .attr('y', d => yScale(yValue(d)))
    //     .attr('width', d => Math.abs(d.jobRate) * 132)
    //     .attr('height', yScale.bandwidth() - 5) //5 pixels in between each bar
    //     .attr('fill', '#69b3a2');

    const textlabel = g.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    //Formatting hack
    let format = d3.format(",");

    //Labels for a more descriptive view of the jobs lost
    const labels = rects.select("text")
        .data(data)
        .enter()
        .append("text")
        .text(function (d) {
            return format(d.jobRate);
        })
        .attr('x', d => xScale(d.jobRate) + padding + 5)
        .attr('y', d => yScale(yValue(d)) + padding + 1)
        .attr("font-family", "sans-serif")
        .attr("text-align", "right")
        .attr("font-size", "12px")
        .attr("fill", "black")


    //Create the legend
    let legend = d3.legendColor()
        .labelFormat(d3.format('.2s'))
        .title('Rates Legend')
        .scale(colorScale)
    svg.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(' + (width/1.4 + margin.left + margin.right + padding) + ',' + (margin.top + padding) + ')')
        .call(legend)
}
//Load the States and jobsLost from the business_dynamics csv file
d3.csv("https://gist.githubusercontent.com/FrankGuglielmo/f2701446543c8b4be518be7c7ad4a1d9/raw/42d88fd7be8aa85b94e0c28927a3214832959c92/business_dynamicsDBC.csv").then(data =>{
    data.forEach(d =>{
        d.State = d["State"];
        d.jobRate = +d["NetJobRate"]; //Convert the jobsLost column using '+' and column name
    })
    //Create render function
    render(data);
});
