#!/bin/bash
# Converts Lit decorators to static properties

for file in packages/ui/src/primitives/*/r-*.ts; do
  if [ -f "$file" ] && ! [[ "$file" == *".test.ts" ]]; then
    echo "Processing $file..."

    # Remove property import if it exists
    sed -i.bak 's/import { customElement, property } from/import { customElement } from/' "$file"
    sed -i.bak 's/import { customElement, property, state } from/import { customElement } from/' "$file"

    rm -f "${file}.bak"
  fi
done

echo "Done! Now manually add static properties declarations."
