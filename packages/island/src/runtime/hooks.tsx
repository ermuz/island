import { createContext, useContext } from "react";
import { PageData } from "../shared/types";

const initValue = {} as PageData;

export const DataContext = createContext<PageData>(initValue);

export const usePageData = () => useContext<PageData>(DataContext);
