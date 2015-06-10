OK_COLOR=\033[0;32m
INFO_COLOR=\033[1;36m
CLEAR=\033[m\017

help:
	@echo "MHS Hosted Files"
	@echo ""
	@echo "Targets:"
	@echo "        prod: push v2 branch to aris hosted directory"
	@echo ""
	@echo "make [deploy]"

CHECKOUT_COMMAND="cd /var/www/html/hosted/MHS && git fetch && git checkout v2_6644_remap && git pull"

STATUS_COMMAND="cd /var/www/html/hosted/MHS && git fetch && git log -1 --date=short --pretty=format:'%Cred%h%Creset %Cgreen%cd%Creset %C(bold blue)%an%Creset%C(yellow)%d%Creset %s%Creset'"


prod:
	@echo "Pushing to Github."
	@git push 1>/dev/null
	@echo "   $(OK_COLOR)(Done)$(CLEAR)"
	@echo "Deploying to Production 1."
	@ssh -t aris-prod1 $(CHECKOUT_COMMAND) 1>/dev/null
	@echo "   $(OK_COLOR)(Done)$(CLEAR)"
	@echo "Deploying to Production 2."
	@ssh -t aris-prod2 $(CHECKOUT_COMMAND) 1>/dev/null
	@echo "   $(OK_COLOR)(Done)$(CLEAR)"
	@echo "Deploying to Production 3."
	@ssh -t aris-prod3 $(CHECKOUT_COMMAND) 1>/dev/null
	@echo "   $(OK_COLOR)(Done)$(CLEAR)"

status:
	@echo "Commit on Production 1$(INFO_COLOR)"
	@ssh aris-prod1 $(STATUS_COMMAND)
	@echo "$(CLEAR)"
	@echo "Commit on Production 2$(INFO_COLOR)"
	@ssh aris-prod2 $(STATUS_COMMAND)
	@echo "$(CLEAR)"
	@echo "Commit on Production 3$(INFO_COLOR)"
	@ssh aris-prod3 $(STATUS_COMMAND)
	@echo "$(CLEAR)"

deploy: prod

all: deploy
