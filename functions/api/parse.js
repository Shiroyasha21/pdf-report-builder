export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json()
    const key = context.env.GROQ_API_KEY

    if (!key) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500, headers: { 'Content-Type': 'application/json' }
      })
    }

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 4096,
      })
    })

    const data = await res.json()

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || 'Groq API error' }), {
        status: res.status, headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ content: data.choices[0].message.content }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    })
  }
}
