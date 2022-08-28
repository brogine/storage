import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
  PreloadedState,
} from '@reduxjs/toolkit'
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import keyValueStorageSliceReducer from '../features/keyValueStorage/keyValueStorageSlice'

const rootReducer = combineReducers({
  storage: keyValueStorageSliceReducer,
})

const persistConfig = {
  key: 'root',
  version: 1,
  storage, // Storage option
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: persistedReducer,
    preloadedState,
    middleware: getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  })
}

export const store = setupStore()
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']

export default setupStore
