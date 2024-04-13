
import React, { useEffect, useState } from 'react';
import { Editor } from "@monaco-editor/react";

const CodeEditor = () => {
  const [code, setCode] = useState('// Write your code here');

  // Handler function to update the code state
  const handleEditorChange = (newValue, event) => {
    setCode(newValue);
  };
  useEffect(() => {
   console.log(code);
  }, [code])
  
  return (
    
    // <MonacoEditor
    //   width="800"
    //   height="600"
    //   language="javascript"
    //   theme="vs-dark"
    //   value={code}
    //   onChange={handleEditorChange}
    // />
    <Editor
            options={{
              minimap: {
                enabled: false,
              },
            }}
            height="75vh"
            theme="vs-dark"
            language="javascript"
            defaultValue="//some code"
            // onMount={onMount}
            value={code}
            path='demo.txt'
            onChange={(value) => setCode(value)}
          />
  );
};



export default CodeEditor