import { arrayToTree as performantArrayToTree, Item } from "performant-array-to-tree"

export function arrayToTree(items: Array<Item>) {
    return performantArrayToTree(items, { dataField: null })
}
