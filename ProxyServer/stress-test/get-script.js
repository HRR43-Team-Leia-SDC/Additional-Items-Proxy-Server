// import http from 'k6/http';

// export const options = {
//   vus: 200,
//   duration: '300s',
// };

// export default function () {
//   http.get('http://localhost:3005/?36256214');
//   http.get('http://localhost:3005/additional/36256214');
// }

import http from 'k6/http';
import { check } from 'k6';
import { Rate, Counter, Trend } from 'k6/metrics';


export const options = {
  // ramp up from 1 to X VUs in 60 seconds
  // stay at X VUs for 180s
  // ramp down to 0 VUs for 30s
  stages: [
    { target: 100, duration: '60s' },
    { target: 200, duration: '180s' },
    { target: 0, duration: '30s' },
  ],
};

const errorRate = new Rate('errors');
const waitingTime = new Trend('waiting_time');

export default function () {
  // random number
  const random = Math.floor(Math.random() * (36256214 - 1)) + 1;
  const res = http.get(`http://localhost:3004/${random}`);

  const result = check(res, {
    'status was 200': (r) => r.status === 200,
  });

  // record check failures
  errorRate.add(!result);

  // record waiting time
  waitingTime.add(res.timings.waiting);


  // http.get('http://localhost:3004/additional/' + random);
}