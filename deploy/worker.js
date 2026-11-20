export default {
  async fetch(request, env) {
    // The API lives in the Java service; this Worker only serves the site.
    return env.ASSETS.fetch(request)
  },
}
