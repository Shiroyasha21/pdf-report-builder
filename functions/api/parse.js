export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json()
    const ai = context.env.AI

    if (!ai) {
      return new Response(JSON.stringify({ error: 'AI binding not configured' }), {
        status: 500, headers: { 'Content-Type': 'application/json' }
      })
    }

    const response = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 4096,
    })

    return new Response(JSON.stringify({ content: response.response }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    })
  }
}
