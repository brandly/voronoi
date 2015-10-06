import d3 from 'd3'
import please from 'pleasejs'
import viewport from 'viewport-size'

const colorCount = 9
const initialVerticesCount = 50
const colors = getListOfColors(colorCount)

let width = viewport.getWidth()
let height = viewport.getHeight()

function getListOfColors (count) {
  return d3.range(count).map(function () {
    return please.make_color()
  })
}

const vertices = d3.range(initialVerticesCount).map(function (d) {
  return [Math.random() * width, Math.random() * height]
})

const voronoi = d3.geom.voronoi()
    .clipExtent([[0, 0], [width, height]])

const svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height)
    .on('mousemove', function () {
      vertices[0] = d3.mouse(this)
      redraw()
    })
    .on('click', function () {
      vertices.push(d3.mouse(this))
      redraw()
    })

let path = svg.append('g').selectAll('path')

redraw()

function redraw () {
  svg.selectAll('circle')
      .data(vertices.slice(1))
    .enter().append('circle')
      .attr('transform', function (d) { return 'translate(' + d + ')' })
      .attr('r', 1.5)

  path = path
      .data(voronoi(vertices), polygon)

  path.exit().remove()

  path.enter().append('path')
      .style('fill', function (d, i) { return colors[(i % colorCount)] })
      .attr('d', polygon)

  path.order()
}

function polygon (d) {
  if (!d) return
  return 'M' + d.join('L') + 'Z'
}
