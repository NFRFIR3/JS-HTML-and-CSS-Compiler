// start CodeMirror editors 
const htmlEditor = CodeMirror.fromTextArea(document.getElementById('htmlEditor'), {
    mode: 'xml',
    lineNumbers: true,
    theme: 'default',
    extraKeys: {
        "Ctrl-Space": "autocomplete",
        "Tab": function(cm) {
            if (cm.getMode().name === 'xml') {
                CodeMirror.commands.closeTag(cm);
            } else {
                cm.execCommand("indentMore");
            }
        }
    },
    hintOptions: {
        completeSingle: false
    },
    autoCloseBrackets: true,
    autoCloseTags: true // tbh idk if its 100% but should auto close tags
});

const cssEditor = CodeMirror.fromTextArea(document.getElementById('cssEditor'), {
    mode: 'css',
    lineNumbers: true,
    theme: 'default',
    extraKeys: {
        "Ctrl-Space": "autocomplete",
        "Tab": "autocomplete"
    },
    hintOptions: {
        completeSingle: false
    },
    autoCloseBrackets: true
});

const jsEditor = CodeMirror.fromTextArea(document.getElementById('jsEditor'), {
    mode: 'javascript',
    lineNumbers: true,
    theme: 'default',
    extraKeys: {
        "Ctrl-Space": "autocomplete",
        "Tab": "autocomplete"
    },
    hintOptions: {
        completeSingle: false
    },
    autoCloseBrackets: true
});

htmlEditor.on("inputRead", function(editor) {
    if (!editor.state.completionActive && editor.getMode().name === 'xml') {
        editor.showHint({hint: CodeMirror.hint.html});
    }
});

cssEditor.on("inputRead", function(editor) {
    if (!editor.state.completionActive && editor.getMode().name === 'css') {
        editor.showHint({hint: CodeMirror.hint.css});
    }
});

jsEditor.on("inputRead", function(editor) {
    if (!editor.state.completionActive && editor.getMode().name === 'javascript') {
        editor.showHint({hint: CodeMirror.hint.javascript});
    }
});

// update live view
function updateOutput() {
    const htmlContent = htmlEditor.getValue();
    const cssContent = `<style>
        ${cssEditor.getValue()}
        ${document.body.classList.contains('dark-mode') ? 'body { color: white; background-color: #333; }' : ''}
    </style>`;
    const jsContent = `<script>${jsEditor.getValue()}<\/script>`;

    const output = document.getElementById('output');
    output.srcdoc = htmlContent + cssContent + jsContent;
}

// listeners for live view
htmlEditor.on('change', updateOutput);
cssEditor.on('change', updateOutput);
jsEditor.on('change', updateOutput);

// Render
updateOutput();

// Theme toggle 
const themeToggle = document.getElementById('themeToggle');
let currentTheme = 'default';

themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
        currentTheme = 'darcula'; // Dark mode
        document.body.classList.add('dark-mode');
    } else {
        currentTheme = 'default'; // Light mode
        document.body.classList.remove('dark-mode');
    }
    htmlEditor.setOption('theme', currentTheme);
    cssEditor.setOption('theme', currentTheme);
    jsEditor.setOption('theme', currentTheme);
    
    updateOutput(); // Update iframe color thing
});

// File opener sht
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const content = e.target.result;
        const extension = file.name.split('.').pop();

        if (extension === 'html') {
            htmlEditor.setValue(content);
        } else if (extension === 'css') {
            cssEditor.setValue(content);
        } else if (extension === 'js') {
            jsEditor.setValue(content);
        } else {
            alert('The selected file type is not accepted. Please choose an HTML, CSS, or JS file.');
        }
    };

    reader.readAsText(file);
});
