#!/bin/bash
set -e

# Check if a number is provided
if [ -z "$1" ]; then
  echo "Please provide a number as an argument."
  echo "1 - Expo Prebuild"
  echo "2 - Run Android"
  exit 1
fi

case $1 in
  1)
    echo "Running Expo Prebuild..."
    npx expo prebuild
    ;;
  2)
    echo "Running Expo on Android..."
    npx expo run:android
    ;;
  *)
    echo "Invalid option: $1"
    echo "Valid options: 1, 2, 3, 4"
    exit 1
    ;;
esac

echo "Done!"
