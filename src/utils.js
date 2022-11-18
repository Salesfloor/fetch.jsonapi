import qs from 'query-string'

const paramsToString = (query, options) =>
  [query || ''].concat(options).filter(v => v).join(',') || undefined

export const buildUrl = (originalUrl, options = {}) => {
  const { url, query = {} } = qs.parseUrl(originalUrl)
  options = Object.assign({}, options)

  // formatted query
  Object.keys(options).forEach(k => {
    if (options[k] === null) {
      Object.assign(query, qs.parse(k))
      delete options[k]
    }
  })

  // includes
  query.include = paramsToString(query.include, options.include)
  delete options.include

  // sort
  query.sort = paramsToString(query.sort, options.sort)
  delete options.sort

  // filter
  Object.keys(options.filter || {}).forEach(k => {
    const filterKey = `filter[${k}]`
    query[filterKey] = paramsToString(query[filterKey], options.filter[k])
  })
  delete options.filter

  // page
  Object.keys(options.page || {}).forEach(k => {
    const pageKey = `page[${k}]`
    query[pageKey] = options.page[k]
  })
  delete options.page

  // everything else
  Object.assign(query, options)

  const queryString = qs.stringify(query)
  return queryString ? `${url}?${queryString}` : url
}

/**
  * Creates and store counter.
  * Returns object with next() method. 
  * May format counter as a string.
  * 
  * @param {number} startsWith The number to start the counter
  * @param {boolean} formatAsString Format counter as a string 
  * @returns {object}
  */
export const createCounter = (startsWith = 0, formatAsString = false) => {
  let counter = startsWith;

  return {
    next: function () {
      return formatAsString ? `${counter++}` : counter++;
    }
  };
}

export const getRandomId = () =>
  `${Math.floor(Math.random() * (100000 - 10000)) + 10000}`

export default {
  buildUrl,
  createCounter,
  getRandomId
}
