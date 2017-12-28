.PHONY: default setup lint test tsc

# Put Node bins in path
export PATH := node_modules/.bin:$(PATH)
export SHELL := /bin/bash

default: lint

setup:
	yarn install

lint:
	eslint 'src/**/*.js*'

test:
	node_modules/.bin/tape -r babel-register -r ./src/setup-dom.js \
		'src/**/*.test.*' | tap-spec

tsc:
	tsc