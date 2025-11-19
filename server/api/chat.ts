export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig()

  try {

    const body = await readBody(event)
    const n8nUrl = `${config.n8n.url}/webhook/d62d31ea-95d3-4e08-a691-e1d37be18b0a`
    const n8nResponse = await $fetch(n8nUrl, {
      method: 'POST',
      body: body
    })
    if (Array.isArray(n8nResponse) && n8nResponse.length === 1) {
      return n8nResponse[0].output
    }
    else {
      throw createError({
        statusCode: 500,
        statusMessage: 'Processing Error',
        message: 'Too many request'
      })
    }

  } catch (error) {
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Processing Error',
      message: 'Failed to process webhook data, please try later'
    })

  }

})

