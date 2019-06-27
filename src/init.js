// how to create a map with d3: medium.com/@andybarefoot/making-a-map-using-d3-js-8aa3637304ee
//  https://codepen.io/andybarefoot/pen/oBQKOb

import * as d3 from 'd3'
import * as topojson from 'topojson'

export const initSvg = (width, height, path) => {
  // add svg
  const svg = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  // draw earch
  svg
    .append('defs')
    .append('path')
    .datum({ type: 'Sphere' })
    .attr('id', 'sphere')
    .attr('d', path)

  // don't know what it is
  svg
    .append('use')
    .attr('class', 'fill')
    .attr('xlink:href', '#sphere')

  return svg
}

export async function initCountry(width, height, path) {
  const svg = initSvg(width, height, path)

  // zoom and pan example: http://bl.ocks.org/curran/752b97cef3f880a813ab

  // const countryJsonUrl =
  //   'https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/world-50m.json'

  const countryJsonUrl =
    'https://raw.githubusercontent.com/AlbertWhite/visualization/master/static/world.json'
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

  return svg
}
