const { builder } = require('@netlify/functions');

function getHTML({ type, values }) {
  const renderTime = new Date(Date.now()).toISOString();

  let displayName;
  let colorValue;
  if (type === 'hex') {
    displayName = 'Hex';
    const [hexValue = '000'] = values;
    colorValue = `#${hexValue}`;
  } else if (type === 'rgb') {
    displayName = 'RBG';
    const [r = 255, g = 255, b = 255] = values;
    colorValue = `rgb(${r} ${g} ${b})`;
  } else if (type === 'hsl') {
    displayName = 'HSL';
    const [h = 0, s = 100, l = 50] = values;
    colorValue = `hsl(${h} ${s}% ${l}%)`;
  } else if (type === 'named') {
    displayName = 'Named';
    const [color = 'black'] = values;
    colorValue = color;
  }

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${displayName} Color: ${colorValue} — Every Color</title>
    <link rel="stylesheet" href="/assets/styles.css" />
  </head>
  <body style="--background: ${colorValue}">
    <header>
      <nav>
        <a href="/" rel="home">Every Color</a>
      </nav>
    </header>
    <main>
      <h1>${displayName} Color: ${colorValue}</h1>
      <p>Rendered at ${renderTime}</p>
    </main>
  </body>
</html>
  
`;
}

const handler = async (event) => {
  const { path } = event;
  const [, type, ...values] = path.split('/');

  console.log({ type, values });
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: getHTML({ type, values }),
  };
};

exports.handler = builder(handler);
