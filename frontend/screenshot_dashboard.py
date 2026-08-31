from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto('http://localhost:3000/dashboard')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(2000)
    page.screenshot(path='dashboard_screenshot.png', full_page=False)
    print("Screenshot saved to dashboard_screenshot.png")
    browser.close()
