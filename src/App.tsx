import { StrictMode, useEffect, useState } from "react";
import { type ButtonsConfig, Editor, InfoModal } from "ketcher-react";
import { Ketcher, type StructServiceProvider } from "ketcher-core";

import "ketcher-react/dist/index.css";

import { getStructServiceProvider } from "./utils";
import { safePostMessage } from "./utils/safePostMessage";

declare global {
  interface Window {
    ketcher: Ketcher;
  }
}

const getHiddenButtonsConfig = (): ButtonsConfig => {
  const searchParams = new URLSearchParams(window.location.search);
  const hiddenButtons = searchParams.get("hiddenControls");

  if (!hiddenButtons) return {};

  return hiddenButtons.split(",").reduce(
    (acc, button) => {
      if (button) acc[button] = { hidden: true };

      return acc;
    },
    {} as { [val: string]: { hidden: boolean } },
  );
};

const App = () => {
  const hiddenButtonsConfig = getHiddenButtonsConfig();
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [structServiceProvider, setStructServiceProvider] =
    useState<StructServiceProvider | null>(null);
  useEffect(() => {
    getStructServiceProvider().then(setStructServiceProvider);
  }, []);

  if (!structServiceProvider) {
    return <div>Loading...</div>;
  }

  return (
    <StrictMode>
      <Editor
        errorHandler={(message: string) => {
          setHasError(true);
          setErrorMessage(message.toString());
        }}
        buttons={hiddenButtonsConfig}
        disableMacromoleculesEditor
        // staticResourcesUrl="/ketcher"
        structServiceProvider={structServiceProvider}
        onInit={(ketcher: Ketcher) => {
          window.ketcher = ketcher;
          safePostMessage({
            eventType: "init",
          });
          window.scrollTo(0, 0);
        }}
        staticResourcesUrl={""}
      />
      {hasError && (
        <InfoModal
          message={errorMessage}
          close={() => {
            setHasError(false);

            // Focus on editor after modal is closed
            const cliparea: HTMLElement | null =
              document.querySelector(".cliparea");
            cliparea?.focus();
          }}
        />
      )}
    </StrictMode>
  );
};

export default App;
