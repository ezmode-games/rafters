/**
 * Typography composite blocks
 *
 * Heading, Paragraph, Blockquote, and List composites for the block editor.
 * Auto-registers all typography composites with the registry on import.
 */

import { register } from '../registry.js';
import { blockquoteComposite } from './blockquote.js';
import { headingComposite } from './heading.js';
import { listComposite } from './list.js';
import { paragraphComposite } from './paragraph.js';

export { blockquoteComposite, headingComposite, listComposite, paragraphComposite };

register(headingComposite);
register(paragraphComposite);
register(blockquoteComposite);
register(listComposite);
