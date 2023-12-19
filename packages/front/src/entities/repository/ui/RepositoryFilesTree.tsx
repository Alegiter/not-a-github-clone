import { ChevronRight, ExpandMore } from "@mui/icons-material"
import { TreeItem, TreeView } from "@mui/x-tree-view"
import { FC, ReactNode, memo } from "react"
import { RepositoryFilesTreeNode, repositoryFilesTreeStore } from "../model"

export const RepositoryFilesTree: FC = memo(function RepositoryFilesTree() {
    const nodes = repositoryFilesTreeStore.nodes

    return (
        <TreeView
            defaultExpandIcon={<ChevronRight />}
            defaultCollapseIcon={<ExpandMore />}
        >
            {renderTree(nodes)}
        </TreeView>
    )
})

function renderTree(node: RepositoryFilesTreeNode): ReactNode {
    if ("root" in node) {
        return (<>
            {node.children.map((node) => renderTree(node))}
        </>)
    }

    return (
        <TreeItem key={node.id} nodeId={node.id} label={node.label}>
            {Array.isArray(node.children)
                ? node.children.map((node) => renderTree(node))
                : null}
        </TreeItem>
    )
}