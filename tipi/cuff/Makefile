coffee_files := $(wildcard *.coffee)
js_files     := $(coffee_files:%.coffee=%.js)

default: $(js_files)

%.js: %.coffee
	coffee -sc < $< > $@
