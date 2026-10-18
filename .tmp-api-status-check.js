fetch('http://127.0.0.1:4000/api/products?limit=1')
  .then(async (response) => {
    const body = await response.json();
    console.log(`STATUS=${response.status}`);
    console.log(`SUCCESS=${body.success === true}`);
    console.log(`COUNT=${Array.isArray(body.data) ? body.data.length : 'not-array'}`);
  })
  .catch((error) => {
    console.log(`ERROR=${error.message}`);
    process.exit(1);
  });
