SRC_DIR = src
LIB_DIR = lib
DIST_DIR = dist
JASMINE_DIR = ${LIB_DIR}/jasmine

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

lint:
	java -jar ${JSLINT4JAVA} ${BASE_FILES}

lint-dist:
	java -jar ${JSLINT4JAVA} ${MIN_VERSION}

update:
	$(call clone_or_pull, ${JASMINE_DIR}, https://github.com/pivotal/jasmine.git)

build:
	cat ${BASE_FILES} > ${BUNDLE_VERSION}}
	java -jar ${CLOSURE_COMPILER} --js ${BUNDLE_VERSION}} --js_output_file ${MIN_VERSION}

define clone_or_pull
-@@if test ! -d $(strip ${1})/.git; then \
	echo "Cloning $(strip ${1})..."; \
	git clone $(strip ${verbose}) --depth=1 $(strip ${2}) $(strip ${1}); \
	else \
	echo "Pulling $(strip ${1})..."; \
	git --git-dir=$(strip ${1})/.git pull $(strip ${verbose}) origin master; \
	fi

endef

.PHONY: all update lint
