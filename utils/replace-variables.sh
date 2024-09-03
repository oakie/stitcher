#!/bin/bash

# Define a list of environment variables to replace
VARIABLES=()
while IFS= read -r line; do
    VARIABLES+=("${line%%=*}")
done < ".env"

for VAR in "${VARIABLES[@]}"; do
    echo "$VAR = ${!VAR}"
done

# Find and replace placeholder values with real values
find ./out -type f -name "*.js" |
while read file; do
    for VAR in "${VARIABLES[@]}"; do
        sed -i "s|$VAR|${!VAR}|g" "$file"
    done
done

echo "Done"
