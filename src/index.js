import * as d3 from 'd3'

import d3Tip from 'd3-tip'
import { initCountry } from './init'
import './index.scss'
import 'babel-polyfill'

const xColumn = 'longitude'
const yColumn = 'latitude'
const rColumn = 'price'
const width = 1060
const height = 850
// https://github.com/d3/d3-geo#geoPath
// maybe we can do something here to make the map bigger
const projection = d3.geoMercator()
const path = d3.geoPath().projection(projection)

;(async () => {
  const svg = await initCountry(width, height, path)

  const priceFormat = d3.format(',')

  // create tooltip
  const tip = d3Tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(d => d.name + ': ' + priceFormat(d.price))
  svg.call(tip)

  // renderCity
  const renderCity = data => {
    const rScale = d3.scaleSqrt()
    rScale.domain([
      0,
      d3.max(data, function(d) {
        return d[rColumn]
      })
    ])

    // Compute the size of the biggest circle as a function of peoplePerPixel.
    const peopleMax = rScale.domain()[1]
    const rMin = 0
    const peoplePerPixel = 50
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

  const cityDataType = d => {
    d.latitude = +d.latitude
    d.longitude = +d.longitude
    d.price = +d.price
    return d
  }

  d3.dsv(
    ',',
    'https://raw.githubusercontent.com/AlbertWhite/visualization/master/static/cities.csv',
    cityDataType
  ).then(renderCity)
})()
