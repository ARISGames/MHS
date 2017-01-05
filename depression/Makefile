.PHONY: list deploy

list:
	@echo "Run 'make deploy' to upload."

deploy:
	rsync -vrc * root@morpheus.arisgames.org:/var/www/html/hosted/MHS/depression --delete --exclude-from rsync-exclude
