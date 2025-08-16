import {useState} from 'react'
import Editor from "@monaco-editor/react";
import { useEditorStore } from '@/store/Store';
import Split from "react-split";
import "./split.css"; // We'll add styles here


const TextEditor =() => {
const { code, setCode } = useEditorStore();
const [theme,setTheme]=useState("vs-dark");
  return (
    <>
    <button
    onClick={() => setTheme(theme === "vs-dark" ? "vs" : "vs-dark")}>
        Theme
    </button>

    <div style={{height:"50vh"}}>
           <Split
             className="split"
        sizes={[50, 50]} // initial split percentage
        minSize={200}    // min width for each panel
        gutterSize={6}   // thickness of drag handle
           >
            <Editor
      height="400px"
      defaultLanguage="javascript"
      value={code}
      theme={theme}// options: vs, vs-dark, hc-black
      onChange={(value) => setCode('')}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
      }}
    />
    <div className="flex flex-col">
        <div className="flex flex-col">
             <h2 className="text-black font-bold text-justify">AI Suggestion</h2>
             <button className="text-center">Turn Off AI</button>
        </div>
       
        <div className='flex-1 bg-slate-400'>Use for loop</div>
    </div>
       </Split>
       <div>
        Problem Statement
       </div>
    </div>
 
    </>
  )
}

export default TextEditor
