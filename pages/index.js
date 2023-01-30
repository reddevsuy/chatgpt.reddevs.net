import Head from 'next/head';
import { Text, Card, Container, Row, Input, Button, Loading, Radio } from '@nextui-org/react';
import { useState } from 'react';
import { generateImageDallE2 } from '@/utils/generateImagesDallE2';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [text, setText] = useState('');
  const [size, setSize] = useState('256x256');
  const [quantity, setQuantity] = useState('');

  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function validateFields() {
    if (!apiKey) return 'Invalid API Key';
    if (!text) return 'Invalid text';
    if (!size) return 'Invalid size';
    if (!quantity) return 'Invalid quantity';
    return null;
  }

  const copyToClipboard = (url) => {
    const el = document.createElement('textarea');
    el.value = url;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  async function generateImages() {
    setError('');
    if (loading) return;
    if (validateFields()) {
      setError(validateFields);
      return;
    }
    setLoading(true);
    const response = await generateImageDallE2(apiKey, text, size, quantity);
    console.log('response: ', response);
    if (response.error) {
      setError(response.error.message);
    } else {
      setImages([...images, ...response.data]);
    }
    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>CHAT GPT</title>
        <meta name="description" content="CHAT GPT" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Container css={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: '30px', padding: '50px' }}>
        <Text
          size={40}
          css={{
            textGradient: '45deg, #17C964 20%, #108944 70%',
            textAlign: 'center',
          }}
          weight="bold"
        >
          CHAT GPT
        </Text>
        <Container css={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Input
            bordered
            labelPlaceholder="Openai API Key"
            color="success"
            onChange={(e) => {
              setApiKey(e.target.value);
              setError('');
            }}
            status="success"
          />
          <Input
            bordered
            labelPlaceholder="Text"
            color="success"
            onChange={(e) => {
              setText(e.target.value);
              setError('');
            }}
            status="success"
            css={{ marginTop: '40px' }}
          />
          <Radio.Group label="Select size" value={size} onChange={setSize} color="success" css={{ marginTop: '20px' }}>
            <Radio size="xs" value="256x256">
              256x256
            </Radio>
            <Radio size="xs" value="512x512">
              512x512
            </Radio>
            <Radio size="xs" value="1024x1024">
              1024x1024
            </Radio>
          </Radio.Group>
          <Input
            bordered
            type="number"
            labelPlaceholder="Quantity"
            color="success"
            min={1}
            onChange={(e) => {
              setQuantity(e.target.value);
              setError('');
            }}
            status="success"
            css={{ marginTop: '40px' }}
          />
        </Container>
        <Container css={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
          <Button color="success" onClick={generateImages} shadow>
            {!loading && 'Send'}
            {loading && <Loading type="points" color={'white'} />}
          </Button>
          {error && (
            <Text color={'error'} weight={'bold'} css={{ textAlign: 'center' }}>
              {error}
            </Text>
          )}
        </Container>
        {images.length > 0 && (
          <>
            <Button
              color="success"
              onClick={() => {
                setImages([]);
              }}
              bordered
            >
              Delete all
            </Button>
            <Container css={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '20px', maxWidth: 'fit-content' }}>
              {images.map((image) => {
                return (
                  <>
                    <Container css={{ maxWidth: 'fit-content', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                      <a href={image.url} target="_blank" rel="noreferrer">
                        <img key={image.url} src={image.url}></img>
                      </a>
                      <Button color="success" onClick={() => copyToClipboard(image.url)}>
                        Copy URL
                      </Button>
                    </Container>
                  </>
                );
              })}
            </Container>
          </>
        )}
      </Container>
    </>
  );
}
