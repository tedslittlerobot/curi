import React from 'react';
import { Link } from '@curi/react';

import BasePackage from './base/BasePackage';
import APIBlock from './base/APIBlock';
import { InlineJS as IJS, PrismBlock } from '../components/PrismBlocks';
import { Section } from '../components/Sections';

export default ({ name, version, globalName }) => (
  <BasePackage
    name={name}
    version={version}
    globalName={globalName}
    about={(
      <div>
        <p>
          Hickory, the history package that Curi uses, uses the <IJS>pushState</IJS>
          {' '}and <IJS>replaceState</IJS> methods for navigation. Unfortunately, these
          do not trigger scrolling to the top of the page when you navigate. This package provides
          a side effect function that will scroll to the top of the page whenever those functions
          are used for navigation.
        </p>
        <p>
          Other types of navigation, such as clicking the browser's back and forward buttons,
          will rely on the browser to correctly restore the scroll position.
        </p>
      </div>
    )}
  >
    <APIBlock>
      <Section
        tag='h3'
        title='createScrollSideEffect'
        id='createScrollSideEffect'
      >
        <PrismBlock lang='javascript'>      
          {
`import createConfig from '@curi/core';
import createScrollSideEffect from '@curi/side-effect-scroll';

const scrollTo = createScrollSideEffect();

const config = createConfig(history, routes, {
  sideEffects: [scrollTo]
});`
          }
        </PrismBlock>
      </Section>
    </APIBlock>
  </BasePackage>
);
