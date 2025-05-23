declare module 'react-force-graph-3d' {
  import { ComponentType, RefObject } from 'react';

  export interface ForceGraphProps {
    graphData: {
      nodes: Array<{
        id: string;
        name?: string;
        val?: number;
        color?: string;
        x?: number;
        y?: number;
        z?: number;
        [key: string]: any;
      }>;
      links: Array<{
        source: string | object;
        target: string | object;
        value?: number;
        color?: string;
        [key: string]: any;
      }>;
    };
    width?: number;
    height?: number;
    backgroundColor?: string;
    showNavInfo?: boolean;
    nodeLabel?: ((node: any) => string) | string;
    nodeColor?: ((node: any) => string) | string;
    nodeRelSize?: number;
    nodeVal?: ((node: any) => number) | number;
    nodeOpacity?: number;
    nodeResolution?: number;
    nodeThreeObject?: (node: any) => any;
    nodeThreeObjectExtend?: boolean;
    linkSource?: string;
    linkTarget?: string;
    linkColor?: ((link: any) => string) | string;
    linkWidth?: ((link: any) => number) | number;
    linkOpacity?: number;
    linkResolution?: number;
    linkCurvature?: ((link: any) => number) | number;
    linkDirectionalArrowLength?: ((link: any) => number) | number;
    linkDirectionalArrowColor?: ((link: any) => string) | string;
    linkDirectionalArrowRelPos?: ((link: any) => number) | number;
    linkDirectionalParticles?: ((link: any) => number) | number;
    linkDirectionalParticleSpeed?: ((link: any) => number) | number;
    linkDirectionalParticleWidth?: ((link: any) => number) | number;
    linkDirectionalParticleColor?: ((link: any) => string) | string;
    onNodeClick?: (node: any, event: MouseEvent) => void;
    onNodeHover?: (node: any, prevNode: any) => void;
    onLinkClick?: (link: any, event: MouseEvent) => void;
    onLinkHover?: (link: any, prevLink: any) => void;
    onBackgroundClick?: (event: MouseEvent) => void;
    cooldownTicks?: number;
    cooldownTime?: number;
    d3AlphaDecay?: number;
    d3VelocityDecay?: number;
    warmupTicks?: number;
    enableNodeDrag?: boolean;
    enableNavigationControls?: boolean;
    ref?: RefObject<any>;
    [key: string]: any;
  }

  const ForceGraph3D: ComponentType<ForceGraphProps>;
  export default ForceGraph3D;
}

declare module 'three-spritetext' {
  class SpriteText {
    constructor(text?: string, textHeight?: number, color?: string);
    text: string;
    textHeight: number;
    color: string;
    backgroundColor: string;
    padding: number;
    borderRadius: number;
    borderWidth: number;
    borderColor: string;
    fontWeight: string;
    fontFace: string;
    fontStyle: string;
    strokeWidth: number;
    strokeColor: string;
  }
  export default SpriteText;
} 