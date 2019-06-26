import * as d3 from 'd3'
import * as topojson from 'topojson'
import d3Tip from 'd3-tip'
import { initSvg } from './initSvg'
import './index.scss'
import 'babel-polyfill'

const xColumn = 'longitude'
const yColumn = 'latitude'
const rColumn = 'price'
const peoplePerPixel = 5000
const width = 1060
const height = 450
// https://github.com/d3/d3-geo#geoPath
// maybe we can do something here to make the map bigger
const projection = d3.geoMercator()
const path = d3.geoPath().projection(projection)

const countryJsonUrl =
  'https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/world-50m.json'

;(async () => {
  const svg = initSvg(width, height, path)
  const world = await d3.json(countryJsonUrl)

  const countries = topojson.feature(world, world.objects.countries).features

  // add countries
  svg
    .selectAll('.country')
    .data(countries)
    .enter()
    .insert('path', '.graticule')
    .attr('class', 'country')
    .attr('d', path)

  const populationFormat = d3.format(',')
  const tip = d3Tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return d.name + ': ' + populationFormat(d.price)
    })

  svg.call(tip)

  const rScale = d3.scaleSqrt()

  function render(data) {
    rScale.domain([
      0,
      d3.max(data, function(d) {
        return d[rColumn]
      })
    ])

    // Compute the size of the biggest circle as a function of peoplePerPixel.
    const peopleMax = rScale.domain()[1]
    const rMin = 0
    const rMax = Math.sqrt(peopleMax / (peoplePerPixel * Math.PI))
    rScale.range([rMin, rMax])

    const circles = svg.selectAll('circle').data(data)
    circles
      .enter()
      .append('svg:circle')
      .attr('cx', function(d) {
        return projection([d[xColumn], d[yColumn]])[0]
      })
      .attr('cy', function(d) {
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
})()

// dont'know what it is
// d3.select(self.frameElement).style('height', height + 'px')
