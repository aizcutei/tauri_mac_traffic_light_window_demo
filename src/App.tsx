import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { WebviewWindow } from "@tauri-apps/api/window";

function Close() {
  const mainWindow = WebviewWindow.getByLabel('main')

  if (mainWindow) {
      mainWindow.close()
  }
}

async function Maxinize() {
  const mainWindow = WebviewWindow.getByLabel('main')

  if (mainWindow) {
      if (await mainWindow.isMaximized()) {
          mainWindow.toggleMaximize()
      }else{
          mainWindow.toggleMaximize()
      }
  }
}

function Minimize() {
  const mainWindow = WebviewWindow.getByLabel('main')

  if (mainWindow) {
      mainWindow.minimize()
  }
}

async function FocusMonitor() {
  let [focus, setFocus] = useState(false)

  const mainWindow = WebviewWindow.getByLabel('main')

  if (mainWindow) {
      const unlisten = await mainWindow.onFocusChanged(({ payload: focused }) => {
          setFocus(focused)
      });
  }
  return focus
}

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  let [focusClassName, setFocusClassName] = useState("titlebar focus")

  FocusMonitor().then( result => {
      if (result) {
          setFocusClassName("titlebar focus")
      }else{
          setFocusClassName("titlebar")
      }
  })




  return (<>
        <div>
            <div data-tauri-drag-region className={focusClassName}>
                <div className="traffic-lights">
                    <div className="traffic-light traffic-light-close" id="close" onClick={() => Close()}></div>
                    <div className="traffic-light traffic-light-minimize" id="minimize" onClick={() => Minimize()}></div>
                    <div className="traffic-light traffic-light-maximize" id="maximize" onClick={() => Maxinize()}></div>
                </div>
            </div>
        </div>

    <div className="container">
      <h1>Welcome to Tauri!</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <p>
        Click on the Tauri, Vite, and React logos to learn more about each
        framework.
      </p>

      <div className="row">
        <div>
          <input
            id="greet-input"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a name..."
          />
          <button type="button" onClick={() => greet()}>
            Greet
          </button>
        </div>
      </div>
      <p>{greetMsg}</p>
    </div>
    </>
  );
}

export default App;
