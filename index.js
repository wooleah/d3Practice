const svg = d3.select('.canvas')
  .append('svg')
  .attr('width', 600)
  .attr('height', 600)

// Create margins and dimensions
const margin = {
  top: 20,
  right: 20,
  bottom: 100,
  left: 100
}
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

const graph = svg.append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

const xAxisGroup = graph.append('g')
  .attr('transform', `translate(0, ${graphHeight})`)
const yAxisGroup = graph.append('g')


// scales
const y = d3.scaleLinear()
  .range([graphHeight, 0]);

const x = d3.scaleBand()
  .range([0, 500])
  .paddingInner(0.2)
  .paddingOuter(0.2)

// create the axes
const xAxis = d3.axisBottom(x)
const yAxis = d3.axisLeft(y)
  .ticks(3)
  .tickFormat(d => `${d} orders`)

// Update x axis text
xAxisGroup.selectAll('text')
  .attr('transform', 'rotate(-40)')
  .attr('text-anchor', 'end')
  .attr('fill', 'orange')


const update = (data) => {
  // Updating the scale domains
  y.domain([0, d3.max(data, d => d.orders)]);
  x.domain(data.map(item => item.name));

  // join the data to rects
  const rects = graph.selectAll('rect')
    .data(data);

  // remove exit selection 
  rects.exit().remove();

  // change the shapes of the already existing rects
  rects.attr('width', x.bandwidth)
    .attr('fill', 'orange')
    .attr('x', d => x(d.name))
    .transition().duration(500)
    .attr('height', d => graphHeight - y(d.orders))
    .attr('y', d => y(d.orders))

  // append the enter selection to the dom
  rects.enter()
    .append('rect')
    .attr('width', x.bandwidth) // each bar's width should be 50
    .attr('height', 0) // height initially zero
    .attr('fill', 'orange')
    // starting condition(transition)
    .attr('x', d => x(d.name)) // and each bar start from i*70 on x axis
    .attr('y', graphHeight)
    // chain transition
    .transition().duration(500)
    // end condition(transition)
    .attr('y', d => y(d.orders))
    .attr('height', d => graphHeight - y(d.orders))

  // call axes
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);
}

// db.collection('dishes').get()
//   .then(res => {
//     return res.docs.map(doc => doc.data())
//   })
//   .then(data => {
//     update(data);

//     d3.interval(() => {
//       data.pop();
//       update(data);
//     }, 3000)
//   })  

let data = []

db.collection('dishes').onSnapshot(res => {
  res.docChanges().forEach(change => {
    const doc = { ...change.doc.data(), id: change.doc.id }

    switch (change.type) {
      case 'added':
        data.push(doc);
        break;
      case 'removed': {
        data = data.filter(item => item.id !== doc.id)
        break;
      }
      case 'modified': {
        const index = data.findIndex(item => item.id === doc.id);
        data[index] = doc;
        break;
      }
      default:
        break;
    }
  })
  update(data)
})

// Starting condition
// Y = graphHeight
// Height = 0;

// Ending condition
// Y = y(d.orders)
// Height = graphHeight - y(d.orders)