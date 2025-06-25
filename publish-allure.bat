@echo off
set /p version=Enter report version (e.g., v1, v2, latest): 

echo 📊 Generating Allure report...
npx playwright test
allure generate allure-results --clean -o allure-report

echo 🔁 Switching to gh-pages branch...
git checkout gh-pages

echo 📂 Copying new report to %version% folder...
rmdir /S /Q "%version%" 2>nul
mkdir %version%
xcopy /E /Y /I allure-report\* %version%\

echo ➕ Adding and committing versioned report...
git add %version%
git commit -m "Add report for version %version%"
git push origin gh-pages

echo ✅ Report for version %version% deployed at:
echo https://natarajn121.github.io/playwright-report-demo/%version%/
pause
