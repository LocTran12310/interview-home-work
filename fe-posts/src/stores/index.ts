import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { persistReducer, persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import { select } from 'redux-saga/effects';
import { STORE_REDUCERS } from './reducers.store';
import { watcherSaga } from './saga.store';
import storage from 'redux-persist/lib/storage';

const sagaMiddleware = createSagaMiddleware();

const reducer = combineReducers(STORE_REDUCERS);

const persistConfig = {
  key: 'App',
  storage: storage,
  // stateReconciler: autoMergeLevel2 // Xem thêm tại mục "Quá trình merge".
};

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

export const persistor = persistStore(store);

sagaMiddleware.run(watcherSaga);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
// THIS IS THE ADDITIONAL SELECTOR!!!!!!!
export function* appSelect<TSelected>(
  selector: (state: RootState) => TSelected
): Generator<any, TSelected, TSelected> {
  return yield select(selector);
}

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;