import { applyMiddleware, createStore, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducer from "./reducers";
import { composeWithDevTools } from "redux-devtools-extension";

const configureStore = (preloadedState) => {
    const middlewares = [thunkMiddleware];
    const middlewareEnhancer = applyMiddleware(...middlewares);

    const enhancers = [middlewareEnhancer];
    let composedEnhancers;
    if (composeWithDevTools) {
        composedEnhancers = composeWithDevTools(...enhancers);
    } else {
        composedEnhancers = compose(...enhancers);
    }

    const store = createStore(rootReducer, preloadedState, composedEnhancers);

    // Hot reloading of reducers, see https://redux-docs.netlify.com/recipes/configuring-your-store#hot-reloading
    if (process.env.NODE_ENV !== "production" && module.hot) {
        module.hot.accept("./reducers", () => store.replaceReducer(rootReducer));
    }

    return store;
};

export default configureStore;
