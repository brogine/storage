import { combineReducers, configureStore, PreloadedState } from '@reduxjs/toolkit'
import keyValueStorageSliceReducer from '../features/keyValueStorage/keyValueStorageSlice'

const rootReducer = combineReducers({
  storage: keyValueStorageSliceReducer,
})

const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']

export default setupStore
