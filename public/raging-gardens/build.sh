#!/bin/sh

PWD=$(pwd)
YUI=$(pwd)/yuicompressor-2.4.8pre.jar
BUILD=$(pwd)/build
VERSION=$(cat $PWD/manifest.json | grep \"version\" | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d ' ')

#if [ ! -d $BUILD ]; then
#	echo "Build folder($BUILD) does not exist!"
#	exit
#fi

if [ ! -e $YUI ]; then
	echo "YUI not found in $YUI!"
	exit
fi

### Cleanup old build files
echo "Cleaning old build files ..."

#find $BUILD -type f ! -name ".gitkeep" |xargs -i rm {}
#find $BUILD -type d ! -name ".gitkeep" -and ! -name "build" |xargs -i rmdir {} -p
if [ -d $BUILD ]; then
	rm -rf $BUILD
fi
mkdir $BUILD

if [ "$1" == "clean" ]; then
	exit;
fi

echo "Building ..."

### Copy required files

cp art/ $BUILD -R
#cp promo/ $BUILD -R
cp css/ $BUILD -R
cp lib/ $BUILD -R
cp sfx/ $BUILD -R
cp src/ $BUILD -R
cp favicon.ico index.html LICENSE manifest.json $BUILD
rm -rf $BUILD/lib/qunit

### Obfuscate javascript
cd $BUILD/css
java -jar $YUI  -o 'style.min.css' style.css
rm style.css
cd $BUILD/src
java -jar $YUI  -o '.js$:.js' *.js

### Production
cd $BUILD
sed -i 's/style.css/style.min.css/g' index.html
sed -i 's/dev/prod/g' index.html
sed -i "s/\:ver/:'$VERSION'/g" index.html
sed -i "s/\+ver/+'$VERSION'/g" index.html
sed -i '/<\!\-\-URCHIN\-\->/{
    s/<\!\-\-URCHIN\-\->//g
    r ../urchin
}' index.html


echo "Build completed."
