import React from 'react';
import Editor from '@monaco-editor/react';
const PreviewCodes = ({ codeObjects }) => {
  return (
    <>
      {codeObjects.map((codeObject, index) => {
        // Calculate pixel-based height and width from percentage values
        const height = `${window.innerHeight * (codeObject.height / 100)}px`;
        const width = `${window.innerWidth * (codeObject.width / 100)}px`;

        const options = {
          fontSize: `${codeObject.fontSize * 16}px`,
          minimap: {
            enabled: false
          },
          readOnly: false
        };

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              overflow: 'hidden',
              zIndex: `${codeObject.zIndex}`,
              left: `${codeObject.x}%`,
              top: `${codeObject.y}%`
            }}
          >
            <Editor
              key={index}
              options={options}
              height={height}
              width={width}
              defaultLanguage={codeObject.language}
              defaultValue={codeObject.code}
              language={codeObject.language} // Default language
            />
          </div>
        );
      })}
    </>
  );
};

export default PreviewCodes;
