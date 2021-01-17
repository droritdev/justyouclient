import React, {useReducer} from 'react';

import CategoryReducer from '../reducers/CategoryReducer';

export const CategoryContext = React.createContext();

const CategoryContextProvider = ({children}) => {
    const [category, dispatchCategory] = useReducer(CategoryReducer, "");

    return(
        <CategoryContext.Provider value={{category, dispatchCategory }}>
            {children}
        </CategoryContext.Provider>
    );
}

export default CategoryContextProvider;