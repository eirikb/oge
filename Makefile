SRC_DIR = src
LIB_DIR = lib

BASE_FILES = ${SRC_DIR}/base.oge.js\
			 ${SRC_DIR}/world.oge.js\
			 ${SRC_DIR}/direction.oge.js\
			 ${SRC_DIR}/body.oge.js

JSLINT4JAVA = ${LIB_DIR}/jslint4java-1.4.6.jar

lint:
	java -jar ${JSLINT4JAVA} ${BASE_FILES}

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

.PHONY: all update lint
