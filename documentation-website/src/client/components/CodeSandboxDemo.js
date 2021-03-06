import React from 'react';

const CodeSandboxDemo = ({ id }) => (
  <div className='demo'>
    <iframe
      src={`https://codesandbox.io/embed/${id}`}
      width='100%'
      height='600px'
      sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
    ></iframe>
    <p>
      Use the three buttons at the top of the Sandbox to toggle view modes. Clicking the menu
      button in the top left corner opens a menu that allows you to switch between files.
    </p>
  </div>
)

export default CodeSandboxDemo;
