import React from 'react';
import BasePackage from '../components/BasePackage';
import {
  PrismBlock,
  InlineJS as IJS
} from '../components/PrismBlocks';
import APIBlock from '../components/APIBlock';
import { Section } from '../components/Sections';
import { Note } from '../components/Messages';
import { Link } from '@curi/react';

export default ({ name, version, globalName }) => (
  <BasePackage name={name} version={version} globalName={globalName}>
    <APIBlock>
      <PrismBlock lang='javascript'>
        {
`import {
  syncResponses,
  responseReducer,
  configReducer
} from '@curi/react-block';`
        }
      </PrismBlock>

      <Section
        title='syncResponses'
        id='syncResponses'
      >
        <p>
          <IJS>syncResponses</IJS> is responsible for linking your Redux store with your Curi
          configuration object. It subscribes to your configuration object with a function that
          will dispatched a "location changed" event to the Redux store.
        </p>
        <Note>
          <p>
            You will probably want to wait for your configuration object to generate its initial
            response before syncing by using <IJS>config.ready</IJS>. Otherwise, the initial
            response will be <IJS>undefined</IJS>.
          </p>
        </Note>
        <PrismBlock lang='javascript'>
          {
`const config = createConfig(history, routes);
const store = createStore(reducer);

config.ready().then(() => {
  syncResponses(store, config);
});`
          }
        </PrismBlock>
      </Section>

      <Section
        title='responseReducer'
        id='responseReducer'
      >
        <p>
          You can use the <IJS>responseReducer</IJS> to automatically store the latest response
          object in your Redux store.
        </p>
        <PrismBlock lang='javascript'>
          {
`const reducer = combineReducers({
  response: responseReducer,
  ...
});
const store = createStore(reducer);`
          }
        </PrismBlock>
      </Section>

      <Section
        title='configReducer'
        id='configReducer'
      >
        <p>
          The <IJS>configReducer</IJS> can be used to store your Curi configuration object in
          your Redux store. This isn't really necessary, but can be convenient.
        </p>
        <PrismBlock lang='javascript'>
          {
`const reducer = combineReducers({
  curi: configReducer,
  ...
});
const store = createStore(reducer);`
          }
        </PrismBlock>
      </Section>

    </APIBlock>
  </BasePackage>
);