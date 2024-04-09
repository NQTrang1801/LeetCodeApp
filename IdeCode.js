import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import CodeEditor, { CodeEditorSyntaxStyles } from '@rivascva/react-native-code-editor';
import language from 'react-syntax-highlighter/dist/esm/languages/hljs/1c';

const IdeCode = ({ initialValue, onCodeChange }) => {
    const [code, setCode] = useState(initialValue);

    const handleChange = (newCode) => {
        setCode(newCode);
        onCodeChange(newCode);
    };

    return (
        <CodeEditor
            style={[styles.codeContainer, styles.text]}
            language="python3"
            initialValue={initialValue}
            syntaxStyle={CodeEditorSyntaxStyles.atomOneDark}
            showLineNumbers
            showCursor={true}
            onChange={handleChange}
        />
    );
};


const styles = StyleSheet.create({
    codeContainer: {
        padding: 16,
        minWidth: '100%',
    },
    text: {
        fontSize: 16,
    },
});

export default IdeCode;
