import { BrowserRouter } from "react-router-dom";
import { App, initPageData } from "./App";
import { createRoot } from "react-dom/client";
import { DataContext } from "./hooks";

async function renderInBrower() {
  const containerEl = document.getElementById("root");
  if (!containerEl) {
    throw new Error("#root element not found");
  }
  const pageData = await initPageData(location.pathname);
  createRoot(containerEl).render(
    <DataContext.Provider value={pageData}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DataContext.Provider>
  );
}

renderInBrower();
