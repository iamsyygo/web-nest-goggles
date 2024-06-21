interface Item {
  id: number;
  parentId: number;
  children?: Item[];
  [key: string]: any;
}

/** */
export function createHierarchy<T extends Item>(data: T[], callback?: (item: T, parent: T) => void) {
  const maps = new Map<number, T>();
  const tree: T[] = [];

  for (const item of data) {
    maps.set(item.id, item);
    const parent = item.parentId && maps.get(item.parentId);
    callback?.(item, parent);
    if (parent) {
      parent.children ??= [];
      parent.children.push(item);
    } else {
      tree.push(item);
    }
  }
  return tree;
}
