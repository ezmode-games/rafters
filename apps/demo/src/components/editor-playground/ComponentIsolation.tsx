/**
 * Component Isolation - Individual component testing views
 */

import {
  type Block,
  BlockCanvas,
  type BlockRenderContext,
  BlockSidebar,
  BlockWrapper,
  CommandPaletteUI,
  EditorToolbar,
  InlineToolbar,
  PropertyEditor,
} from '@rafters/ui/components/editor';
import { Button } from '@rafters/ui/components/ui/button';
import { Checkbox } from '@rafters/ui/components/ui/checkbox';
import { Input } from '@rafters/ui/components/ui/input';
import { Label } from '@rafters/ui/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rafters/ui/components/ui/select';
import { Tooltip } from '@rafters/ui/components/ui/tooltip';
import { useHistory } from '@rafters/ui/hooks/use-history';
import type { Command, InlineMark } from '@rafters/ui/primitives/types';
import type * as React from 'react';
import { useCallback, useState } from 'react';
import {
  type BlockType,
  blockRegistry,
  blockSchemas,
  createSampleBlocks,
  generateBlockId,
} from './blocks';

// ============================================================================
// Component List
// ============================================================================

const COMPONENTS = [
  { id: 'BlockCanvas', label: 'BlockCanvas' },
  { id: 'BlockSidebar', label: 'BlockSidebar' },
  { id: 'BlockWrapper', label: 'BlockWrapper' },
  { id: 'PropertyEditor', label: 'PropertyEditor' },
  { id: 'EditorToolbar', label: 'EditorToolbar' },
  { id: 'CommandPaletteUI', label: 'CommandPaletteUI' },
  { id: 'InlineToolbar', label: 'InlineToolbar' },
] as const;

type ComponentId = (typeof COMPONENTS)[number]['id'];

// ============================================================================
// Event Log Component
// ============================================================================

interface EventLogProps {
  events: string[];
  onClear: () => void;
}

function EventLog({ events, onClear }: EventLogProps): React.JSX.Element {
  return (
    <div className="border rounded-md bg-muted/30">
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Event Log
        </span>
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear
        </Button>
      </div>
      <div className="h-48 overflow-y-auto p-2 font-mono text-xs space-y-1">
        {events.length === 0 ? (
          <div className="text-muted-foreground italic">Interact with the component...</div>
        ) : (
          events.map((event, index) => (
            <div key={`event-${index}-${event}`} className="text-muted-foreground">
              {event}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ============================================================================
// BlockCanvas Isolation
// ============================================================================

function BlockCanvasIsolation(): React.JSX.Element {
  const [blocks, setBlocks] = useState<Block[]>(createSampleBlocks().slice(0, 3));
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [focusedId, setFocusedId] = useState<string | undefined>();
  const [events, setEvents] = useState<string[]>([]);

  const logEvent = useCallback((event: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEvents((prev) => [`[${timestamp}] ${event}`, ...prev].slice(0, 50));
  }, []);

  const renderBlock = useCallback((block: Block, context: BlockRenderContext) => {
    return (
      <div
        className={`p-4 border rounded-md transition-colors ${
          context.isSelected ? 'bg-primary/10 border-primary' : 'bg-muted/30 border-border'
        } ${context.isFocused ? 'ring-2 ring-ring' : ''}`}
      >
        <div className="text-sm font-medium">{block.type}</div>
        <div className="text-xs text-muted-foreground">ID: {block.id}</div>
      </div>
    );
  }, []);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Label className="text-sm">Blocks: {blocks.length}</Label>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const newBlock: Block = {
                id: generateBlockId(),
                type: 'text',
                props: { content: 'New block' },
              };
              setBlocks((prev) => [...prev, newBlock]);
              logEvent(`Block added: ${newBlock.id}`);
            }}
          >
            Add Block
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-sm">Selected: {selectedIds.size}</Label>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedIds(new Set());
              logEvent('Selection cleared');
            }}
          >
            Clear Selection
          </Button>
        </div>
      </div>

      {/* Component */}
      <div className="border rounded-lg p-4 bg-background min-h-64">
        <BlockCanvas
          blocks={blocks}
          selectedIds={selectedIds}
          focusedId={focusedId}
          onSelectionChange={(ids) => {
            setSelectedIds(ids);
            logEvent(`onSelectionChange: ${ids.size} blocks`);
          }}
          onFocusChange={(id) => {
            setFocusedId(id ?? undefined);
            logEvent(`onFocusChange: ${id ?? 'null'}`);
          }}
          onBlocksChange={(newBlocks) => {
            setBlocks(newBlocks);
            logEvent('onBlocksChange');
          }}
          onBlockAdd={(block, index) => logEvent(`onBlockAdd: ${block.id} at ${index}`)}
          onBlockRemove={(id) => logEvent(`onBlockRemove: ${id}`)}
          onBlockMove={(id, toIndex) => {
            logEvent(`onBlockMove: ${id} to ${toIndex}`);
            const fromIndex = blocks.findIndex((b) => b.id === id);
            if (fromIndex !== -1) {
              const newBlocks = [...blocks];
              const [moved] = newBlocks.splice(fromIndex, 1);
              if (moved) {
                newBlocks.splice(toIndex > fromIndex ? toIndex - 1 : toIndex, 0, moved);
                setBlocks(newBlocks);
              }
            }
          }}
          renderBlock={renderBlock}
        />
      </div>

      {/* Event Log */}
      <EventLog events={events} onClear={() => setEvents([])} />
    </div>
  );
}

// ============================================================================
// BlockSidebar Isolation
// ============================================================================

function BlockSidebarIsolation(): React.JSX.Element {
  const [collapsed, setCollapsed] = useState(false);
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>(['text', 'heading']);
  const [events, setEvents] = useState<string[]>([]);

  const logEvent = useCallback((event: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEvents((prev) => [`[${timestamp}] ${event}`, ...prev].slice(0, 50));
  }, []);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex gap-4 flex-wrap items-center">
        <div className="flex items-center gap-2">
          <Checkbox
            id="sidebar-collapsed"
            checked={collapsed}
            onCheckedChange={(checked) => setCollapsed(checked === true)}
          />
          <Label htmlFor="sidebar-collapsed">Collapsed</Label>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-sm">Recently used: {recentlyUsed.length}</Label>
          <Button size="sm" variant="outline" onClick={() => setRecentlyUsed([])}>
            Clear Recent
          </Button>
        </div>
      </div>

      {/* Component */}
      <div className="border rounded-lg bg-background h-96 overflow-hidden">
        <BlockSidebar
          registry={blockRegistry}
          onInsert={(blockType) => {
            logEvent(`onInsert: ${blockType}`);
            setRecentlyUsed((prev) => {
              const filtered = prev.filter((t) => t !== blockType);
              return [blockType, ...filtered].slice(0, 5);
            });
          }}
          recentlyUsed={recentlyUsed}
          collapsed={collapsed}
          onCollapse={(value) => {
            setCollapsed(value);
            logEvent(`onCollapse: ${value}`);
          }}
        />
      </div>

      {/* Event Log */}
      <EventLog events={events} onClear={() => setEvents([])} />
    </div>
  );
}

// ============================================================================
// BlockWrapper Isolation
// ============================================================================

function BlockWrapperIsolation(): React.JSX.Element {
  const [isSelected, setIsSelected] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFirst, setIsFirst] = useState(true);
  const [isLast, setIsLast] = useState(true);
  const [draggable, setDraggable] = useState(true);
  const [events, setEvents] = useState<string[]>([]);

  const logEvent = useCallback((event: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEvents((prev) => [`[${timestamp}] ${event}`, ...prev].slice(0, 50));
  }, []);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Checkbox
            id="wrapper-selected"
            checked={isSelected}
            onCheckedChange={(checked) => setIsSelected(checked === true)}
          />
          <Label htmlFor="wrapper-selected">Selected</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="wrapper-focused"
            checked={isFocused}
            onCheckedChange={(checked) => setIsFocused(checked === true)}
          />
          <Label htmlFor="wrapper-focused">Focused</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="wrapper-first"
            checked={isFirst}
            onCheckedChange={(checked) => setIsFirst(checked === true)}
          />
          <Label htmlFor="wrapper-first">isFirst</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="wrapper-last"
            checked={isLast}
            onCheckedChange={(checked) => setIsLast(checked === true)}
          />
          <Label htmlFor="wrapper-last">isLast</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="wrapper-draggable"
            checked={draggable}
            onCheckedChange={(checked) => setDraggable(checked === true)}
          />
          <Label htmlFor="wrapper-draggable">Draggable</Label>
        </div>
      </div>

      {/* Component */}
      <div className="border rounded-lg p-8 bg-background flex justify-center">
        <div className="w-96 px-8">
          <BlockWrapper
            id="demo-block"
            isSelected={isSelected}
            isFocused={isFocused}
            isFirst={isFirst}
            isLast={isLast}
            draggable={draggable}
            onSelect={(additive) => {
              logEvent(`onSelect(additive: ${additive})`);
              setIsSelected(!isSelected);
            }}
            onFocus={() => {
              logEvent('onFocus');
              setIsFocused(true);
            }}
            onDelete={() => logEvent('onDelete')}
            onDuplicate={() => logEvent('onDuplicate')}
            onMoveUp={() => logEvent('onMoveUp')}
            onMoveDown={() => logEvent('onMoveDown')}
          >
            <div className="p-4 bg-muted/50 rounded-md">
              <p className="font-medium">Sample Block Content</p>
              <p className="text-sm text-muted-foreground">
                Hover to see chrome, use menu for actions
              </p>
            </div>
          </BlockWrapper>
        </div>
      </div>

      {/* Event Log */}
      <EventLog events={events} onClear={() => setEvents([])} />
    </div>
  );
}

// ============================================================================
// PropertyEditor Isolation
// ============================================================================

function PropertyEditorIsolation(): React.JSX.Element {
  const [selectedSchema, setSelectedSchema] = useState<BlockType>('heading');
  const [values, setValues] = useState<Record<string, unknown>>({
    content: 'Sample Heading',
    level: '2',
  });
  const [events, setEvents] = useState<string[]>([]);

  const logEvent = useCallback((event: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEvents((prev) => [`[${timestamp}] ${event}`, ...prev].slice(0, 50));
  }, []);

  const handleSchemaChange = useCallback((value: string) => {
    const schema = value as BlockType;
    setSelectedSchema(schema);
    // Reset values based on schema
    const defaultValues: Record<BlockType, Record<string, unknown>> = {
      text: { content: 'Sample text' },
      heading: { content: 'Sample Heading', level: '2' },
      image: { url: 'https://placehold.co/400x300', alt: 'Sample image' },
      code: { language: 'typescript', code: 'const x = 42;' },
      divider: { variant: 'solid' },
      quote: { content: 'Sample quote', attribution: 'Author' },
    };
    setValues(defaultValues[schema] ?? {});
  }, []);

  const schema = blockSchemas[selectedSchema];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex gap-4 flex-wrap items-center">
        <div className="flex items-center gap-2">
          <Label>Schema:</Label>
          <Select value={selectedSchema} onValueChange={handleSchemaChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(blockSchemas).map((key) => (
                <SelectItem key={key} value={key}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Component */}
      <div className="border rounded-lg p-6 bg-background max-w-md">
        <PropertyEditor
          schema={schema}
          values={values}
          onChange={(newValues) => {
            setValues(newValues);
            logEvent(`onChange: ${JSON.stringify(newValues)}`);
          }}
          blockType={selectedSchema}
          title="Block Properties"
        />
      </div>

      {/* Current Values */}
      <div className="border rounded-md p-4 bg-muted/30">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          Current Values
        </div>
        <pre className="text-sm font-mono overflow-x-auto">{JSON.stringify(values, null, 2)}</pre>
      </div>

      {/* Event Log */}
      <EventLog events={events} onClear={() => setEvents([])} />
    </div>
  );
}

// ============================================================================
// EditorToolbar Isolation
// ============================================================================

function EditorToolbarIsolation(): React.JSX.Element {
  const history = useHistory<string>({ initialState: 'Initial state' });
  const [showFormattingButtons, setShowFormattingButtons] = useState(true);
  const [events, setEvents] = useState<string[]>([]);

  const logEvent = useCallback((event: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEvents((prev) => [`[${timestamp}] ${event}`, ...prev].slice(0, 50));
  }, []);

  return (
    <Tooltip.Provider delayDuration={300}>
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex gap-4 flex-wrap items-center">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              history.push(`State ${Math.random().toString(36).slice(2, 8)}`);
              logEvent('Pushed new state');
            }}
          >
            Push State
          </Button>
          <div className="flex items-center gap-2">
            <Checkbox
              id="toolbar-formatting"
              checked={showFormattingButtons}
              onCheckedChange={(checked) => setShowFormattingButtons(checked === true)}
            />
            <Label htmlFor="toolbar-formatting">Show Formatting Buttons</Label>
          </div>
          <div className="text-sm text-muted-foreground">
            canUndo: {String(history.state.canUndo)} | canRedo: {String(history.state.canRedo)}
          </div>
        </div>

        {/* Component */}
        <div className="border rounded-lg p-6 bg-background">
          <EditorToolbar
            history={history}
            onBold={showFormattingButtons ? () => logEvent('onBold') : undefined}
            onItalic={showFormattingButtons ? () => logEvent('onItalic') : undefined}
            onUnderline={showFormattingButtons ? () => logEvent('onUnderline') : undefined}
            onStrikethrough={showFormattingButtons ? () => logEvent('onStrikethrough') : undefined}
            onLink={showFormattingButtons ? () => logEvent('onLink') : undefined}
            onCode={showFormattingButtons ? () => logEvent('onCode') : undefined}
          />
        </div>

        {/* Event Log */}
        <EventLog events={events} onClear={() => setEvents([])} />
      </div>
    </Tooltip.Provider>
  );
}

// ============================================================================
// CommandPaletteUI Isolation
// ============================================================================

function CommandPaletteUIIsolation(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [events, setEvents] = useState<string[]>([]);

  const logEvent = useCallback((event: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEvents((prev) => [`[${timestamp}] ${event}`, ...prev].slice(0, 50));
  }, []);

  const commands: Command[] = [
    { id: 'heading', label: 'Heading', description: 'Add a heading block', category: 'Text' },
    { id: 'paragraph', label: 'Paragraph', description: 'Add a text block', category: 'Text' },
    { id: 'image', label: 'Image', description: 'Insert an image', category: 'Media' },
    {
      id: 'code',
      label: 'Code Block',
      description: 'Add code snippet',
      category: 'Code',
      shortcut: 'Cmd+E',
    },
    { id: 'divider', label: 'Divider', description: 'Add horizontal rule', category: 'Layout' },
  ];

  const filteredCommands = searchQuery
    ? commands.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cmd.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : commands;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex gap-4 flex-wrap items-center">
        <div className="flex items-center gap-2">
          <Checkbox
            id="palette-open"
            checked={isOpen}
            onCheckedChange={(checked) => setIsOpen(checked === true)}
          />
          <Label htmlFor="palette-open">Open</Label>
        </div>
        <div className="flex items-center gap-2">
          <Label>Selected Index:</Label>
          <Input
            type="number"
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(Number(e.target.value))}
            className="w-20"
            min={-1}
            max={filteredCommands.length - 1}
          />
        </div>
      </div>

      {/* Component Container */}
      <div className="border rounded-lg p-6 bg-background min-h-96 relative">
        <p className="text-sm text-muted-foreground mb-4">
          The palette is rendered relative to this container for demo purposes.
        </p>
        {isOpen && (
          <div className="relative">
            <CommandPaletteUI
              isOpen={isOpen}
              commands={filteredCommands}
              selectedIndex={selectedIndex}
              searchQuery={searchQuery}
              onSelect={(cmd) => {
                logEvent(`onSelect: ${cmd.id}`);
                setIsOpen(false);
              }}
              onClose={() => {
                logEvent('onClose');
                setIsOpen(false);
              }}
              onQueryChange={(query) => {
                setSearchQuery(query);
                setSelectedIndex(0);
                logEvent(`onQueryChange: "${query}"`);
              }}
              onNavigate={(direction) => {
                logEvent(`onNavigate: ${direction}`);
                setSelectedIndex((prev) => {
                  if (direction === 'up') {
                    return Math.max(0, prev - 1);
                  }
                  return Math.min(filteredCommands.length - 1, prev + 1);
                });
              }}
              position={{ x: 20, y: 80 }}
            />
          </div>
        )}
      </div>

      {/* Event Log */}
      <EventLog events={events} onClear={() => setEvents([])} />
    </div>
  );
}

// ============================================================================
// InlineToolbar Isolation
// ============================================================================

function InlineToolbarIsolation(): React.JSX.Element {
  const [isVisible, setIsVisible] = useState(true);
  const [activeFormats, setActiveFormats] = useState<InlineMark[]>(['bold']);
  const [hasLink, setHasLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState('https://example.com');
  const [posX, setPosX] = useState(100);
  const [posY, setPosY] = useState(100);
  const [events, setEvents] = useState<string[]>([]);

  const logEvent = useCallback((event: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEvents((prev) => [`[${timestamp}] ${event}`, ...prev].slice(0, 50));
  }, []);

  const toggleFormat = useCallback((format: InlineMark) => {
    setActiveFormats((prev) =>
      prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format],
    );
  }, []);

  return (
    <Tooltip.Provider delayDuration={300}>
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex gap-4 flex-wrap items-center">
          <div className="flex items-center gap-2">
            <Checkbox
              id="inline-visible"
              checked={isVisible}
              onCheckedChange={(checked) => setIsVisible(checked === true)}
            />
            <Label htmlFor="inline-visible">Visible</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="inline-haslink"
              checked={hasLink}
              onCheckedChange={(checked) => setHasLink(checked === true)}
            />
            <Label htmlFor="inline-haslink">Has Link</Label>
          </div>
        </div>

        <div className="flex gap-4 flex-wrap items-center">
          <div className="flex items-center gap-2">
            <Label>Position X:</Label>
            <Input
              type="number"
              value={posX}
              onChange={(e) => setPosX(Number(e.target.value))}
              className="w-24"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label>Position Y:</Label>
            <Input
              type="number"
              value={posY}
              onChange={(e) => setPosY(Number(e.target.value))}
              className="w-24"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Label className="w-full text-sm text-muted-foreground">Active Formats:</Label>
          {(['bold', 'italic', 'code', 'strikethrough', 'link'] as InlineMark[]).map((format) => (
            <Button
              key={format}
              size="sm"
              variant={activeFormats.includes(format) ? 'primary' : 'outline'}
              onClick={() => toggleFormat(format)}
            >
              {format}
            </Button>
          ))}
        </div>

        {/* Component Container */}
        <div className="border rounded-lg p-6 bg-background min-h-64 relative">
          <p className="text-sm text-muted-foreground">
            The toolbar is positioned absolutely. Adjust position controls above.
          </p>
          <InlineToolbar
            isVisible={isVisible}
            position={{ x: posX, y: posY }}
            activeFormats={activeFormats}
            onFormat={(format) => {
              logEvent(`onFormat: ${format}`);
              toggleFormat(format);
            }}
            onLink={(url) => {
              logEvent(`onLink: ${url}`);
              setLinkUrl(url);
              setHasLink(true);
              setActiveFormats((prev) => (prev.includes('link') ? prev : [...prev, 'link']));
            }}
            onRemoveLink={() => {
              logEvent('onRemoveLink');
              setHasLink(false);
              setActiveFormats((prev) => prev.filter((f) => f !== 'link'));
            }}
            hasLink={hasLink}
            linkUrl={linkUrl}
          />
        </div>

        {/* Event Log */}
        <EventLog events={events} onClear={() => setEvents([])} />
      </div>
    </Tooltip.Provider>
  );
}

// ============================================================================
// Main Component Isolation View
// ============================================================================

export function ComponentIsolation(): React.JSX.Element {
  const [selectedComponent, setSelectedComponent] = useState<ComponentId>('BlockCanvas');

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'BlockCanvas':
        return <BlockCanvasIsolation />;
      case 'BlockSidebar':
        return <BlockSidebarIsolation />;
      case 'BlockWrapper':
        return <BlockWrapperIsolation />;
      case 'PropertyEditor':
        return <PropertyEditorIsolation />;
      case 'EditorToolbar':
        return <EditorToolbarIsolation />;
      case 'CommandPaletteUI':
        return <CommandPaletteUIIsolation />;
      case 'InlineToolbar':
        return <InlineToolbarIsolation />;
      default:
        return <div>Select a component</div>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Component Selector */}
      <div className="flex-shrink-0 p-4 border-b bg-muted/30">
        <div className="flex items-center gap-4">
          <Label className="text-sm font-medium">Component:</Label>
          <Select
            value={selectedComponent}
            onValueChange={(v) => setSelectedComponent(v as ComponentId)}
          >
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COMPONENTS.map((component) => (
                <SelectItem key={component.id} value={component.id}>
                  {component.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Component View */}
      <div className="flex-1 overflow-y-auto p-6">{renderComponent()}</div>
    </div>
  );
}

export default ComponentIsolation;
