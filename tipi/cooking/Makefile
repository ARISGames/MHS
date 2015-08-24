coffee_files := $(wildcard *.coffee)
js_files     := $(coffee_files:%.coffee=%.js)

default: all.js

all.js: $(js_files)
	cat $< > $@

%.js: %.coffee
	coffee -sc < $< > $@
