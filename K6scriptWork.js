import { check, sleep, group } from 'k6'
import http from 'k6/http'
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js'
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
//import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.1.0/index.js';
import { randomIntBetween, 
  randomString,
  randomItem,
  uuidv4,
  findBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";

export const options = {
      
  thresholds: {
    http_req_duration: ['p(95)<=5000'],
    http_reqs: ['count>=10'],
    http_req_failed: ['rate<=10'],
    iteration_duration: ['p(95)>=10'],
    checks: ['rate>=0.9'], //delete if will be error
  },
  scenarios: {
    Scenario_1: {
      executor: 'ramping-vus',
      gracefulStop: '30s',
      stages: [
        { target: 1, duration: '20s' },
        { target: __ENV.VUS, duration: __ENV.Duration },
        { target: 0, duration: '30s' },
      ],
      gracefulRampDown: '30s',
      exec: 'scenario_1',
    },
  },
}

/*export default function main() {
  const options = {
    vus: __ENV.VUS, 
    duration: __ENV.DURATION, 
  };

  console.log(`VUS: ${__ENV.VUS}`);
  console.log(`Duration: ${__ENV.Duration}`);

}*/

export function scenario_1() {

  console.log(`VUS: ${__ENV.VUS}`);
  console.log(`Duration: ${__ENV.Duration}`);

  let formData, response

 // for (let i = 0; i < 3; i++) {
 //   group(`User ${i + 1}`, () => {
      // Generate random data
      const firstName = `K6${randomAlpha(8)}`;
      const lastName = `K6${randomAlpha(8)}`;
      const email = `${firstName.toLowerCase()}@mail.com`;
      const telephone = randomNumeric(6);
      
      group(
        'register page - http://172.23.176.138/opencart/upload/index.php?route=account/register',
        function () {
          response = http.get(
            'http://172.23.176.138/opencart/upload/index.php?route=account/register',
            {
              headers: {
                'upgrade-insecure-requests': '1',
              },
            }
          )
          check(response, {
            "body contains Register": response =>response.body.includes("Register"),
          })
          
          response = http.get(
            'http://172.23.176.138/opencart/upload/index.php?route=account/register/customfield&customer_group_id=1',
            {
              headers: {
                accept: 'application/json, text/javascript, */*; q=0.01',
                'x-requested-with': 'XMLHttpRequest',
              },
            }
          )
          
          sleep(Math.random() * 5);
    
          // register data
          formData = new FormData()
          formData.boundary = '----WebKitFormBoundaryybezAIAoaWSVML9e'
          formData.append('customer_group_id', '1')
          formData.append('firstname', firstName)
          formData.append('lastname', lastName)
          formData.append('email', email)
          formData.append('telephone', telephone)
          formData.append('password', 'custK6')
          formData.append('confirm', 'custK6')
          formData.append('newsletter', '0')
          formData.append('agree', '1')
    
          response = http.post(
            'http://172.23.176.138/opencart/upload/index.php?route=account/register',
            formData.body(),
            {
              headers: {
                'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryybezAIAoaWSVML9e',
                origin: 'http://172.23.176.138',
                'upgrade-insecure-requests': '1',
              },
            }
          )
          sleep(3)
        }
      )

      group(

        
        'choose category - http://172.23.176.138/opencart/upload/index.php?route=product/category&path=',
        function () {
          
            // Extract category ID using regex
            const categoryIDRegex = /path=(\d{2,4})/g;
            const categoryMatches = response.body.matchAll(categoryIDRegex);
            const categoryIDs = Array.from(categoryMatches, (match) => match[1]);
            const categoryID = randomItem(categoryIDs);
            const categoryURL = `http://172.23.176.138/opencart/upload/index.php?route=product/category&path=${categoryID}`;
            console.log('category ID: ' + categoryID);

            response = http.get(categoryURL,
              {
                headers: {
                  'upgrade-insecure-requests': '1',
                },
              }
            );

            check(response, {
              "body contains Product Compare": response =>response.body.includes("Product Compare"),
            })

            // Select a random product ID
            const productIDRegex = /product_id=(\d{2,4})/g;
            const matches = response.body.matchAll(productIDRegex);
            const productIDs = Array.from(matches, (match) => match[1]);
            const product_id = randomItem(productIDs);
            console.log('Product_id: ' + product_id);

            // choose product
          response = http.post(
            'http://172.23.176.138/opencart/upload/index.php?route=checkout/cart/add',
            {
              product_id: product_id,
              quantity: '1',
            },
            {
              headers: {
                accept: 'application/json, text/javascript, */*; q=0.01',
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'x-requested-with': 'XMLHttpRequest',
              },
            }
          )
          sleep(Math.random() * 5);
    
          // add to cart
          response = http.get(
            'http://172.23.176.138/opencart/upload/index.php?route=common/cart/info',
            {
              headers: {
                accept: 'text/html, */*; q=0.01',
                'x-requested-with': 'XMLHttpRequest',
              },
            }
          )
          sleep(6.5)
        }
      )

      group(
        'view cart - http://172.23.176.138/opencart/upload/index.php?route=checkout/cart',
        function () {
          response = http.get('http://172.23.176.138/opencart/upload/index.php?route=checkout/cart', {
            headers: {
              'upgrade-insecure-requests': '1',
            },
          })
          check(response, {
            "body contains Shopping Cart": response =>response.body.includes("Shopping Cart"),
          })
          response = http.get(
            'http://172.23.176.138/opencart/upload/index.php?route=extension/total/shipping/country&country_id=222',
            {
              headers: {
                accept: 'application/json, text/javascript, */*; q=0.01',
                'x-requested-with': 'XMLHttpRequest',
              },
            }
          )
          sleep(3)
        }
      )

      group(
        'logout - http://172.23.176.138/opencart/upload/index.php?route=account/logout',
        function () {
          response = http.get('http://172.23.176.138/opencart/upload/index.php?route=account/logout', {
            headers: {
              'upgrade-insecure-requests': '1',
            },
          })
          check(response, {
            "body contains Account Logout": response =>response.body.includes("Account Logout"),
          })
        }
      )

 //   });
 // }
}


export function handleSummary(data) {
  return {
    "resultK6.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}

function randomAlpha(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function randomNumeric(length) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}
