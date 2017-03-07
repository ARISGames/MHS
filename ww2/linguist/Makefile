.PHONY: list deploy

list:
	@echo "Run 'make deploy' to upload."

deploy:
	rsync -vrc * root@morpheus.arisgames.org:/var/www/html/scratch/linguist --exclude-from rsync-exclude
