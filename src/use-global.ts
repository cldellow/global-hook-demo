import React from 'react';
import globalHook, { Store as GlobalStore } from 'use-global-hook';
import { Cookie }  from './CookieContext';

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
  initialized: boolean;
  cookie: CookieState;
}

const initialState: GlobalState = {
  initialized: false,
  cookie: { state: 'undefined' }
}

export type Store = GlobalStore<GlobalState, GlobalActions>;

export interface GlobalActions {
  initialize: (getCookieValue: () => Promise<Cookie>) => Promise<void>,
}

const actions = {
  initialize: async (store: Store, getCookieValue: () => Promise<Cookie>) => {
    console.log(`! initializer running ${count}`);
    count++;
    store.setState({
      ...store.state,
      cookie: { state: 'loading' }
    });

    const cookieValue = await getCookieValue();
    store.setState({
      ...store.state,
      initialized: true,
      cookie: { state: 'loaded', value: cookieValue.value }
    });

  }
}

let count = 0;

const initializer = async (store: Store) => {
  console.log(`! initializer is a no-op`);
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
