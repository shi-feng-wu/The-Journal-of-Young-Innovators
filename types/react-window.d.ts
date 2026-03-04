declare module "react-window" {
  import * as React from "react";

  export type ListChildComponentProps = {
    index: number;
    style: React.CSSProperties;
    data: unknown;
    isScrolling?: boolean;
  };

  export type ListOnItemsRenderedProps = {
    overscanStartIndex: number;
    overscanStopIndex: number;
    visibleStartIndex: number;
    visibleStopIndex: number;
  };

  export class VariableSizeList extends React.Component<{
    height: number;
    width: number;
    itemCount: number;
    itemSize: (index: number) => number;
    estimatedItemSize?: number;
    overscanCount?: number;
    onItemsRendered?: (props: ListOnItemsRenderedProps) => void;
    children: React.ComponentType<ListChildComponentProps>;
  }> {
    scrollToItem(
      index: number,
      align?: "auto" | "smart" | "center" | "end" | "start",
    ): void;
    resetAfterIndex(index: number, shouldForceUpdate?: boolean): void;
  }
}
