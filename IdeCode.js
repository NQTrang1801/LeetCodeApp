import React from 'react';
import { StyleSheet } from 'react-native';
import CodeEditor, { CodeEditorSyntaxStyles } from '@rivascva/react-native-code-editor';
import language from 'react-syntax-highlighter/dist/esm/languages/hljs/1c';

const IdeCode = (value) => {
    // console.log("code: " + value.defaultCode);
    // var codeSectionIndex = value.defaultCode.indexOf("# Code");
    // var codeSection = value.defaultCode.substring(codeSectionIndex);

    // // Tách từng solution trong # Code
    // var solutions = codeSection.split("# Solution").join('').split("```\\n```");
    // // Loại bỏ phần tử đầu tiên vì nó chỉ là phần # Code
    // solutions.shift();
    // // Hiển thị các solution tách ra
    // // Biểu thức chính quy để trích xuất đoạn mã Python
    // const pythonRegex = /```python\s*\[\]\s*([\s\S]*?)```/g;
    // let match;
    // while ((match = pythonRegex.exec(value.defaultCode)) !== null) {
    //     console.log("Py: " + match[1]); // In ra đoạn mã Python3 đã trích xuất
    //     return (
    //         <CodeEditor
    //             style={[styles.codeContainer, styles.text]}
    //             language="cpp"
    //             syntaxStyle={CodeEditorSyntaxStyles.atomOneDark}
    //             showLineNumbers
    //             initialValue={match[1]}
    //             readOnly
    //         />
    //     );
    // }

    // console.log("_____________________________________________")
    // console.log(solutions);
    return (
        <CodeEditor
            style={[styles.codeContainer, styles.text]}
            language="python"
            syntaxStyle={CodeEditorSyntaxStyles.atomOneDark}
            showLineNumbers
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
