/**
 * Editor components for block-based editing
 * @module components/editor
 */

// R-100: BlockCanvas - Main editing surface for block-based editors
export {
  type Block,
  BlockCanvas,
  type BlockCanvasProps,
  type BlockRenderContext,
} from './BlockCanvas';
// R-102: BlockSidebar - Block palette sidebar with categories and search
export {
  type BlockDefinition,
  type BlockRegistry,
  BlockSidebar,
  type BlockSidebarProps,
} from './BlockSidebar';
// R-101: BlockWrapper - Wrapper for each block with selection, drag, actions
export { BlockWrapper, type BlockWrapperProps } from './BlockWrapper';
// R-105: CommandPaletteUI - Slash command menu
export { CommandPaletteUI, type CommandPaletteUIProps } from './CommandPaletteUI';
// R-104: EditorToolbar - Undo/redo and formatting controls
export { EditorToolbar, type EditorToolbarProps } from './EditorToolbar';
// R-103: PropertyEditor - Schema-driven property editor
export { PropertyEditor, type PropertyEditorProps } from './PropertyEditor';
// R-106: InlineToolbar
