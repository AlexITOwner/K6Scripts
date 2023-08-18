import { sleep, group } from 'k6'
import http from 'k6/http'
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js'

export const options = {

  thresholds: {},
  scenarios: {
    Scenario_1: {
      executor: 'ramping-vus',
      gracefulStop: '30s',
      stages: [
        { target: 1, duration: '1m' },
        { target: 1, duration: '3m30s' },
        { target: 0, duration: '1m' },
      ],
      gracefulRampDown: '30s',
      exec: 'scenario_1',
    },
  },
}

export function scenario_1() {
  let formData, response

  group(
    'account/register - http://172.23.176.138/opencart/upload/index.php?route=account/register',
    function () {
      response = http.get(
        'http://172.23.176.138/opencart/upload/index.php?route=account/register',
        {
          headers: {
            'upgrade-insecure-requests': '1',
          },
        }
      )
      sleep(1.9)

      response = http.get(
        'http://172.23.176.138/opencart/upload/index.php?route=account/register/customfield&customer_group_id=1',
        {
          headers: {
            accept: 'application/json, text/javascript, */*; q=0.01',
            'x-requested-with': 'XMLHttpRequest',
          },
        }
      )
      sleep(29.1)

      // register data
      formData = new FormData()
      formData.boundary = '----WebKitFormBoundaryO2MAcSDyD2FbXLdF'
      formData.append('customer_group_id', '1')
      formData.append('firstname', 'CustomerK6')
      formData.append('lastname', 'CustomerK6')
      formData.append('email', 'custk6@mail.com')
      formData.append('telephone', '999999')
      formData.append('password', 'custK6')
      formData.append('confirm', 'custK6')
      formData.append('newsletter', '0')
      formData.append('agree', '1')

      response = http.post(
        'http://172.23.176.138/opencart/upload/index.php?route=account/register',
        formData.body(),
        {
          headers: {
            'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryO2MAcSDyD2FbXLdF',
            origin: 'http://172.23.176.138',
            'upgrade-insecure-requests': '1',
          },
        }
      )
      sleep(4.4)
    }
  )

  group(
    'register/logout - http://172.23.176.138/opencart/upload/index.php?route=account/logout',
    function () {
      response = http.get('http://172.23.176.138/opencart/upload/index.php?route=account/logout', {
        headers: {
          'upgrade-insecure-requests': '1',
        },
      })
      sleep(3)
    }
  )

  group(
    'login page - http://172.23.176.138/opencart/upload/index.php?route=account/login',
    function () {
      response = http.get('http://172.23.176.138/opencart/upload/index.php?route=account/login', {
        headers: {
          'upgrade-insecure-requests': '1',
        },
      })
      sleep(19.5)

      // login data
      formData = new FormData()
      formData.boundary = '----WebKitFormBoundarySNeziYmF06yez52U'
      formData.append('email', 'custk6@mail.com')
      formData.append('password', 'custK6')

      response = http.post(
        'http://172.23.176.138/opencart/upload/index.php?route=account/login',
        formData.body(),
        {
          headers: {
            'content-type': 'multipart/form-data; boundary=----WebKitFormBoundarySNeziYmF06yez52U',
            origin: 'http://172.23.176.138',
            'upgrade-insecure-requests': '1',
          },
        }
      )
      sleep(3.7)
    }
  )

  group(
    'login logout - http://172.23.176.138/opencart/upload/index.php?route=account/logout',
    function () {
      response = http.get('http://172.23.176.138/opencart/upload/index.php?route=account/logout', {
        headers: {
          'upgrade-insecure-requests': '1',
        },
      })
    }
  )
}
