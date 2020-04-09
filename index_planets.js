// select svg container first
const svg = d3.select('svg');

d3.json('planets.json')
  .then(data => {
    const circles = svg.selectAll('circle')
      .data(data)

    // add attrs to circs already in DOM
    circles.attr('cy', 200)
      .attr('cx', d => d.distance)
      .attr('r', d => d.radius)
      .attr('fill', d => d.fill)

    // appene the enter selection to the DOM
    circles.enter()
      .append('circle')
      .attr('cy', 200)
      .attr('cx', d => d.distance)
      .attr('r', d => d.radius)
      .attr('fill', d => d.fill)
  })