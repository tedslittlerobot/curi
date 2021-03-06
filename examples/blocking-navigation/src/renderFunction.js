import Nav from './components/Nav';

function render(response) {
  if (!response) {
    return null;
  }
  const { body:Body } = response;
  return (
    <div>
      <Nav />
      <Body />
    </div>
  );
}

export default render;
