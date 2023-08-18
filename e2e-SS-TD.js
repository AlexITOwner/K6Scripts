import { sleep, check, group } from "k6";
import http from "k6/http";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { SharedArray } from "k6/data";
import { FormData } from "https://jslib.k6.io/formdata/0.0.1/index.js";
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { randomIntBetween, 
  randomString,
  randomItem,
  uuidv4,
  findBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
const csvData = new SharedArray("another data name", function() {  return papaparse.parse(open('./TDU.csv'), { header: true }).data;
});
export const options = {
  stages: [
    { target: 10, duration: "5s" },
  ],
  thresholds: {
    http_req_duration: ["p(95)<=1500"],
    http_reqs: ["count>=1"],
    http_req_failed: ["rate>=1"],
    load_generator_memory_used_percent: ["value>=1"],
    load_generator_cpu_percent: ["value>=1"],
    iteration_duration: ["p(95)>=1"],
  },
};
export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}
export default function main() {
  let formData, response;
  let newUser = csvData[__VU - 1];
  console.log('User: ', JSON.stringify(newUser));
  const params = {
    email: newUser.email,
    password: newUser.password,
  };
  group(
    "home - http://172.23.176.158/opencart/upload/index.php?route=common/home",
    function () {
      // home
      response = http.get(
        "http://172.23.176.158/opencart/upload/index.php?route=common/home",
        {
          headers: {
            host: "172.23.176.158",
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "accept-language": "en-US,en;q=0.5",
            "accept-encoding": "gzip, deflate",
            connection: "keep-alive",
            "upgrade-insecure-requests": "1",
          },
        }
      );
      check(response, {
        "body contains Featured": response =>
          response.body.includes("Featured"),
      });
      sleep(2.5);
    }
  );

  group(
    "Login - http://172.23.176.158/opencart/upload/index.php?route=account/login",
    function () {
      // login_page
      response = http.get(
        "http://172.23.176.158/opencart/upload/index.php?route=account/login",
        {
          headers: {
            host: "172.23.176.158",
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "accept-language": "en-US,en;q=0.5",
            "accept-encoding": "gzip, deflate",
            connection: "keep-alive",
            "upgrade-insecure-requests": "1",
          },
        }
      );
      check(response, {
        "body contains Returning Customer": response =>
          response.body.includes("Returning Customer"),
      });
      sleep(4.1);

       // login_Creds
      formData = new FormData();
      formData.boundary =
        "---------------------------844540928712614924040960370";
      formData.append("email", {
        data: newUser.email,
        content_type: "text/plain",
      });
      formData.append("password", {
        data: newUser.password,
        content_type: "text/plain",
      });
      response = http.post(
        "http://172.23.176.158/opencart/upload/index.php?route=account/login", formData.body(), 
        {
          headers: {
            host: "172.23.176.158",
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "accept-language": "en-US,en;q=0.5",
            "accept-encoding": "gzip, deflate",
            "content-type":
              "multipart/form-data, boundary=---------------------------844540928712614924040960370",
            origin: "http://172.23.176.158",
            connection: "keep-alive",
            "upgrade-insecure-requests": "1",
          },
        }
      );
      check(response, {
        "body contains Your Store": response =>
          response.body.includes("Your Store"),
      
      });
      console.log(formData.body());
      sleep(1);
    }
  );

  group(
    "Add_product - http://172.23.176.158/opencart/upload/index.php?route=product/category&path=20_27",
    function () {
      // Category
      response = http.get(
        "http://172.23.176.158/opencart/upload/index.php?route=product/category&path=20_27",
        {
          headers: {
            host: "172.23.176.158",
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "accept-language": "en-US,en;q=0.5",
            "accept-encoding": "gzip, deflate",
            connection: "keep-alive",
            "upgrade-insecure-requests": "1",
          },
        }
      );
      check(response, {
        "body contains wishlist.add": response =>
          response.body.includes("wishlist.add"),
      });

      let product_id = findBetween(response.body, '<a href="http://172.23.176.158/opencart/upload/index.php?route=product/product&amp;path=20_27&amp;product_id=', '">');
      console.log('Product_id: ' + product_id);
      sleep(1.8);

      // Add_prod
      response = http.post(
        "http://172.23.176.158/opencart/upload/index.php?route=checkout/cart/add",
        {
          product_id: product_id,
          quantity: "1",
        },
        {
          headers: {
            host: "172.23.176.158",
            accept: "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.5",
            "accept-encoding": "gzip, deflate",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "x-requested-with": "XMLHttpRequest",
            origin: "http://172.23.176.158",
            connection: "keep-alive",
          },
        }
      );
      check(response, {
        "body contains success": response => response.body.includes("success"),
      });

       // Cart_info
       response = http.get(
         "http://172.23.176.158/opencart/upload/index.php?route=common/cart/info",
         {
           headers: {
             host: "172.23.176.158",
             accept: "text/html, */*; q=0.01",
             "accept-language": "en-US,en;q=0.5",
             "accept-encoding": "gzip, deflate",
             "x-requested-with": "XMLHttpRequest",
             connection: "keep-alive",
           },
         }
       );
       check(response, {
         "body contains Total": response => response.body.includes("Total"),
      });
      sleep(3.2);
    }
  );
 // console.log(response.body);

  group(
    "Checkout - http://172.23.176.158/opencart/upload/index.php?route=checkout/checkout",
    function () {
      // Checkout
      response = http.get(
        "http://172.23.176.158/opencart/upload/index.php?route=checkout/checkout",
        {
          headers: {
            host: "172.23.176.158",
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "accept-language": "en-US,en;q=0.5",
            "accept-encoding": "gzip, deflate",
            connection: "keep-alive",
            "upgrade-insecure-requests": "1",
          },
        }
      );
      check(response, {
        "body contains Checkout": response =>
          response.body.includes("Checkout"),
      });

      response = http.get(
        "http://172.23.176.158/opencart/upload/index.php?route=checkout/payment_address",
        {
          headers: {
            host: "172.23.176.158",
            accept: "text/html, */*; q=0.01",
            "accept-language": "en-US,en;q=0.5",
            "accept-encoding": "gzip, deflate",
            "x-requested-with": "XMLHttpRequest",
            connection: "keep-alive",
          },
        }
      );
      check(response, {
        "body contains I want to use an existing address": response =>
          response.body.includes("I want to use an existing address"),
      });

      response = http.get(
        "http://172.23.176.158/opencart/upload/index.php?route=checkout/checkout/country&country_id=222",
        {
          headers: {
            host: "172.23.176.158",
            accept: "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.5",
            "accept-encoding": "gzip, deflate",
            "x-requested-with": "XMLHttpRequest",
            connection: "keep-alive",
          },
        }
      );
      sleep(3);

      // Checkout1
      response = http.post(
        "http://172.23.176.158/opencart/upload/index.php?route=checkout/payment_address/save",
        {
          firstname: "lmane",
          payment_address: "new",
          lastname: "asdf",
          company: "",
          address_1: "asdf",
          address_2: "",
          city: "cccc",
          postcode: "1111",
          country_id: "222",
          zone_id: "3532",
        },
        {
          headers: {
            host: "172.23.176.158",
            accept: "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.5",
            "accept-encoding": "gzip, deflate",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "x-requested-with": "XMLHttpRequest",
            origin: "http://172.23.176.158",
            connection: "keep-alive",
          },
        }
      );
      check(response, {
        "status equals 200": response => response.status.toString() === "200",
      });

      response = http.get(
        "http://172.23.176.158/opencart/upload/index.php?route=checkout/shipping_address",
        {
          headers: {
            host: "172.23.176.158",
            accept: "text/html, */*; q=0.01",
            "accept-language": "en-US,en;q=0.5",
            "accept-encoding": "gzip, deflate",
            "x-requested-with": "XMLHttpRequest",
            connection: "keep-alive",
          },
        }
      );

      response = http.get(
        "http://172.23.176.158/opencart/upload/index.php?route=checkout/checkout/country&country_id=222",
        {
          headers: {
            host: "172.23.176.158",
            accept: "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.5",
            "accept-encoding": "gzip, deflate",
            "x-requested-with": "XMLHttpRequest",
            connection: "keep-alive",
          },
        }
      );

      response = http.get(
        "http://172.23.176.158/opencart/upload/index.php?route=checkout/payment_address",
        {
          headers: {
            host: "172.23.176.158",
            accept: "text/html, */*; q=0.01",
            "accept-language": "en-US,en;q=0.5",
            "accept-encoding": "gzip, deflate",
            "x-requested-with": "XMLHttpRequest",
            connection: "keep-alive",
          },
        }
      );

      response = http.get(
        "http://172.23.176.158/opencart/upload/index.php?route=checkout/checkout/country&country_id=222",
        {
          headers: {
            host: "172.23.176.158",
            accept: "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.5",
            "accept-encoding": "gzip, deflate",
            "x-requested-with": "XMLHttpRequest",
            connection: "keep-alive",
          },
        }
      );
      sleep(2);

      // Checkout2
      response = http.post(
        "http://172.23.176.158/opencart/upload/index.php?route=checkout/shipping_address/save",
        {
          shipping_address: "existing",
          address_id: "6005",
          firstname: "",
          lastname: "",
          company: "",
          address_1: "",
          address_2: "",
          city: "",
          postcode: "",
          country_id: "222",
          zone_id: "",
        },
        {
          headers: {
            host: "172.23.176.158",
            accept: "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.5",
            "accept-encoding": "gzip, deflate",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "x-requested-with": "XMLHttpRequest",
            origin: "http://172.23.176.158",
            connection: "keep-alive",
          },
        }
      );

      response = http.get(
        "http://172.23.176.158/opencart/upload/index.php?route=checkout/shipping_method",
        {
          headers: {
            host: "172.23.176.158",
            accept: "text/html, */*; q=0.01",
            "accept-language": "en-US,en;q=0.5",
            "accept-encoding": "gzip, deflate",
            "x-requested-with": "XMLHttpRequest",
            connection: "keep-alive",
          },
        }
      );

      response = http.get(
        "http://172.23.176.158/opencart/upload/index.php?route=checkout/shipping_address",
        {
          headers: {
            host: "172.23.176.158",
            accept: "text/html, */*; q=0.01",
            "accept-language": "en-US,en;q=0.5",
            "accept-encoding": "gzip, deflate",
            "x-requested-with": "XMLHttpRequest",
            connection: "keep-alive",
          },
        }
      );

      response = http.get(
        "http://172.23.176.158/opencart/upload/index.php?route=checkout/payment_address",
        {
          headers: {
            host: "172.23.176.158",
            accept: "text/html, */*; q=0.01",
            "accept-language": "en-US,en;q=0.5",
            "accept-encoding": "gzip, deflate",
            "x-requested-with": "XMLHttpRequest",
            connection: "keep-alive",
          },
        }
      );

      response = http.get(
        "http://172.23.176.158/opencart/upload/index.php?route=checkout/checkout/country&country_id=222",
        {
          headers: {
            host: "172.23.176.158",
            accept: "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.5",
            "accept-encoding": "gzip, deflate",
            "x-requested-with": "XMLHttpRequest",
            connection: "keep-alive",
          },
        }
      );

      response = http.get(
        "http://172.23.176.158/opencart/upload/index.php?route=checkout/checkout/country&country_id=222",
        {
          headers: {
            host: "172.23.176.158",
            accept: "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.5",
            "accept-encoding": "gzip, deflate",
            "x-requested-with": "XMLHttpRequest",
            connection: "keep-alive",
          },
        }
      );
      sleep(1.6);

      // Checkout3
      response = http.post(
        "http://172.23.176.158/opencart/upload/index.php?route=checkout/shipping_method/save",
        {
          shipping_method: "flat.flat",
          comment: "",
        },
        {
          headers: {
            host: "172.23.176.158",
            accept: "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.5",
            "accept-encoding": "gzip, deflate",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "x-requested-with": "XMLHttpRequest",
            origin: "http://172.23.176.158",
            connection: "keep-alive",
          },
        }
      );

      response = http.get(
        "http://172.23.176.158/opencart/upload/index.php?route=checkout/payment_method",
        {
          headers: {
            host: "172.23.176.158",
            accept: "text/html, */*; q=0.01",
            "accept-language": "en-US,en;q=0.5",
            "accept-encoding": "gzip, deflate",
            "x-requested-with": "XMLHttpRequest",
            connection: "keep-alive",
          },
        }
      );
      sleep(2.7);

      // Checkout4
      response = http.post(
        "http://172.23.176.158/opencart/upload/index.php?route=checkout/payment_method/save",
        {
          payment_method: "cod",
          comment: "",
          agree: "1",
        },
        {
          headers: {
            host: "172.23.176.158",
            accept: "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.5",
            "accept-encoding": "gzip, deflate",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "x-requested-with": "XMLHttpRequest",
            origin: "http://172.23.176.158",
            connection: "keep-alive",
          },
        }
      );

      // Checkout_Conf
      response = http.get(
        "http://172.23.176.158/opencart/upload/index.php?route=checkout/confirm",
        {
          headers: {
            host: "172.23.176.158",
            accept: "text/html, */*; q=0.01",
            "accept-language": "en-US,en;q=0.5",
            "accept-encoding": "gzip, deflate",
            "x-requested-with": "XMLHttpRequest",
            connection: "keep-alive",
          },
        }
      );
      check(response, {
        "body contains Total:": response => response.body.includes("Total:"),
      });
      sleep(1.9);

      // Checkout_conf_pay
      response = http.get(
        "http://172.23.176.158/opencart/upload/index.php?route=extension/payment/cod/confirm",
        {
          headers: {
            host: "172.23.176.158",
            accept: "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.5",
            "accept-encoding": "gzip, deflate",
            "x-requested-with": "XMLHttpRequest",
            connection: "keep-alive",
          },
        }
      );
    }
  );

  group(
    "Checkout_Success - http://172.23.176.158/opencart/upload/index.php?route=checkout/success",
    function () {
      // Checkout_Success
      response = http.get(
        "http://172.23.176.158/opencart/upload/index.php?route=checkout/success",
        {
          headers: {
            host: "172.23.176.158",
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "accept-language": "en-US,en;q=0.5",
            "accept-encoding": "gzip, deflate",
            connection: "keep-alive",
            "upgrade-insecure-requests": "1",
          },
        }
      );
      check(response, {
        "body contains Your order has been placed!": response =>
          response.body.includes("Your order has been placed!"),
      });
      sleep(4);
    }
  );

  group(
    "page_7 - http://172.23.176.158/opencart/upload/index.php?route=account/logout",
    function () {
      // Logout
      response = http.get(
        "http://172.23.176.158/opencart/upload/index.php?route=account/logout",
        {
          headers: {
            host: "172.23.176.158",
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "accept-language": "en-US,en;q=0.5",
            "accept-encoding": "gzip, deflate",
            connection: "keep-alive",
            "upgrade-insecure-requests": "1",
          },
        }
      );
      check(response, {
        "body contains Account Logout": response =>
          response.body.includes("Account Logout"),
      });
    }
  );
  console.log();
  console.debug();

}
