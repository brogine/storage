/* eslint-disable @typescript-eslint/ban-types */
import React, { PropsWithChildren } from 'react'
import { render, renderHook } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import type { PreloadedState } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import type { RootState } from '../store'
import storageReducer from '../features/keyValueStorage/keyValueStorageSlice'

const testState = { storage: { records: {}, transactions: [], logs: [] } } as RootState
const testStore = (state: RootState) => {
  return configureStore({ reducer: { storage: storageReducer }, preloadedState: state })
}

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>
  store?: ReturnType<typeof testStore>
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = testState,
    // Automatically create a store instance if no store was passed in
    store = testStore(testState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren<any>): JSX.Element {
    return <Provider store={store}>{children}</Provider>
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

export function renderHookWithProvider<T>(
  hook: Function,
  store = configureStore({ reducer: { storage: storageReducer } }),
) {
  function Wrapper({ children }: PropsWithChildren<any>): JSX.Element {
    return <Provider store={store}>{children}</Provider>
  }

  return renderHook(() => hook(), { wrapper: Wrapper })
}
