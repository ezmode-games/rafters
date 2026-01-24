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
// R-105: CommandPaletteUI - Slash command menu
export { CommandPaletteUI, type CommandPaletteUIProps } from './CommandPaletteUI';
// R-104: EditorToolbar - Undo/redo and formatting controls
export { EditorToolbar, type EditorToolbarProps } from './EditorToolbar';
// R-103: PropertyEditor - Schema-driven property editor
export { PropertyEditor, type PropertyEditorProps } from './PropertyEditor';
// R-101: BlockWrapper
// R-102: BlockSidebar
// R-106: InlineToolbar
