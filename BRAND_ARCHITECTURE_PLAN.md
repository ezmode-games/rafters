# Brand Architecture Plan
## Clean Separation: Rafters (Components) vs Rafters Intelligence (Platform)

---

## Brand Strategy

### **Rafters** (Component Library)
- **Mission**: Beautiful, accessible, intelligent React components
- **Audience**: Frontend developers, design teams
- **Positioning**: "Components built with design master intelligence"
- **Package**: `@rafters/ui` or `rafters-ui`

### **Rafters Intelligence** (Design Platform)
- **Mission**: AI design intelligence that thinks like design masters
- **Audience**: Design tools, AI platforms, enterprise design teams
- **Positioning**: "The human context API for AI design decisions"
- **Package**: `@rafters-intelligence/mcp` or `rafters-intelligence-api`

---

## Folder Structure After Rename

### **Current State**
```
/home/sean/projects/realhandy/rafters/
├── src/components/          # Rafters component library
├── mcp-server/             # Rafters Intelligence platform
└── DESIGN_MASTER_MCP_ARCHITECTURE.md
```

### **After Brand Separation**
```
/home/sean/projects/realhandy/rafters-intelligence/
├── rafters/                # Component library (git submodule or separate repo)
│   ├── src/components/
│   ├── stories/
│   └── package.json        # "rafters" library
├── mcp-server/             # Intelligence platform
├── commercial-api/         # Future Cloudflare Workers API
├── design-data/           # Intelligence database
└── DESIGN_MASTER_MCP_ARCHITECTURE.md
```

---

## Migration Strategy (Zero Learning Loss)

### **Option 1: Simple Rename (Safest)**
```bash
cd /home/sean/projects/realhandy/
mv rafters rafters-intelligence
```
- ✅ Zero context loss
- ✅ All files preserved
- ✅ All our conversation remains valid
- 🔄 Update package.json names
- 🔄 Update import paths

### **Option 2: Brand Separation (Future)**
1. Keep current folder as `rafters-intelligence`
2. Extract `src/components/` to separate `rafters` library
3. Set up clean component library with own NPM package
4. Intelligence platform references component library

---

## Package.json Updates Needed

### **Component Library** (`rafters`)
```json
{
  "name": "rafters",
  "description": "React components built with design master intelligence",
  "keywords": ["react", "components", "design-system", "accessibility"],
  "repository": "rafters/ui"
}
```

### **Intelligence Platform** (`rafters-intelligence`)
```json
{
  "name": "rafters-intelligence", 
  "description": "AI design intelligence platform - the human context API",
  "keywords": ["ai", "design", "mcp", "intelligence", "accessibility"],
  "repository": "rafters/intelligence"
}
```

---

## Commercial Implications

### **Rafters Component Library**
- MIT License (open source)
- Free to use
- "Powered by Rafters Intelligence"
- Community-driven development

### **Rafters Intelligence Platform**
- **Free Tier**: Local MCP server
- **Pro Tier**: Cloud API access
- **Enterprise**: Custom intelligence training
- **Platform**: White-label integrations

---

## Technical Migration

### **What Needs Updating**
1. `package.json` names and descriptions
2. Import paths in TypeScript files
3. Documentation references
4. Git repository settings
5. CI/CD pipeline configurations

### **What Stays The Same**
- All component code
- All design intelligence
- All architecture decisions
- All our conversation context
- All file contents and logic

---

## Recommended Action

**Start with Option 1 (Simple Rename)**:
1. Rename folder to `rafters-intelligence`
2. Update package names
3. Continue development
4. Plan brand separation for future

**Benefits**:
- ✅ Immediate brand clarity
- ✅ Zero learning/context loss
- ✅ Clean separation of concerns
- ✅ Sets up future commercial strategy

**The AI will seamlessly adapt to the new folder name with zero impact on our design intelligence work.**
