export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig()

  try {

    const body = await readBody(event)
    const n8nUrl = `${config.n8n.url}/webhook/d62d31ea-95d3-4e08-a691-e1d37be18b0a`
    const n8nResponse = await $fetch(n8nUrl, {
      method: 'POST',
      body: body
    })
    return n8nResponse[0].output

  } catch (error) {

  }

})

