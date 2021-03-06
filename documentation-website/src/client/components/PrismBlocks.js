import React from 'react';
import {PrismCode} from 'react-prism';

export const InlineJS = ({ children }) => (
  <PrismCode className='language-javascript'>{children}</PrismCode>
);

export const InlineComponent = ({ children }) => (
  <PrismCode className='language-jsx'>&lt;{children}&gt;</PrismCode>
);

export const PrismBlock = ({ lang, children }) => (
  <PrismCode
    className={`language-${lang}`}
    component='pre'
  >
    {children}
  </PrismCode>
);
