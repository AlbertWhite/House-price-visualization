import * as d3 from 'd3'

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
    .attr('class', 'stroke')
    .attr('xlink:href', '#sphere')

  // don't know what it is
  svg
    .append('use')
    .attr('class', 'fill')
    .attr('xlink:href', '#sphere')

  return svg
}
