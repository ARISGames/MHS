.PHONY: list deploy

list:
	@echo "Run 'make deploy' to upload."

deploy:
	rsync -vrc * tolly@fieldday-web.ad.education.wisc.edu:/var/www/arisgames.org/hosted/MHS/ww2/bullet --exclude-from rsync-exclude
