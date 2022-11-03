import React from 'react';
import './App.css';
import { useCookieContext, CookieContextProvider } from './CookieContext';
import useGlobal from './use-global';

/*
Goal is to repro the problem I'm having in webapp.

1. I want to inject initial state into use-global-hook via a provider
2. This requires using a hook to access the context.
3. use-global-hook default export is not parameterizable.
4. This means we need to return some closure that accesses the context, then
   returns use-global-hook.
5. This seems to break the world.

<CookieContextProvider>
  <StoreLoadedProvider>
    <ThingThatUsesTheStore>
*/

const ShowCookieValue = () => {
  const [state, setState] = React.useState(0);
  const [store] = useGlobal();

  return <div>ShowCookieValue: <button onClick={() => setState(state + 1)}>incr ({state})</button> {JSON.stringify(store.cookie)}</div>
}

const NestedShowCookieValue = () => {
  const [state, setState] = React.useState(false);

  return <div>NestedShowCookieValue: <button onClick={() => setState(!state)}>toggle</button> {state && <ShowCookieValue/>}</div>
}

const EnsureInitialized = (props: React.PropsWithChildren<unknown>) => {
  const global = useGlobal();
  const [store, actions] = global;
  const { getCookieValue } = useCookieContext()!;

  console.log('EnsureInitialized render');

  React.useEffect(() => {
    console.log(`! useEffect running: store.initialized=${store.initialized}`);
    if (store.initialized === true)
      return;

    console.log(`! running initializer`);
    actions.initialize(getCookieValue);

    return () => {
      console.log(`! cleanup`);
    }
  }, [
    actions,
    store.initialized,
    getCookieValue
  ]);

  if (!store.initialized)
    return <b>Loading...</b>;

  return <>
    {props.children}
  </>
}

function App() {
  const cookieValue = { value: Math.floor(Math.random() * 10000).toString(36) }
  const cookieFn = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return cookieValue;
  }

  console.log(`! app render`);
  return (
    <div>
      <CookieContextProvider getCookieValue={cookieFn}>
        <EnsureInitialized>
          ok
          <ShowCookieValue/>
          <NestedShowCookieValue/>
        </EnsureInitialized>
      </CookieContextProvider>
    </div>
  );
}

export default App;
