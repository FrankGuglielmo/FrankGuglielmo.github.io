
let svg = d3.select('svg')
    margin = {top: 60, bottom: 60, left: 80, right: 200}
    width = svg.attr('width') - margin.left - margin.right
    height = svg.attr('height') - margin.top - margin.bottom
//Create x, y, and color scales to use for creating the chart
let xScale = d3.scaleBand().range([margin.left, margin.left + width]).padding(0.45),
    yScale = d3.scaleLinear().range([height + margin.top, margin.top]),
    // colorScale = d3.scaleSequential().interpolator(d3.interpolateBlues)
    colorScale = d3.scaleQuantize().range(colorbrewer.Oranges[7])
//Load from the csv file
d3.csv("https://gist.githubusercontent.com/FrankGuglielmo/7a241b1564eab16970585538602da5e1/raw/efaf07ba25bc76e58c0cf70ca98f55e81be942d2/SequentialBarChart_BD.csv").then(data =>{
    //Just grab the State and JobsLost
    data.forEach(d =>{
        d.State = d["State"];
        d.jobsLost = +d["Data.Job Destruction.Count"]; //Convert the jobsLost column using '+' and column name
    })
    //data.sort((a, b) => a.flights - b.flights)
    let xSeq = []
        data.forEach(d => xSeq.push(d.State))
    console.log(data)

    //Use the sequence to find the domain
    xScale.domain(xSeq)
    yScale.domain([0, d3.max(data, d => d.jobsLost)])
    colorScale.domain([0, d3.max(data, d => d.jobsLost)])
    //For every rectangle we make for each data point: assign attributes:
    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d.State))
        .attr('y', d => yScale(d.jobsLost))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height + margin.top - yScale(d.jobsLost))
        .attr('fill', d => colorScale(d.jobsLost))
    //For every text tag we make for each data point: assign attributes:
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2 + margin.left)
        .attr('y', margin.top / 2)
        .text('Jobs Lost during the 2008 Recession')
    //Create x-axis
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0, ' + (height + margin.top) + ')')
        .call(d3.axisBottom(xScale).tickValues(xSeq))
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2 + margin.left)
        .attr('y', margin.bottom / 2)
        .text('States')
    //Create y-axis
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + margin.left + ', 0)')
        .call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format('~s')))
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .attr('x', - height / 2 - margin.top)
        .attr('y', - margin.left / 2)
        .text('Jobs Lost')
    //Create the legend
    let legend = d3.legendColor()
        .labelFormat(d3.format('.2s'))
        .title('Color Legend')
        .scale(colorScale)
    svg.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(' + (width + margin.left + margin.right/5) + ',' + ((height - margin.bottom) / 2) + ')')
        .call(legend)
})
