V ?= 0

SRC_DIR = src
TEST_DIR = test
VENDOR_DIR = vendor
BUILD_DIR = build

PREFIX = .

V8 ?= ./v8-shell

BASE_FILES = ${SRC_DIR}/body.sge.js\
			${SRC_DIR}/collision.sge.js\
	
TEST_FILES = ${TEST_DIR}/collision-detection.test.js\
	
JSUNITY = ${VENDOR_DIR}/jsunity-0.6.js

SGE_VER = $(shell cat version.txt)
VER = sed "s/@VERSION/${SGE_VER}/"

DATE=$(shell git log -1 --pretty=format:%ad)

test:
	${V8} ${JSUNITY} ${BASE_FILES} test/setup.test.js ${TEST_FILES}

.PHONY: all test