from selenium import webdriver
import selenium.webdriver.support.ui as ui
from selenium.common.exceptions import TimeoutException,NoSuchElementException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.chrome.options import Options

import selenium.webdriver.support.expected_conditions as EC
import time
import logging
import datetime

options = Options()
# 无窗口模式
# options.add_argument('--headless')
# 解决反爬识别selenium
options.add_experimental_option('excludeSwitches', ['enable-automation'])
options.add_experimental_option('useAutomationExtension', False)
# 设置默认编码为 utf-8，也就是中文
options.add_argument('lang=zh_CN.UTF-8')

# prefs = {"profile.managed_default_content_settings.images": 1}
# options.add_experimental_option("prefs", prefs)

from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
desired_capabilities = DesiredCapabilities.CHROME
#desired_capabilities["pageLoadStrategy"] = "none"

name = "亓康富"
Sid = "201822010814"
address = r"电子科技大学清水河校区"
LoggerName = "MyLogger"
logging.basicConfig(filename="C:\\Users\\angus\\Desktop\\everydayDaka.log", filemode="a", format="%(asctime)s %(name)s:%(levelname)s:%(message)s", datefmt="%D %H:%M:%S", level=logging.INFO)
driver = webdriver.Chrome(options=options,executable_path="chromedriver.exe",desired_capabilities=desired_capabilities)


def fill_table():
    pass
def is_visible(driver, locator, timeout=0.5):
    try:
        ui.WebDriverWait(driver, timeout).until(EC.visibility_of_element_located((By.XPATH, locator)))
        return True
    except TimeoutException:
        return False
def morningDaka():
    username = '201822010814'
    passwd = 'Kf95@uestc.edu'
    driver.set_page_load_timeout(5)
    driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
        "source": """
        Object.defineProperty(navigator, 'webdriver', {
          get: () => undefined
        })
      """
    })
    driver.get("http://eportal.uestc.edu.cn/")
    # try:
    #     driver.get('https://idas.uestc.edu.cn/authserver/login')
    # except TimeoutException:
    #     print('timeout')
    print('the page is loaded')
    time.sleep(2)
    if driver.find_element_by_xpath('//*[@id="ampHasNoLogin"]').is_enabled():

        driver.find_element_by_xpath('//*[@id="ampHasNoLogin"]').click()
    time.sleep(5)
    driver.find_element_by_xpath('//*[@id="username"]').send_keys(username)
    time.sleep(0.5)
    driver.find_element_by_xpath('//*[@id="password"]').send_keys(passwd)
    time.sleep(3.5)
    driver.find_element_by_xpath('//*[@id="casLoginForm"]/p[4]/button').click()
    time.sleep(0.5)
    #WebDriverWait(driver, 10, 0.1).until(lambda x: x.find_element_by_xpath('//*[@id="captcha"]'))
    print('capta done')
def EvenningDaka():

    driver.get("https://jinshuju.net/f/9wGVFn")
    time.sleep(2)
    # click on editName
    try:
        driver.find_element_by_xpath('//*[@id="root"]/div/form/div[3]/div/div[2]/div/div[2]/div/div/span/input').send_keys(
            name)
        time.sleep(1)
        driver.find_element_by_xpath('//*[@id="root"]/div/form/div[3]/div/div[4]/div/div[2]/div/div/span/input').send_keys(
            Sid)
        time.sleep(0.5)
        # 全日制
        driver.find_element_by_xpath(
            '//*[@id="root"]/div/form/div[3]/div/div[6]/div/div[2]/div/div/span/div/div[1]/div/div/label/span[1]/input').click()
        time.sleep(0.5)
        # 宿舍
        driver.find_element_by_xpath(
            '//*[@id="root"]/div/form/div[3]/div/div[8]/div/div[2]/div/div/span/div/div[1]/div/div/label/span[1]/input').click()
        time.sleep(0.5)
        # 清水河
        xpath1 = '//*[@id="root"]/div/form/div[3]/div/div[10]/div/div[2]/div/div/span/div/div[1]/div/div/label/span[1]/input'

        driver.find_element_by_xpath(xpath1).click()
        print("finish1")
        time.sleep(0.5)
        # 11:00前回宿舍
        xpath2 = '//*[@id="root"]/div/form/div[3]/div/div[12]/div/div[2]/div/div/span/div/div[1]/div/div/label/span[1]/input'

        driver.find_element_by_xpath(xpath2).click()
        time.sleep(0.5)
        # 地理位置
        xpath3 = '//*[@id="root"]/div/form/div[3]/div/div[14]/div/div[2]/div/div/span/div/div/button'
        # if is_visible(driver,xpath3):
        driver.find_element_by_xpath(xpath3).click()
        time.sleep(3)

        # print(alert.text)
        driver.find_element_by_xpath(
            '//*[@id="root"]/div/form/div[3]/div/div[14]/div/div[2]/div/div/span/div/div/div[2]/div[2]/div/input').send_keys(
            address)
        driver.find_element_by_xpath(
            '//*[@id="root"]/div/form/div[3]/div/div[14]/div/div[2]/div/div/span/div/div/div[2]/div[2]/div/button').click()
        time.sleep(1)

        # alert
        # 打勾
        driver.find_element_by_xpath('//*[@id="root"]/div/form/div[5]/label/span[1]/input').click()
        # 提交
        time.sleep(0.5)
        driver.find_element_by_xpath('//*[@id="root"]/div/form/div[6]/div/button').click()

    except NoSuchElementException:
        print('NoSuchElementException find,may it\'s not the time to sign up ')
    finally:
        time.sleep(3)
        driver.quit()
        print("ok")


if __name__ == '__main__':
    morningDaka()
    # logging.info('start to clock in ')
    # EvenningDaka()
    # logging.info('success')