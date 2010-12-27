SRC_DIR = src
TEST_DIR = spec
LIB_DIR = lib
JASMINE_DIR = ${LIB_DIR}/jasmine

V8 = d8

BASE_FILES = ${SRC_DIR}/base.js\
			 ${SRC_DIR}/world.oge.js\
			 ${SRC_DIR}/direction.oge.js\
			 ${SRC_DIR}/body.oge.js
TEST_FILES = ${TEST_DIR}/*.js
SPECRUNNER_FILE = SpecRunner.js
ENV_FILE = ${LIB_DIR}/env.js
JASMINE_FILES = ${JASMINE_DIR}/lib/jasmine.js\
				${LIB_DIR}/jasmine-print.js

test:
	${V8} ${ENV_FILE} ${JASMINE_FILES} ${BASE_FILES} ${TEST_FILES} ${SPECRUNNER_FILE}

update:
	$(call clone_or_pull, ${JASMINE_DIR}, https://github.com/pivotal/jasmine.git)


define clone_or_pull
-@@if test ! -d $(strip ${1})/.git; then \
	echo "Cloning $(strip ${1})..."; \
	git clone $(strip ${verbose}) --depth=1 $(strip ${2}) $(strip ${1}); \
	else \
	echo "Pulling $(strip ${1})..."; \
	git --git-dir=$(strip ${1})/.git pull $(strip ${verbose}) origin master; \
	fi

endef

.PHONY: all update test
