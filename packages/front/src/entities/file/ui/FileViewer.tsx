import { observer } from "mobx-react-lite"
import { fileViewerStore, loadExplicitViewerFile } from "../model"
import { Button } from "@mui/material"
import SyntaxHighlighter from "react-syntax-highlighter"

export const FileViewer = observer(function FileViewer() {
    const isSupported = fileViewerStore.isSupported
    const isTooBig = fileViewerStore.isTooBig
    const text = fileViewerStore.text

    if (!isSupported) {
        return "File extension is not supported"
    }

    if (isTooBig) {
        return (
            <div>
                File is too big
                <Button onClick={loadExplicitViewerFile}>
                    Load file explicitly
                </Button>
            </div>
        )
    }

    return (
        <SyntaxHighlighter
            showLineNumbers
            wrapLines
            wrapLongLines
            customStyle={{ margin: 0 }}
        >
            {text}
        </SyntaxHighlighter>
    )
})