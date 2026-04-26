#!/bin/bash
set -e

git stash
git fetch origin main
git rebase origin/main
git stash pop
