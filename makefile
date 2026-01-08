buildsf:
	npm run build:sf

build:
	npm run build
cp:
	/Users/parapeng/Desktop/apkEditor/app/html/dist

push-admin:
	git subtree push --prefix=src/admin admin-module master
pull-admin:
	git subtree pull --prefix=src/admin admin-module master
