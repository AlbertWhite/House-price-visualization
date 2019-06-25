import * as d3 from 'd3'
import * as topojson from 'topojson'
import d3Tip from 'd3-tip'
import './index.scss'

var xColumn = 'longitude'
var yColumn = 'latitude'
var rColumn = 'price'
var peoplePerPixel = 50000

var width = 960,
  height = 580
var projection = d3.geoMercator()

var path = d3.geoPath().projection(projection)

var graticule = d3.geoGraticule()

var svg = d3
  .select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height)

svg
  .append('defs')
  .append('path')
  .datum({ type: 'Sphere' })
  .attr('id', 'sphere')
  .attr('d', path)

svg
  .append('use')
  .attr('class', 'stroke')
  .attr('xlink:href', '#sphere')

svg
  .append('use')
  .attr('class', 'fill')
  .attr('xlink:href', '#sphere')

svg
  .append('path')
  .datum(graticule)
  .attr('class', 'graticule')
  .attr('d', path)

d3.json(
  'https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/world-50m.json'
).then(world => {
  var countries = topojson.feature(world, world.objects.countries).features,
    neighbors = topojson.neighbors(world.objects.countries.geometries)

  svg
    .selectAll('.country')
    .data(countries)
    .enter()
    .insert('path', '.graticule')
    .attr('class', 'country')
    .attr('d', path)
    .style('fill', '#fff')

  var populationFormat = d3.format(',')
  var tip = d3Tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return d.name + ': ' + populationFormat(d.price)
    })

  svg.call(tip)

  var rScale = d3.scaleSqrt()

  function render(data) {
    rScale.domain([
      0,
      d3.max(data, function(d) {
        return d[rColumn]
      })
    ])

    // Compute the size of the biggest circle as a function of peoplePerPixel.
    var peopleMax = rScale.domain()[1]
    var rMin = 0
    var rMax = Math.sqrt(peopleMax / (peoplePerPixel * Math.PI))
    rScale.range([rMin, rMax])

    var circles = svg.selectAll('circle').data(data)
    circles
      .enter()
      .append('svg:circle')
      .attr('cx', function(d) {
        return projection([d[xColumn], d[yColumn]])[0]
      })
      .attr('cy', function(d) {
        // console.warn('alb', d[xColumn])
        // console.warn('alb', d[yColumn])
        return projection([d[xColumn], d[yColumn]])[1]
      })
      .attr('r', function(d) {
        return rScale(d[rColumn])
      })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
    circles.exit().remove()
  }

  function type(d) {
    d.latitude = +d.latitude
    d.longitude = +d.longitude
    d.price = +d.price
    return d
  }

  d3.dsv(
    ',',
    'https://raw.githubusercontent.com/AlbertWhite/visualization/master/static/cities.csv',
    type
  ).then(render)
})

d3.select(self.frameElement).style('height', height + 'px')
