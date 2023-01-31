import Head from 'next/head';
import { Text, Card, Container, Row, Input, Button, Loading, Radio, Navbar, Avatar, Dropdown } from '@nextui-org/react';
import { useState } from 'react';
import { generateResponseChatGPT } from '@/utils/generateResponseChatGPT';
import Notiflix from 'notiflix';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [text, setText] = useState('');
  const [temperature, setTemperature] = useState(0.3);
  const [maxTokens, setMaxTokens] = useState(500);

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  function validateFields() {
    if (!apiKey) return 'Invalid API Key';
    if (!text) return 'Invalid text';
    if (!temperature) return 'Invalid temperature';
    if (!maxTokens) return 'Invalid max tokens';
    return null;
  }

  function formatTextToHtml(text) {
    return text
      .split('\n')
      .map((line) => `<p>${line}</p>`)
      .join('');
  }

  async function generateResponse() {
    if (loading) return;
    if (validateFields()) {
      Notiflix.Notify.failure(validateFields(), {
        zindex: 9999,
        showOnlyTheLastOne: true,
      });
      return;
    }
    setLoading(true);
    const response = await generateResponseChatGPT(apiKey, text, temperature, maxTokens);
    console.log('response: ', response);
    if (response.error) {
      Notiflix.Notify.failure(response.error.message, {
        zindex: 9999,
        showOnlyTheLastOne: true,
      });
    } else {
      setText('');
      setMessages([...messages, { you: text, bot: response.choices[0].text }]);
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
      <Container css={{ width: '100vw', background: '#f8fffb', padding: '0px', margin: '0px', maxWidth: '100vw' }}>
        <Container css={{ minHeight: '100vh', display: 'flex', flexDirection: 'col', justifyContent: 'center', alignItems: 'center', alignContent: 'space-between' }}>
          <Navbar isBordered variant="sticky" css={{ '& > *': { height: 'fit-content' }, background: 'white' }}>
            <Container css={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
              <Text h4 color="success">
                ChatGPT
              </Text>
              <Container css={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: '10px', paddingTop: '0px', gap: '20px' }}>
                <Input underlined labelLeft="Openai API Key" status="success" onChange={(e) => setApiKey(e.target.value)} />
                <Input underlined labelLeft="Temp." status="success" min={0} type="number" initialValue={0.3} onChange={(e) => setTemperature(e.target.value)} />
                <Input underlined labelLeft="Max Tokens" status="success" min={1} type="number" initialValue={500} onChange={(e) => setMaxTokens(e.target.value)} />
              </Container>
            </Container>
          </Navbar>
          <Container css={{ height: 'calc(100vh - 180px)', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            {messages &&
              messages.map((message) => {
                return (
                  <>
                    <hr />
                    <p>
                      <strong>You:</strong> {message.you}
                    </p>
                    <p style={{ display: 'flex' }}>
                      <strong>Bot:</strong>
                      <span style={{ display: 'inline-block', marginLeft: '4px' }} dangerouslySetInnerHTML={{ __html: formatTextToHtml(message.bot) }} />
                    </p>
                  </>
                );
              })}
          </Container>
          <Container css={{ paddingBottom: '20px', position: 'sticky', bottom: '0', display: 'flex', gap: '10px' }}>
            <Input disabled={loading ? true : false} clearable placeholder="Type your message..." status="success" css={{ width: 'calc(100% - 130px)' }} value={text} onChange={(e) => setText(e.target.value)} />
            <Button shadow color="success" css={{ minWidth: '120px' }} onClick={() => generateResponse()}>
              {loading ? <Loading type="points" color={'white'} /> : 'Send'}
            </Button>
          </Container>
        </Container>
      </Container>
    </>
  );
}
