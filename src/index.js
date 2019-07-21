import * as d3 from 'd3'

import d3Tip from 'd3-tip'
import { initCountry } from './init'
import './index.scss'
import 'babel-polyfill'

const xColumn = 'longitude'
const yColumn = 'latitude'
const priceColumn = 'price'
const ratioColumn = 'ratio'
const width = window.innerWidth
let height = window.innerWidth / 2 // the map is 2:1

if (height < 210) {
  // deal with responsive
  height = 500
}

// https://github.com/d3/d3-geo#geoPath
// maybe we can do something here to make the map bigger
const projection = d3
  .geoEquirectangular()
  .scale([width / (2 * Math.PI)]) // scale to fit group width
  .translate([width / 2, height / 2]) // ensure centred in group
const path = d3.geoPath().projection(projection)

;(async () => {
  const svg = await initCountry(width, height, path)

  const renderToolTip = d => {
    return `
    <div class="tooltip">
      <div class="cityName">${d.name}</div>
      <div class="cityPrice">Average price (m<sup>2</sup>): <b>$${
        d.price
      }</b></div>
      <div>Price to income ratio: <b>${d.ratio}</b></div>
    </div>
      `
  }

  // create tooltip
  const tip = d3Tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(renderToolTip)
  svg.call(tip)

  // renderCity
  const renderCity = data => {
    const rScale = d3.scaleSqrt()
    rScale.domain([
      0,
      d3.max(data, function(d) {
        return d[ratioColumn]
      })
    ])

    // Compute the size of the biggest circle as a function of peoplePerPixel.
    const peopleMax = rScale.domain()[1]
    const rMin = 0
    const peoplePerPixel = 0.08
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
        return rScale(d[ratioColumn])
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

  // entry point
  d3.dsv(
    ',',
    'https://raw.githubusercontent.com/AlbertWhite/visualization/master/static/cities.csv',
    cityDataType
  ).then(renderCity)

  // add header
  const headerHeight =
    window.innerHeight - document.querySelector('svg').clientHeight
  document.querySelector('.header').style.height = `${headerHeight}px`
})()
