SRC_DIR = src
TEST_DIR = spec
LIB_DIR = lib
JASMINE_DIR = ${LIB_DIR}/jasmine-1.0.1

V8 = d8

BASE_FILES = ${SRC_DIR}/world.oge.js
TEST_FILES = ${TEST_DIR}/WorldSpec.js
SPEC_FILE = spec.js
ENV_FILE = env.js
JASMINE_FILES = ${JASMINE_DIR}/jasmine.js\
				${JASMINE_DIR}/jasmine-console.js

test:
	${V8} ${ENV_FILE} ${JASMINE_FILES} ${BASE_FILES} ${TEST_FILES} ${SPEC_FILE} 

.PHONY: all test
