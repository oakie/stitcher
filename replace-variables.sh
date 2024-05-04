#!/bin/bash

# Define a list of environment variables to replace
VARIABLES=()
while IFS= read -r line; do
    VARIABLES+=("${line%%=*}")
done < ".env"

# Load environment-specific variables
source ".env.$1"

# Find and replace PLACEHOLDER_ values with real values
find ./out -type f -name "*.js" |
while read file; do
    for VAR in "${VARIABLES[@]}"; do
        sed -i "s|PLACEHOLDER_$VAR|${!VAR}|g" "$file"
    done
done

echo "Done"
