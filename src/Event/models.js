import Debug from 'debug'
const debug = Debug('Event:models:event:log')
const error = Debug('Event:models:event:error')

debug('loading')
export function newEvent(options, graph = {}) {
  const event = {}
  if (!options.id) {
    error('Events require an ID to be created')
    return {}
  }

  Object.assign(event, {
    title: '',
    description: '',
    graph: Object.assign(graph, {
      edges: {},
      blocks: {},
      dependencies: {},
      first: null,
      last: null
    })
  }, options)

  return event
}

export default class Event {


  get relatedEvents() {
    return this.edges
  }

  addConnection(event) {
    this.connections[event.id] = event

    return this
  }

  removeDependency(event) {
    delete this.dependencies[event.id]

    return this
  }

  addDependency(event) {
    event.addConnection(this).removeDependency(this)
    this.addConnection(event).dependencies[event.id] = event
  }

  isBlockedBy(event) {
    event.blocks(this)
    this.blockedBy[event.id] = event
  }
}
debug('loaded')