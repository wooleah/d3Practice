const data = [
  { width: 200, height: 100, fill: 'red' },
  { width: 100, height: 60, fill: 'pink' },
  { width: 50, height: 30, fill: 'purple' }
];

const svg = d3.select('svg');

// join data to rects
const rect = svg.selectAll('rect')
  .data(data)

// add attrs to rect already in DOM
rect.attr('width', (d, i, n) => d.width)
  .attr('height', d => d.height)
  .attr('fill', d => d.fill)

// append the enter selection to DOM
rect.enter()
  .append('rect')
  .attr('width', (d, i, n) => d.width)
  .attr('height', d => d.height)
  .attr('fill', d => d.fill)
