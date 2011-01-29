SRC_DIR = src
LIB_DIR = lib
DIST_DIR = dist

BASE_FILES = ${SRC_DIR}/base.oge.js\
			 ${SRC_DIR}/direction.oge.js\
			 ${SRC_DIR}/zone.oge.js\
			 ${SRC_DIR}/body.oge.js\
			 ${SRC_DIR}/world.oge.js
JSLINT4JAVA = ${LIB_DIR}/jslint4java-1.4.6.jar
CLOSURE_COMPILER = ${LIB_DIR}/compiler.jar
BUNDLE_VERSION = ${DIST_DIR}/oge.js
MIN_VERSION = ${DIST_DIR}/oge.min.js

all: update lint build

update:
	git submodule update --init

lint:
	java -jar ${JSLINT4JAVA} ${BASE_FILES}

lint-dist:
	java -jar ${JSLINT4JAVA} ${MIN_VERSION}

build:
	cat ${BASE_FILES} > ${BUNDLE_VERSION}
	java -jar ${CLOSURE_COMPILER} --js ${BUNDLE_VERSION} --js_output_file ${MIN_VERSION}

.PHONY: all update lint
