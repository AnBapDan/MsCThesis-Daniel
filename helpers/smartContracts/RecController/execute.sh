#!/bin/bash

# Define a list of items (numbers in this case)

# Start a for loop to iterate through the list
for ((i=0; i<=214; i++))
do
  # echo '__________________________________________'
  echo 'iteraction ' $i
  ts-node execute.ts buyer $i
  # sleep 3
  # echo '__________________________________________'
  # echo 'rec...'
  ts-node rec.ts
done

echo "All items processed"
