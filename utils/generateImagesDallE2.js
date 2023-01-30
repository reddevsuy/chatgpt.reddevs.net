export async function generateImageDallE2(token, text, size, quantity) {
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: 'image-alpha-001',
        prompt: text,
        num_images: parseInt(quantity),
        size: `${size}`,
      }),
    });
    const json = await response.json();
    return json;
  } catch (err) {
    console.error(err);
  }
}
