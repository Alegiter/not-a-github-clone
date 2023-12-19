import { ChevronRight, ExpandMore, Folder, FolderOpen } from "@mui/icons-material"
import { CircularProgress, Typography } from "@mui/material"
import { TreeItem, TreeItemContentProps, TreeItemProps, TreeView, useTreeItem } from "@mui/x-tree-view"
import clsx from "clsx"
import { observer } from "mobx-react-lite"
import { FC, ReactNode, Ref, forwardRef, useState } from "react"
import { RepositoryFilesTreeNode, loadSubRepositoryFilesTree, repositoryFilesTreeStore } from "../model"

export const RepositoryFilesTree: FC = observer(function RepositoryFilesTree() {
    const nodes = repositoryFilesTreeStore.nodes
    const [expanded, setExpanded] = useState<Array<string>>([])

    return (
        <TreeView
            defaultExpandIcon={<ChevronRight />}
            defaultCollapseIcon={<ExpandMore />}
            expanded={expanded}
            onNodeToggle={(_, ids) => setExpanded(ids)}
        >
            {renderTree(nodes)}
        </TreeView>
    )
})

function renderTree(node: RepositoryFilesTreeNode): ReactNode {
    if ("root" in node) {
        return node.children.map((node) => renderTree(node))
    }

    const { id, label, children, ...contentProps } = node

    let child = null
    if (!contentProps.isLeaf && children.length === 0) {
        child = <TreeItem
            nodeId={`${id}-loading`}
            icon={<CircularProgress size={".9rem"} />}
            label="Loading..."
        />
    }
    if (!contentProps.isLeaf && children.length > 0) {
        child = children.map((node) => renderTree(node))
    }

    return (
        <RepositoryTreeItem
            key={id}
            nodeId={id}
            label={label}
            ContentProps={{
                ...contentProps,
                isChildrenLoaded: children.length > 0
            }}
        >
            {child}
        </RepositoryTreeItem>
    )
}

type AdditionalContentProps = {
    isLeaf: boolean
    path: string
    isChildrenLoaded: boolean
}

type RepositoryTreeItemContentProps = TreeItemContentProps & Partial<AdditionalContentProps>

const RepositoryTreeItemContent = forwardRef(function RepositoryTreeItemContent(
    props: RepositoryTreeItemContentProps,
    ref
) {
    const {
        nodeId,
        classes,
        className,
        label,
        expansionIcon,
        isLeaf,
        path,
        isChildrenLoaded
    } = props

    const {
        expanded,
        selected,
        focused,
        disabled,
        handleExpansion
    } = useTreeItem(nodeId)

    const handleExpansionClick: typeof handleExpansion = (event) => {
        if (isChildrenLoaded) {
            return handleExpansion(event)
        }
        if (!path) {
            return
        }
        handleExpansion(event)
        loadSubRepositoryFilesTree(nodeId, path)
    }

    return (
        <div
            className={clsx(className, classes.root, {
                [classes.expanded]: expanded,
                [classes.selected]: selected,
                [classes.focused]: focused,
                [classes.disabled]: disabled,
            })}
            onMouseDown={handleExpansionClick}
            ref={ref as React.Ref<HTMLDivElement>}
        >
            <div className={classes.iconContainer}>
                {expansionIcon}
                {!isLeaf && !expanded && (
                    <Folder/>
                )}
                {!isLeaf && expanded && (
                    <FolderOpen/>
                )}
            </div>
            <Typography
                component="div"
                className={classes.label}
            >
                {label}
            </Typography>
        </div>
    )
})

type RepositoryTreeItemProps = TreeItemProps & {
    ContentProps: AdditionalContentProps
}

const RepositoryTreeItem = forwardRef(function RepositoryTreeItem(
    props: RepositoryTreeItemProps,
    ref: Ref<HTMLLIElement>
) {
    return (
        <TreeItem ContentComponent={RepositoryTreeItemContent} {...props} ref={ref} />
    )
})