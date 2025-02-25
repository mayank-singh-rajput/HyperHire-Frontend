import { TreeViewBaseItem } from "@mui/x-tree-view/models";

export type TreeItems = {
    id: string;
    name: string;
    label?: string;
    parentId?: string;
    children?: TreeItems[];
};

export default function FormateTreeData(data: TreeItems[]) {
    const map = new Map<string, TreeItems>();
    const result: TreeItems[] = [];

    for(const item of data) {
        const treeItem: TreeViewBaseItem<TreeItems> = {
            id: item.id,
            name: item.name,
            label: item.name,
            parentId: item.parentId,
            children: [],
        };
        map.set(item.id, treeItem);
    };

    for(const item of data) {
        const treeItem = map.get(item.id);

        if (item.parentId) {
            const parentItem = map.get(item.parentId);
            if (parentItem) {
                parentItem.children?.push(treeItem!);
            }
        } else {
            result.push(treeItem!);
        }
    };

    return result;
}