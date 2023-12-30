OUT=$(date +"luti-%Y-%m-%dT%H-%M")
VIDEOS=../../light-luti-videos
rm -rf build
npm run build 
cd build 
mkdir videos
rsync --progress -au "${VIDEOS}/" videos/
zip -9r "${1}/${OUT}.zip" . 
echo "${1}/${OUT}.zip"
cd ..
