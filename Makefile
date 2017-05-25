.PHONY: help prod status deploy all

OK_COLOR=\033[0;32m
INFO_COLOR=\033[1;36m
CLEAR=\033[m\017

help:
	@echo "MHS Hosted Files"
	@echo ""
	@echo "Targets:"
	@echo "        prod: push master branch to aris hosted directory"
	@echo ""
	@echo "make [prod]"

CHECKOUT_COMMAND="cd /var/www/arisgames.org/hosted/MHS && git checkout master && git pull --ff-only"

STATUS_COMMAND="cd /var/www/arisgames.org/hosted/MHS && git fetch && git log -1 --date=short --pretty=format:'%Cred%h%Creset %Cgreen%cd%Creset %C(bold blue)%an%Creset%C(yellow)%d%Creset %s%Creset'"

prod:
	@echo "Pushing to Github."
	@git push 1>/dev/null
	@echo "   $(OK_COLOR)(Done)$(CLEAR)"
	@echo "Deploying to Production."
	@ssh -t fieldday-web $(CHECKOUT_COMMAND) 1>/dev/null
	@echo "   $(OK_COLOR)(Done)$(CLEAR)"

status:
	@echo "Status on Production$(INFO_COLOR)"
	@ssh fieldday-web $(STATUS_COMMAND)
	@echo "$(CLEAR)"

deploy: prod

all: deploy
