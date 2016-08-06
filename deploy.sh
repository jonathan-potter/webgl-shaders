git branch gh-pages
git checkout gh-pages
webpack
git add .
git commit -m "prep for deployment"
git push -f origin gh-pages
git checkout master
git branch -D gh-pages
