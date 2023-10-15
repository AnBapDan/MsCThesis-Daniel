#!/bin/bash

# Define a list of items (numbers in this case)

# Start a for loop to iterate through the list
for ((i=0; i<=777; i++))
do
  ts-node execute.ts buyer $i
  echo 'seller now'
  ts-node execute.ts seller
done

echo "All items processed"
