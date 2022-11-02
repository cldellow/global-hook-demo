import React from 'react';
import globalHook, { Store as GlobalStore } from 'use-global-hook';
import { Cookie, useCookieContext } from './CookieContext';

interface UndefinedState {
  state: 'undefined';
}

interface LoadingState {
  state: 'loading';
}

interface LoadedState {
  state: 'loaded';
  value: string;
}

export type CookieState = UndefinedState | LoadingState | LoadedState;

export interface GlobalState {
  cookie: CookieState;
}

const initialState: GlobalState = {
  cookie: { state: 'undefined' }
}

export type Store = GlobalStore<GlobalState, GlobalActions>;

export interface GlobalActions {
}

const actions: GlobalActions = {}

let count = 0;

const getCookieValue = async () => {
  await new Promise(f => setTimeout(f, 1000));

  return 'non-pluggable value ☹️';
}

const initializer = async (store: Store) => {
  console.log(`! initializer running ${count}`);
  count++;
  store.setState({
    ...store.state,
    cookie: { state: 'loading' }
  });

  // TODO: how to make this pluggable?
  const cookieValue = await getCookieValue();
  store.setState({
    ...store.state,
    cookie: { state: 'loaded', value: cookieValue }
  });
}

const mkInitializer = (getCookieValue: () => Promise<Cookie>) => {
  console.log(`! mkInitializer running`);
  async function f(store: Store) {
    console.log(`! initializer running ${count}`);
    count++;
    store.setState({
      ...store.state,
      cookie: { state: 'loading' }
    });

    const cookieValue = await getCookieValue();
    store.setState({
      ...store.state,
      cookie: { state: 'loaded', value: cookieValue.value }
    });
  }

  return f;
}

type GlobalVals = [GlobalState, GlobalActions];

// This doesn't work. The context gets initialized, and is stable,
// but listeners aren't notified when the context changes.
/*
const useGlobal = () => {
  const cookie = useCookieContext();
  return React.useMemo(() => globalHook(
      React,
      initialState,
      actions,
      mkInitializer(cookie!.getCookieValue)
    ),
    [cookie]
  );
}
*/

const useGlobal: () => GlobalVals = globalHook(
  React,
  initialState,
  actions,
  initializer
);

/*
// This works, but isn't pluggable
const useGlobal: () => GlobalVals = globalHook(
  React,
  initialState,
  actions,
  initializer
);
*/

/*
// This doesn't work - the initializer runs repeatedly
const useGlobal: () => GlobalVals = () => {
  return globalHook(
    React,
    initialState,
    actions,
    initializer
  )();
}
*/


export default useGlobal;
