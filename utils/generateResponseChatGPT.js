export async function generateResponseChatGPT(token, text, temperature, max_tokens) {
  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: text,
        temperature: parseInt(temperature),
        max_tokens: parseInt(max_tokens),
      }),
    });
    const json = await response.json();
    return json;
  } catch (err) {
    console.error(err);
  }
}
