import React from 'react';
import globalHook, { Store as GlobalStore } from 'use-global-hook';

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

const getCookieValue = async () => {
  await new Promise(f => setTimeout(f, 5000));

  return 'cookie value';
}

const initializer = async (store: Store) => {
  console.log(`! initializer running`);
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

type GlobalVals = [GlobalState, GlobalActions];
const useGlobal: () => GlobalVals = globalHook(
  React,
  initialState,
  actions,
  initializer
);

export default useGlobal;
