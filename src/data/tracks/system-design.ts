import type { Track } from '../types'

export const track: Track = {
  slug: 'system-design',
  title: 'System Design',
  tagline: 'Distributed systems for people who will be paged.',
  description:
    'Storage, replication, partitioning, caches, queues, and the reliability patterns behind them, with the arithmetic to size each one.',
  accent: 'var(--accent-systems)',
  status: 'live',
  modules: [
    {
      slug: 'fundamentals',
      title: 'Fundamentals',
      description: 'Latency, throughput, queueing, service levels, and back-of-the-envelope estimation.',
      lessons: [
        {
          slug: 'back-of-envelope',
          title: 'Back-of-the-envelope estimation',
          summary: 'Turn users and requests into queries per second, bandwidth, and storage with a few reference numbers.',
          minutes: 12,
          objectives: [
            'Convert daily active users and requests per user into average and peak queries per second.',
            'Estimate bandwidth and storage from a request size and a retention period.',
            'Recall the latency of memory, disk, and network operations within a factor of 10.',
            'Decide whether one machine can serve a workload before you design a cluster.',
          ],
          keyTerms: ['queries per second', 'peak factor', 'bandwidth', 'latency numbers', 'capacity planning'],
          links: [
            { label: 'ByteByteGo on YouTube', url: 'https://www.youtube.com/@ByteByteGo', kind: 'video' },
            { label: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', kind: 'repo' },
            { label: 'Hussein Nasser on YouTube', url: 'https://www.youtube.com/@hnasr', kind: 'video' },
            { label: 'Google SRE Book: Software Engineering in SRE', url: 'https://sre.google/sre-book/table-of-contents/', kind: 'docs' },
          ],
          body: `
## What this lesson covers

Capacity planning starts with a few reference numbers and a lot of multiplication. This lesson gives you the numbers and a procedure to turn a user count into queries per second (QPS), bandwidth, and storage. You use the procedure in every later lesson.

## Why it matters

A design review always asks the same question: how big is the load? If the answer is 2,000 QPS, one server with a database serves it. If the answer is 200,000 QPS, you need partitioning, caches, and queues. The estimate decides the architecture. A wrong estimate by a factor of 100 produces a design that is either too costly or too small.

## The idea with an example

A photo sharing service has 10 million daily active users. Each user makes 20 requests per day. Each request reads 10 kilobytes (KB) on average. Each user uploads 2 photos per day of 2 megabytes (MB) each.

Step 1, compute requests per day: 10,000,000 × 20 = 200,000,000 requests per day.

Step 2, compute average QPS. One day has 86,400 seconds. 200,000,000 / 86,400 = 2,315 QPS. Round to 2,300.

Step 3, apply a peak factor. Traffic is not flat. A common peak factor is 3. Peak QPS = 2,300 × 3 = 6,900. Round to 7,000.

Step 4, compute read bandwidth. 7,000 QPS × 10 KB = 70,000 KB per second = 70 MB per second. A 10 gigabit network link moves 1,250 MB per second. One machine handles this.

The bars compare the read bandwidth with the capacity of one link.

:::bars
title: Peak read bandwidth against one network link
unit: MB per second
Peak read bandwidth: 70
One 10 gigabit link: 1250
:::

Step 5, compute write storage. 10,000,000 users × 2 photos × 2 MB = 40 terabytes (TB) per day. After 1 year, 40 × 365 = 14,600 TB, about 15 petabytes (PB). This is the number that forces a design choice. Photos must go to object storage, not to a database.

Step 6, compute write QPS. 20,000,000 uploads per day / 86,400 = 231 uploads per second on average, about 700 at peak.

The read path fits on one machine. The storage does not. That is the result of the estimate.

Press Next to replay the six steps of the estimate.

:::scenario
title: Size the photo service step by step
state: requests per day=0, average QPS=0, peak QPS=0, read bandwidth=0, storage per year=0
step: Multiply 10 million users by 20 requests. The result is 200 million requests per day.
state: requests per day=200 million
step: Divide by 86,400 seconds. The average is 2,300 QPS.
state: average QPS=2300
step: Multiply by the peak factor of 3. The peak is 7,000 QPS.
state: peak QPS=7000
step: Multiply 7,000 QPS by 10 KB. The read bandwidth is 70 MB per second, far below one 10 gigabit link.
state: read bandwidth=70 MB per second
step: Multiply 10 million users by 2 photos by 2 MB by 365 days. The storage is about 15 PB per year.
state: storage per year=15 PB
step: Compare each number with one machine. The reads fit, and the storage does not.
:::

## How it works

Keep these reference numbers in memory. Each one is correct within a factor of 2.

| Operation | Approximate time |
|---|---|
| L1 cache reference | 1 nanosecond (ns) |
| Main memory reference | 100 ns |
| Compress 1 KB | 2 microseconds (us) |
| Solid-state drive (SSD) random read | 100 us |
| Read 1 MB from memory | 10 us |
| Read 1 MB from SSD | 1 millisecond (ms) |
| Round trip inside a datacenter | 500 us |
| Hard disk seek | 10 ms |
| Round trip across continents | 150 ms |

Also keep these conversions. One day is 86,400 seconds, close to 100,000. One month is 2.6 million seconds. One year is 31.5 million seconds.

The general procedure is:

1. Write down users, requests per user, and bytes per request.
2. Multiply to get requests per day and bytes per day.
3. Divide by 86,400 to get per-second rates.
4. Multiply by the peak factor, from 2 to 5 depending on the product.
5. Multiply bytes per day by the retention period to get storage.
6. Compare each result with the capacity of one machine.

The diagram shows how each number in the procedure feeds the next one.

:::flow
title: From users to machine count
Users -> Requests per day: times 20 per user
Requests per day -> Average QPS: divide by 86,400
Average QPS -> Peak QPS: times peak factor 3
Peak QPS -> Bandwidth: times 10 KB
Peak QPS -> Machines: divide by 10,000 per machine
:::

A machine capacity reference: a modern server handles about 10,000 to 50,000 simple requests per second. A single database handles about 5,000 to 20,000 writes per second. A 10 gigabit link moves 1,250 MB per second.

Note: round every number to one significant figure during the estimate. Precision does not help when inputs are guesses.

## Common mistakes

- Mistake: use the average QPS to size servers. Fix: size for peak QPS and leave a margin of 30 percent.
- Mistake: forget the unit. Fix: write MB or Mbit each time, because the two differ by a factor of 8.
- Mistake: count only reads. Fix: estimate writes and storage separately, because they often set the design.
- Mistake: estimate to three decimal places. Fix: round to one significant figure and state the assumptions.

## Check your understanding

- What is the average QPS for 1 million requests per day? About 12 QPS.
- How many seconds are in a day? 86,400, close to 100,000.
- A service stores 100 MB per second. How much per day? About 8.6 TB.

## Go further

The /labs/capacity lab does this arithmetic for you and lets you change each input. ByteByteGo and Hussein Nasser cover estimation for many well-known systems on YouTube. The System Design Primer repository has a long list of worked estimates. The Google SRE book explains how production teams plan capacity.
`,
        },
        {
          slug: 'latency-vs-throughput',
          title: 'Latency versus throughput',
          summary: 'Latency is the time for one request, throughput is requests per second, and you cannot read one from the other.',
          minutes: 12,
          objectives: [
            'Define latency and throughput and give the units of each.',
            'Compute the throughput of a server from its latency and its concurrency.',
            'Explain why batching raises throughput and raises latency at the same time.',
            'Read a percentile latency value and explain what it means.',
          ],
          keyTerms: ['latency', 'throughput', 'concurrency', 'batching', 'p99-latency', 'percentile'],
          links: [
            { label: 'Google SRE Book: Monitoring Distributed Systems', url: 'https://sre.google/sre-book/monitoring-distributed-systems/', kind: 'docs' },
            { label: 'Hussein Nasser on YouTube', url: 'https://www.youtube.com/@hnasr', kind: 'video' },
            { label: 'ByteByteGo on YouTube', url: 'https://www.youtube.com/@ByteByteGo', kind: 'video' },
            { label: 'HdrHistogram: high dynamic range histograms for latency', url: 'https://github.com/HdrHistogram/HdrHistogram', kind: 'repo' },
          ],
          body: `
## What this lesson covers

Latency is the time one request takes. Throughput is the number of requests a system completes per second. This lesson explains the difference, how concurrency links them, and why percentiles are the right way to report latency.

## Why it matters

A system can have low latency and low throughput, or high latency and high throughput. A user feels latency. A cost report shows throughput. A design that improves one often hurts the other. Batching in an LLM server is the clearest case: a bigger batch serves more tokens per second, and each user waits longer.

## The idea with an example

A server handles one request at a time. Each request takes 10 ms. The throughput is 1 request per 10 ms, or 100 requests per second.

Now the server handles 8 requests at the same time, each still in 10 ms. Throughput is 8 / 0.010 = 800 requests per second. Latency is still 10 ms.

Now add batching. The server waits until 8 requests arrive, then processes them together in 12 ms. Throughput is 8 / 0.012 = 667 requests per second per batch slot. But a request that arrives first waits for 7 others. At 100 requests per second, the wait for 7 more arrivals is 70 ms. Its latency is 70 + 12 = 82 ms. The last request in the batch has latency 12 ms.

The timeline shows the wait of the first and the last request in one batch.

:::timeline
title: One batch of 8 requests at 100 requests per second
unit: ms
lane Request 1
lane Request 8
lane Server
Request 1: wait for the batch to fill @0-70
Request 8: arrives @69-70
Request 1 -> Server: batch of 8 starts @70-70
Server: process the batch @70-82
Server -> Request 1: reply after 82 ms @82-82
Server -> Request 8: reply after 12 ms @82-82
:::

Measure latency with percentiles. Sort the latencies of 1,000 requests. The value at position 500 is the median, p50. The value at position 990 is p99. In the batched example, p50 is about 47 ms and p99 is close to 82 ms.

Press Next to replay the three settings of the server.

:::scenario
title: Throughput from latency and concurrency
state: concurrency=1, latency=10 ms, throughput=100 per second
step: One server handles one request at a time in 10 ms. Throughput is 100 requests per second.
step: The server now handles 8 requests at once, each still in 10 ms. Throughput rises to 800 per second.
state: concurrency=8, throughput=800 per second
step: The server now waits for 8 requests and processes them together in 12 ms.
state: latency=12 ms to 82 ms, throughput=667 per second
step: The first request waited 70 ms for 7 others. Its latency is 82 ms.
step: The last request waited 0 ms. Its latency is 12 ms. Throughput rose and latency rose at the same time.
:::

## How it works

The link between the three quantities is:

$$\\text{throughput} = \\frac{\\text{concurrency}}{\\text{latency}}$$

Here throughput is in requests per second, concurrency is the number of requests in progress at once, and latency is the time per request in seconds. This is one form of Little's law, which the next lesson covers in full.

The table lists the three settings from the example.

| Setting | Concurrency | Latency | Throughput |
|---|---|---|---|
| One at a time | 1 | 10 ms | 100 per second |
| 8 in parallel | 8 | 10 ms | 800 per second |
| Batch of 8 | 8 | 12 to 82 ms | 667 per second |

To raise throughput you have two options. Reduce latency, or raise concurrency. Concurrency is limited by cores, memory, and connections. Latency is limited by the slowest step in the request.

The bars compare the throughput of the three settings.

:::bars
title: Throughput of the three settings
unit: requests per second
One at a time: 100
8 in parallel: 800
Batch of 8: 667
:::

A percentile is a value below which a given fraction of samples fall. The procedure to compute p99 by hand is:

1. Collect N latency samples over a window, for example 1 minute.
2. Sort them from small to large.
3. Take the sample at position 0.99 × N, rounded up.

Report p50, p95, and p99. Never report the mean alone. One slow request of 5 seconds in 1,000 requests of 10 ms raises the mean by 5 ms and hides inside it. The p99 value shows it.

Caution: do not average percentiles across servers. The p99 of the whole fleet is not the mean of the p99 of each server. Merge the histograms, then take the percentile.

## Common mistakes

- Mistake: report the mean latency. Fix: report p50, p95, and p99, because the tail is where users notice.
- Mistake: raise the batch size to raise throughput without a latency budget. Fix: set a maximum wait time for a batch to fill.
- Mistake: assume throughput doubles when you double the cores. Fix: measure, because a shared lock or a database often limits concurrency.
- Mistake: measure latency on the server only. Fix: measure at the client, because the network and the queue in front of the server add time.

## Check your understanding

- A server runs 16 requests at once, each in 40 ms. What is the throughput? 400 requests per second.
- What does p99 = 300 ms mean? 99 percent of requests complete within 300 ms, and 1 percent take longer.
- Why does batching raise latency? Early requests wait for the batch to fill.

## Go further

The Google SRE book chapter on monitoring explains the four golden signals, including latency and traffic. Hussein Nasser explains request lifecycles and connection limits in depth. ByteByteGo has short visual explanations of throughput and latency trade-offs. HdrHistogram is the standard library to record latency percentiles without losing the tail.
`,
        },
        {
          slug: 'littles-law',
          title: "Little's law and queueing",
          summary: 'The number of requests in a system equals the arrival rate times the time each one spends inside.',
          minutes: 13,
          objectives: [
            "State Little's law and give the unit of each symbol.",
            'Compute the concurrency a service needs from its throughput and latency.',
            'Explain why latency rises sharply when utilisation nears 100 percent.',
            'Size a connection pool or a thread pool from measured numbers.',
          ],
          keyTerms: ["Little's law", 'arrival rate', 'utilisation', 'queue', 'connection pool'],
          links: [
            { label: "Little's law on Wikipedia", url: 'https://en.wikipedia.org/wiki/Little%27s_law', kind: 'article' },
            { label: 'Google SRE Book: Handling Overload', url: 'https://sre.google/sre-book/handling-overload/', kind: 'docs' },
            { label: 'MIT OpenCourseWare on YouTube', url: 'https://www.youtube.com/@MITOpenCourseWare', kind: 'video' },
            { label: 'Netflix concurrency-limits library', url: 'https://github.com/Netflix/concurrency-limits', kind: 'repo' },
          ],
          body: `
## What this lesson covers

Little's law is a one-line equation that links arrival rate, time in the system, and the number of items inside. This lesson shows how to use it to size thread pools, connection pools, and queues. It also explains why queues explode near full utilisation.

## Why it matters

Every service has a pool of some fixed size: database connections, worker threads, GPU batch slots. If the pool is too small, requests queue and latency climbs. If it is too large, memory runs out. Little's law gives the right size from two numbers you can measure. The same law explains why a server at 90 percent utilisation feels slow long before it is full.

## The idea with an example

A web service receives 1,000 requests per second. Each request spends 50 ms inside the service, including any wait. How many requests are inside at any moment?

$$L = \\lambda W = 1{,}000 \\times 0.050 = 50$$

Here $L$ is the number of requests inside, $\\lambda$ is the arrival rate in requests per second, and $W$ is the time each request spends inside in seconds. The answer is 50 requests. The service needs at least 50 concurrent slots, or the extra requests wait in a queue.

Now apply the law to the database. Each request makes one query that takes 5 ms. Queries arrive at 1,000 per second. $L = 1{,}000 \\times 0.005 = 5$. A connection pool of 5 is the minimum. A pool of 10 leaves room for slower queries.

Now the database slows to 20 ms per query under load. $L = 1{,}000 \\times 0.020 = 20$. A pool of 10 is now too small. Requests wait for a connection, $W$ rises, and $L$ rises again. This is the feedback loop behind most outages.

Press Next to follow the pool size through the example.

:::scenario
title: Size the connection pool with Little's law
state: arrival rate=1000 per second, query time=5 ms, L=0, pool=0
step: Queries arrive at 1,000 per second. Each query takes 5 ms. Compute L as 1,000 times 0.005.
state: L=5
step: L is 5. The pool needs at least 5 connections. Set the pool to 10 for a margin.
state: pool=10
step: The database slows to 20 ms per query under load. Compute L again.
state: query time=20 ms, L=20
step: L is now 20, but the pool has 10. Requests wait for a connection.
step: The wait raises W, and a higher W raises L again. This is the feedback loop behind the outage.
state: query time=rising, L=rising
:::

## How it works

Little's law holds for any stable system, with any arrival pattern, as long as the long-run averages exist. Stable means the arrival rate is below the service rate.

Utilisation is the fraction of time a server is busy:

$$\\rho = \\frac{\\lambda}{\\mu}$$

Here $\\rho$ is utilisation, $\\lambda$ is the arrival rate, and $\\mu$ is the service rate, the maximum requests per second the server completes. For a single server with random arrivals and random service times, the average time in the system is:

$$W = \\frac{1}{\\mu - \\lambda} = \\frac{1}{\\mu (1 - \\rho)}$$

Take a server with $\\mu = 1{,}000$ requests per second, so the service time is 1 ms.

| Utilisation | Arrival rate | Average time in system |
|---|---|---|
| 50 percent | 500 per second | 2 ms |
| 80 percent | 800 per second | 5 ms |
| 90 percent | 900 per second | 10 ms |
| 99 percent | 990 per second | 100 ms |

Latency doubles from 50 to 80 percent and then grows 10 times from 90 to 99 percent. This is why teams keep utilisation at 60 to 70 percent.

The bars show the same growth of the time in the system.

:::bars
title: Average time in system by utilisation
unit: ms
50 percent: 2
80 percent: 5
90 percent: 10
99 percent: 100
:::

The timeline shows how a wait forms when three queries share one connection.

:::timeline
title: Three queries share one connection of 5 ms each
unit: ms
lane Query 1
lane Query 2
lane Query 3
lane Connection
Query 1 -> Connection: take the connection @0-0.2
Connection: run query 1 @0.2-5
Query 2: wait for a connection @1-5
Connection: run query 2 @5-10
Query 3: wait for a connection @2-10
Connection: run query 3 @10-15
Connection -> Query 3: reply after 13 ms inside @15-15.2
:::

The sizing procedure is:

1. Measure the arrival rate $\\lambda$ at peak.
2. Measure the time $W$ per item at peak, including waits.
3. Compute $L = \\lambda W$.
4. Set the pool size to $L$ plus a margin of 50 percent.
5. Set a queue limit, and reject requests above it, so $W$ cannot grow without bound.

## Common mistakes

- Mistake: size a pool from the average arrival rate. Fix: use the peak rate, because the queue forms at peak.
- Mistake: run servers at 95 percent utilisation to save money. Fix: keep 30 percent headroom, because latency grows without limit near 100 percent.
- Mistake: let the queue grow without limit. Fix: bound the queue, because a long queue only delays the failure.
- Mistake: measure service time without the wait time. Fix: measure the full time inside, from arrival to departure.

## Check your understanding

- A queue receives 200 items per second and each item waits 2 seconds. How many items are in the queue? 400.
- A server completes 500 requests per second and receives 450. What is its utilisation? 90 percent.
- Why does latency grow so fast near full utilisation? The wait time scales with 1 / (1 - utilisation), which goes to infinity at 100 percent.

## Go further

The Wikipedia article gives the proof and the history of Little's law. The Google SRE book chapter on overload shows how to turn the law into admission limits. The Netflix concurrency-limits library measures latency and adjusts the concurrency limit at run time. MIT OpenCourseWare has full queueing theory lectures for the mathematics. The /labs/capacity lab uses these formulas.
`,
        },
        {
          slug: 'slos-and-error-budgets',
          title: 'Service level objectives and error budgets',
          summary: 'A service level objective is a target for a measured indicator, and the error budget is what you may spend.',
          minutes: 13,
          objectives: [
            'Distinguish a service level indicator, objective, and agreement.',
            'Compute the allowed downtime per month for a given availability target.',
            'Compute an error budget in failed requests and decide when to stop releases.',
            'Choose a latency SLO from percentile data.',
          ],
          keyTerms: ['service level indicator', 'service level objective', 'service level agreement', 'error budget', 'availability', 'p99-latency'],
          links: [
            { label: 'Google SRE Book: Service Level Objectives', url: 'https://sre.google/sre-book/service-level-objectives/', kind: 'docs' },
            { label: 'Google SRE Workbook: Implementing SLOs', url: 'https://sre.google/workbook/implementing-slos/', kind: 'docs' },
            { label: 'Google SRE Book: Embracing Risk', url: 'https://sre.google/sre-book/embracing-risk/', kind: 'docs' },
            { label: 'ByteByteGo on YouTube', url: 'https://www.youtube.com/@ByteByteGo', kind: 'video' },
          ],
          body: `
## What this lesson covers

A service level indicator (SLI) is a measured number, such as the fraction of successful requests. A service level objective (SLO) is a target for that number. An error budget is the gap between 100 percent and the SLO. This lesson shows how to set them and how to use the budget.

## Why it matters

Without a target, every outage becomes an argument. With an SLO, the team knows when to stop releases and fix reliability. The error budget also stops the opposite problem: a team that spends months on reliability a user never notices. Most on-call alerts in mature teams fire on SLO burn rate, not on raw errors.

## The idea with an example

An API serves 10 million requests per month. The team sets an availability SLO of 99.9 percent of requests successful.

Step 1, compute the error budget in requests. 100 percent - 99.9 percent = 0.1 percent. 0.1 percent of 10,000,000 is 10,000 failed requests per month.

Step 2, compute the budget in time. A month has 43,200 minutes. 0.1 percent of that is 43.2 minutes of full downtime.

Step 3, track the spend. In week 1, a bad deploy fails 4,000 requests. In week 2, a database failover fails 3,000. The team has spent 7,000 of 10,000, with 2 weeks left.

Step 4, apply the policy. The policy says: if less than 30 percent of the budget remains, freeze feature releases and work on reliability. 3,000 remain, which is 30 percent. The team freezes releases until the next month.

Press Next to follow the budget through the month.

:::scenario
title: Spend the error budget over one month
state: budget=10000 failed requests, spent=0, remaining=10000, releases=open
step: The SLO is 99.9 percent of 10 million requests. The budget is 0.1 percent, 10,000 failed requests.
step: In week 1 a bad deploy fails 4,000 requests.
state: spent=4000, remaining=6000
step: In week 2 a database failover fails 3,000 requests.
state: spent=7000, remaining=3000
step: 30 percent of the budget remains. The policy says freeze releases at 30 percent or less.
state: releases=frozen
step: The team works on reliability until the next month resets the budget.
state: spent=0, remaining=10000, releases=open
:::

Now compare targets:

| Availability | Downtime per month | Downtime per year |
|---|---|---|
| 99 percent | 7.2 hours | 3.65 days |
| 99.9 percent | 43 minutes | 8.8 hours |
| 99.99 percent | 4.3 minutes | 53 minutes |
| 99.999 percent | 26 seconds | 5.3 minutes |

Each extra nine costs about 10 times more engineering. 99.99 percent means a human cannot be in the recovery path, because paging and logging in takes longer than 4 minutes.

The bars show the allowed downtime per month in minutes for each target.

:::bars
title: Allowed downtime per month
unit: minutes
99 percent: 432
99.9 percent: 43
99.99 percent: 4.3
99.999 percent: 0.43
:::

## How it works

Good SLIs are ratios of good events to total events, measured where the user is:

- Availability: successful requests / total requests.
- Latency: requests faster than a threshold / total requests.
- Freshness: reads that return data younger than a threshold / total reads.

A latency SLO has the form "99 percent of requests complete within 300 ms over 30 days". Pick the threshold from measured percentiles. If p99 today is 250 ms, set the SLO at 300 ms, not at 100 ms. A target you already miss is not a target.

The procedure to set an SLO is:

1. Pick the user action that matters, for example "load the feed".
2. Define the SLI as a ratio with a clear success rule.
3. Measure the SLI for 4 weeks.
4. Set the SLO slightly below the measured value.
5. Write the error budget policy: what happens when the budget runs low.
6. Review the SLO every quarter.

A service level agreement (SLA) is a contract with a customer, with a penalty. Set the SLA looser than the SLO, so you breach the internal target before you breach the contract.

Burn rate is the speed of budget use. A burn rate of 1 uses the full budget in exactly one window. A burn rate of 14.4 uses a 30-day budget in 2 days, and that is a common page threshold.

The diagram shows how the indicator, the objective, the budget, and the policy connect.

:::flow
title: From a user action to a release decision
User action -> SLI: measure good over total
SLI -> SLO: set the target
SLO -> Error budget: 100 percent minus SLO
Error budget -> Burn rate: spend per window
Burn rate -> Page: above 14.4
Error budget -> Release policy: freeze below 30 percent
:::

Note: a dependency with a 99.9 percent SLO caps your own SLO at 99.9 percent unless you add a fallback.

## Common mistakes

- Mistake: set the SLO at 100 percent. Fix: pick a target below 100, because no system is perfect and the budget enables change.
- Mistake: measure the SLI inside the server. Fix: measure at the load balancer or the client, where the user is.
- Mistake: alert on every error. Fix: alert on burn rate, because a few errors are inside the budget.
- Mistake: set the SLA equal to the SLO. Fix: keep the SLA looser, so you have time to react.

## Check your understanding

- How many minutes of downtime per month does 99.95 percent allow? About 21.6 minutes.
- What is an error budget? The amount of failure the SLO allows in a window, such as 10,000 failed requests.
- Why set the SLO below the measured value? A target you already miss gives no useful signal.

## Go further

The Google SRE book chapter on service level objectives is the origin of these terms. The SRE workbook chapter on implementing SLOs walks through the procedure with real examples. The chapter on embracing risk explains why 100 percent is the wrong target. ByteByteGo has short overviews of SLI, SLO, and SLA.
`,
        },
        {
          slug: 'consistency-models',
          title: 'Consistency models',
          summary: 'A consistency model states which values a read may return after concurrent writes on several replicas.',
          minutes: 16,
          objectives: [
            'Define linearizable, sequential, causal, and eventual consistency.',
            'Decide whether a given history of reads and writes is allowed under each model.',
            'Explain the trade-off between consistency and availability during a network partition.',
            'Match each model to a database that provides it.',
          ],
          keyTerms: ['consistency model', 'linearizability', 'causal consistency', 'eventual consistency', 'cap-theorem', 'replica'],
          links: [
            { label: 'Jepsen: Consistency Models', url: 'https://jepsen.io/consistency', kind: 'docs' },
            { label: 'Jepsen analyses of real databases', url: 'https://jepsen.io/analyses', kind: 'article' },
            { label: 'A Critique of the CAP Theorem (Kleppmann)', url: 'https://arxiv.org/abs/1509.05393', kind: 'paper' },
            { label: 'Strong consistency models (Aphyr)', url: 'https://aphyr.com/posts/313-strong-consistency-models', kind: 'article' },
            { label: 'MIT 6.824 Distributed Systems', url: 'https://pdos.csail.mit.edu/6.824/', kind: 'course' },
          ],
          body: `
## What this lesson covers

When data lives on several replicas, two clients can read different values at the same moment. A consistency model is the rule for which values a read may return. This lesson defines the four models you meet most often, from strongest to weakest.

## Why it matters

A bank balance needs the strongest model. A like count can accept the weakest. The strong model costs a network round trip per operation and stops working during a network partition. The weak model is fast and always available but shows stale data. If you pick the wrong model, you get either a slow product or a wrong one.

## The idea with an example

A key-value store has 3 replicas: A, B, and C. The key "balance" starts at 100.

At time 1, client 1 writes balance = 50 to replica A. At time 2, replica A acknowledges. At time 3, client 2 reads balance from replica B.

The timeline shows the write, the acknowledgement, and the read on the two replicas.

:::timeline
title: Write on replica A, read on replica B
unit: ms
lane Client 1
lane Replica A
lane Replica B
lane Client 2
Client 1 -> Replica A: write balance 50 @1-1.5
Replica A: apply the write @1.5-2
Replica A -> Client 1: acknowledge @2-2.5
Replica A -> Replica B: replicate @2-3.5
Client 2 -> Replica B: read balance @3-3.2
Replica B -> Client 2: 100 or 50 depends on the model @3.2-3.5
:::

Under each model, what may client 2 see?

- Linearizable: client 2 must see 50. The write finished at time 2, and every later read sees it.
- Sequential: client 2 may see 100 or 50, as long as all clients agree on one order of operations. Client 2 could see 100 now and 50 later, but never 50 then 100.
- Causal: the same as sequential here, because nothing links the two clients. If client 2 had sent a message to client 1 that caused the write, client 2 must see 50.
- Eventual: client 2 may see 100 for seconds or minutes. If writes stop, all replicas converge to 50.

Press Next to see what client 2 may read under each model.

:::scenario
title: What client 2 may see under each model
state: balance on A=50, balance on B=100 or 50, model=none, client 2 sees=unknown
step: Client 1 wrote 50 to replica A and got an acknowledgement at time 2. Client 2 reads from replica B at time 3.
step: Under linearizability the write completed before the read started. Client 2 must see 50.
state: model=linearizable, client 2 sees=50
step: Under sequential consistency client 2 may see 100 or 50. It may never see 50 and then 100.
state: model=sequential, client 2 sees=100 or 50
step: Under causal consistency nothing links the two clients. Client 2 may see 100 or 50.
state: model=causal, client 2 sees=100 or 50
step: Under eventual consistency client 2 may see 100 for minutes. If writes stop, every replica ends at 50.
state: model=eventual, client 2 sees=100 for a while then 50
:::

Now add a network partition. Replica C cannot reach A or B. A client writes to C. Under linearizability, C must refuse the write, because it cannot know the latest value. Under eventual consistency, C accepts the write and merges it later.

## How it works

Linearizability means every operation appears to happen at one instant between its start and its end, and all clients see the same order. It is the model a single-machine variable gives you. Systems provide it with a leader and a consensus protocol such as Raft, which the replication module covers.

Sequential consistency drops the real-time rule. Operations from one client keep their order. All clients see the same total order. A read may be stale.

Causal consistency keeps only the order between operations that depend on each other. A reply never appears before the message it answers. Independent operations may appear in different orders on different replicas.

Eventual consistency promises only convergence. If writes stop, all replicas end with the same value. It gives no rule for what a single read returns.

The CAP theorem states the cost. During a network partition, a system must choose. It can stay consistent, by refusing some operations. It can stay available, by answering with possibly stale data. It cannot do both. The theorem says nothing about normal operation, where the trade-off is latency instead.

The procedure to pick a model is:

1. List the operations where a stale read causes a wrong decision, such as a payment or a unique username.
2. Give those operations linearizability.
3. For everything else, use causal or eventual consistency with a cache.
4. Check the database documentation for the default setting, because many default to a weak model.

| Model | Example system |
|---|---|
| Linearizable | etcd, ZooKeeper, Spanner, a single Postgres primary |
| Sequential | Some Raft-based systems with follower reads |
| Causal | MongoDB causal sessions, Cosmos DB session level |
| Eventual | DNS, Cassandra at consistency level ONE, S3 before 2020 |

Jepsen tests real databases against these models by injecting partitions and clock skew. Many databases fail their own documented claims.

## Common mistakes

- Mistake: assume a database is linearizable because it has a leader. Fix: read the Jepsen report, because follower reads and failover often break the guarantee.
- Mistake: use eventual consistency for a uniqueness check. Fix: route uniqueness checks to a linearizable store.
- Mistake: believe CAP forces a choice at all times. Fix: the choice applies only during a partition; in normal operation you trade latency.
- Mistake: test consistency on one machine. Fix: test with real replicas and injected partitions.

## Check your understanding

- Under linearizability, can a read return a value older than a completed write? No.
- What does eventual consistency guarantee about a single read? Nothing, only that replicas converge once writes stop.
- During a partition, what does a linearizable system do with a write on the isolated side? It refuses the write.

## Go further

The Jepsen consistency page maps all the models and their relations in one diagram. The Jepsen analyses show which real databases break which guarantees. Kleppmann's critique of CAP explains what the theorem does and does not say. The Aphyr post on strong consistency models is a clear long-form tutorial. MIT 6.824 has lectures and labs on linearizability.
`,
        },
      ],
    },
    {
      slug: 'storage',
      title: 'Storage',
      description: 'Relational and key-value models, indexes, log-structured trees, and the write-ahead log.',
      lessons: [
        {
          slug: 'relational-vs-key-value',
          title: 'Relational versus key-value storage',
          summary: 'A relational store joins rows by key, and a key-value store returns one value per key with no joins.',
          minutes: 13,
          objectives: [
            'Describe the data model of a relational store and of a key-value store.',
            'Compute the cost of a join query and of a key lookup in disk reads.',
            'Choose a store for a given access pattern.',
            'Explain what a transaction guarantees and what a key-value store drops.',
          ],
          keyTerms: ['relational model', 'key-value store', 'join', 'transaction', 'access pattern', 'schema'],
          links: [
            { label: 'PostgreSQL documentation', url: 'https://www.postgresql.org/docs/current/', kind: 'docs' },
            { label: 'Redis documentation', url: 'https://redis.io/docs/latest/', kind: 'docs' },
            { label: 'Dynamo: Amazon’s Highly Available Key-value Store', url: 'https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf', kind: 'paper' },
            { label: 'Apache Cassandra documentation', url: 'https://cassandra.apache.org/doc/latest/', kind: 'docs' },
            { label: 'Hussein Nasser on YouTube', url: 'https://www.youtube.com/@hnasr', kind: 'video' },
          ],
          body: `
## What this lesson covers

A relational store keeps data in tables with rows and columns, and a query can join tables by a shared key. A key-value store keeps one value per key and returns it in one lookup. This lesson compares the two with a small social network example.

## Why it matters

The choice of store sets what queries are cheap. A relational store makes new queries cheap to write but some of them slow to run. A key-value store makes every lookup fast but makes new query types costly, because you must store the data again in a new shape. Most large systems use both.

## The idea with an example

A social network has 3 tables: users, posts, and follows. There are 1,000 users. Each user has 100 posts and follows 50 others.

Query 1: show the 10 newest posts by user 42. In a relational store with an index on (user_id, created_at), this is one index lookup and 10 row reads. About 11 disk reads, 1 ms on an SSD.

Query 2: show the 10 newest posts from everyone user 42 follows. The relational store reads the 50 follow rows, then for each one reads the newest posts, then merges. That is 50 index lookups and up to 500 row reads. About 550 disk reads, 55 ms. With 10 million users and a hot path, this is too slow.

Now the key-value version. The key is "feed:42". The value is a list of the 10 newest post ids from followed users. Query 2 is one lookup, 100 us from memory.

The bars compare the latency of the three lookups.

:::bars
title: Latency of the feed query
unit: ms
Relational, posts by one user: 1
Relational, feed of 50 followed users: 55
Key-value, precomputed feed: 0.1
:::

But the value must be maintained. When user 7 posts, the system must append the post id to "feed:" for each of the followers of user 7. If user 7 has 200 followers, that is 200 writes per post. The relational store did zero extra work at write time.

The diagram shows the work that one post causes at write time.

:::flow
title: Key-value feed, the cost moves to write time
User 7 -> Posts table: new post
Posts table -> Fan-out worker: post id
Fan-out worker -> Follows table: who follows user 7
Follows table -> Fan-out worker: 200 followers
Fan-out worker -> Feed keys: 200 appends
Feed keys -> Reader: one lookup for feed 42
:::

The key-value store moved the cost from read time to write time. This is the core trade.

Press Next to run the same feed query in both stores.

:::scenario
title: The same feed query in two stores
state: store=relational, disk reads=0, latency=0
step: Query 1 asks for the 10 newest posts of user 42. The index gives 1 lookup and 10 row reads.
state: disk reads=11, latency=1 ms
step: Query 2 asks for the 10 newest posts from the 50 users that user 42 follows. The store reads 50 follow rows and up to 500 posts.
state: disk reads=550, latency=55 ms
step: Now switch to a key-value store. The key feed:42 holds the 10 newest post ids.
state: store=key-value, disk reads=0, latency=0.1 ms
step: User 7 posts. The store must append the post id to the feed key of each of 200 followers.
state: writes per post=200
step: The read became cheap and the write became costly. This is the core trade.
:::

## How it works

The relational model has a schema: a fixed set of tables and column types. A query language, SQL, describes what to fetch. The database plans how to fetch it, using indexes. A transaction groups several writes so that all of them happen or none of them does. The database also keeps the writes isolated from each other and durable after a crash.

The key-value model has no schema and no joins. The operations are get(key), put(key, value), and delete(key). Some stores add ordered scans over keys, sets, lists, and counters. Redis keeps the data in memory. Cassandra and DynamoDB keep it on many disks with partitioning by key.

The procedure to pick a store is:

1. List every query the product needs, with its expected rate.
2. For each query, write the key you would need to answer it in one lookup.
3. If a few keys cover all high-rate queries, a key-value store fits.
4. If queries are many, change often, or need joins and transactions, start with a relational store.
5. Add a key-value store as a cache or a feed later, when a query becomes hot.

Key-value stores scale writes by partitioning, because each key lives on one node. Relational stores scale reads with replicas but scale writes only by sharding, which the partitioning module covers.

| Property | Relational | Key-value |
|---|---|---|
| Joins | Yes | No |
| Transactions across keys | Yes | Usually no |
| Write scaling | Hard | Easy by key |
| New query types | Cheap | Costly |
| Typical latency | 1 to 10 ms | 0.1 to 1 ms |

Note: a relational store with one table and lookups by primary key behaves like a key-value store. The models overlap.

## Common mistakes

- Mistake: pick a key-value store before you know the queries. Fix: list the queries first, because the key design must match them.
- Mistake: run a join across services with a loop of key lookups. Fix: precompute the joined value, or use a relational store.
- Mistake: assume a key-value store gives transactions across keys. Fix: read the documentation, because most give atomicity for one key only.
- Mistake: store a 10 MB value under one key. Fix: split large values, because one hot key limits throughput.

## Check your understanding

- What is a join? A query that combines rows from two tables that share a key.
- Why is a feed lookup fast in a key-value store? The feed is precomputed and stored under one key.
- What cost does the key-value feed add? One write per follower each time someone posts.

## Go further

The PostgreSQL documentation is the reference for the relational model and SQL. The Redis documentation shows the key-value operations and data types. The Dynamo paper from Amazon is the origin of modern partitioned key-value stores. The Cassandra documentation explains data modelling by query. Hussein Nasser compares databases in depth on YouTube.
`,
        },
        {
          slug: 'indexes-and-b-trees',
          title: 'Indexes and B-trees',
          summary: 'An index is a sorted structure that finds a row in a few disk reads instead of a full scan.',
          minutes: 14,
          objectives: [
            'Compute the number of disk reads for a B-tree lookup from its fan-out and row count.',
            'Explain why every index slows writes.',
            'Choose a composite index column order for a given query.',
            'Explain when a full scan is faster than an index.',
          ],
          keyTerms: ['index', 'B-tree', 'fan-out', 'page', 'composite index', 'full scan'],
          links: [
            { label: 'PostgreSQL documentation: Indexes', url: 'https://www.postgresql.org/docs/current/indexes.html', kind: 'docs' },
            { label: 'SQLite documentation: Query Planning', url: 'https://www.sqlite.org/queryplanner.html', kind: 'docs' },
            { label: 'Use The Index, Luke (free SQL indexing book)', url: 'https://use-the-index-luke.com/', kind: 'article' },
            { label: 'Hussein Nasser on YouTube', url: 'https://www.youtube.com/@hnasr', kind: 'video' },
          ],
          body: `
## What this lesson covers

An index is a separate structure that maps a column value to the location of a row. The most common index is the B-tree. This lesson shows how a B-tree finds a row in 3 or 4 disk reads among 100 million rows. It also shows what each index costs on writes.

## Why it matters

A query without an index reads every row. On 100 million rows that is minutes. With an index it is a millisecond. Most slow database problems in production are a missing index or an index in the wrong column order. Most slow write problems are too many indexes.

## The idea with an example

A table has 100 million orders. Each row is 200 bytes. The database stores rows in pages of 8 KB, so one page holds 40 rows. The table has 2.5 million pages, or 20 gigabytes (GB).

A query asks for the order with id 73,000,000. Without an index, the database scans pages until it finds the row. On average it reads half the table, 1.25 million pages. At 1 ms per page on an SSD, that is 1,250 seconds.

Now build a B-tree index on order id. An index page holds pairs of (id, page pointer). Each pair is about 16 bytes, so one 8 KB page holds about 500 pairs. The fan-out is 500.

The tree has levels. The bottom level has 100,000,000 / 500 = 200,000 pages. The level above has 200,000 / 500 = 400 pages. The level above that has 1 page, the root. So the tree has 3 levels.

Press Next to build the index level by level.

:::scenario
title: Build the index level by level
state: keys=100 million, fan-out=500, levels=0, reads per lookup=1.25 million pages
step: Without an index the database reads half of 2.5 million pages. That is 1,250 seconds.
step: One 8 KB index page holds 500 pairs of id and pointer. The fan-out is 500.
step: The bottom level needs 100 million divided by 500, which is 200,000 pages.
state: levels=1, bottom level=200000 pages
step: The next level needs 200,000 divided by 500, which is 400 pages.
state: levels=2, level 2=400 pages
step: 400 pointers fit in one root page. The tree has 3 levels.
state: levels=3, root=1 page
step: A lookup reads the root, a level 2 page, a leaf, then the row page. That is 4 reads, or 2 reads with the top levels in memory.
state: reads per lookup=4 pages
:::

A lookup reads the root, one page on level 2, one page on level 3, then the row page. That is 4 reads, 4 ms. The root and level 2 are small enough to stay in memory, so the real cost is 2 reads, 2 ms. The index turned 1,250 seconds into 2 ms.

The diagram shows the path of one lookup through the tree.

:::flow
title: Lookup of order id 73,000,000 in a 3-level B-tree
Query -> Root page: id 73,000,000
Root page -> Level 2 page: pointer, 1 of 400
Level 2 page -> Leaf page: pointer, 1 of 200,000
Leaf page -> Row page: page pointer
Row page -> Query: the order row
:::

## How it works

A B-tree keeps keys in sorted order inside pages. Each page has up to $f$ children, where $f$ is the fan-out. The height of the tree is:

$$h = \\lceil \\log_f N \\rceil$$

Here $h$ is the number of levels, $N$ is the number of keys, and $f$ is the fan-out. With $f = 500$ and $N = 10^8$, $h = 3$. With $N = 10^{11}$, $h = 4$. The height grows very slowly, which is the whole point.

The table gives the height for several key counts at fan-out 500.

| Keys | Levels at fan-out 500 | Reads per lookup with the row page |
|---|---|---|
| 250,000 | 2 | 3 |
| 100 million | 3 | 4 |
| 100 billion | 4 | 5 |

A lookup procedure by hand is:

1. Read the root page.
2. Find the first key larger than the search key. Follow the pointer to the left of it.
3. Repeat at each level until a leaf page.
4. In the leaf, find the key and follow the pointer to the row.

An insert adds the key to the right leaf. If the leaf is full, the tree splits it into two and adds a key to the parent. Splits keep every leaf at the same depth.

Every index costs writes. One insert into a table with 5 indexes writes 1 row page and 5 index pages. A table with 20 indexes writes 21 pages per insert.

The bars compare the pages written per insert.

:::bars
title: Pages written per insert
unit: pages
No index: 1
5 indexes: 6
20 indexes: 21
:::

A composite index covers several columns in order, for example (customer_id, created_at). The index is sorted by customer first, then by date within a customer. The query "orders for customer 42 in March" uses both columns. The query "all orders in March" cannot use the index, because March orders are spread across all customers. Put the equality column first and the range column second.

A full scan is faster when the query returns a large fraction of the table. If a query returns 30 percent of rows, the index lookup reads 30 percent of pages in random order. A scan reads 100 percent in sequential order. Sequential reads are about 10 times faster on an SSD and 100 times faster on a hard disk. Databases pick the plan from statistics.

Note: a covering index holds every column the query needs. The database then never reads the row page at all.

## Common mistakes

- Mistake: add an index on every column. Fix: index the columns in your slowest queries only, because each index slows every write.
- Mistake: put the range column first in a composite index. Fix: put the equality column first.
- Mistake: index a column with 2 distinct values. Fix: skip it, because the index returns half the table and a scan is faster.
- Mistake: trust that a query uses an index. Fix: run EXPLAIN and read the plan.

## Check your understanding

- How many levels does a B-tree need for 1 billion keys with fan-out 1,000? 3 levels.
- Why does an index slow inserts? Each insert must also write one page per index.
- Which column goes first in an index for "where user = 7 and date > X"? The user column.

## Go further

The PostgreSQL documentation on indexes lists the index types and when to use each. The SQLite query planner page explains how a planner chooses between a scan and an index. Use The Index, Luke is a free book about indexing for developers. Hussein Nasser has detailed videos on B-trees and database pages.
`,
        },
        {
          slug: 'lsm-trees',
          title: 'Log-structured merge trees',
          summary: 'An LSM tree writes sorted runs in sequence and merges them later, so writes are fast and reads check several levels.',
          minutes: 15,
          objectives: [
            'Explain how an LSM tree turns random writes into sequential writes.',
            'Compute write amplification and read cost for a given level layout.',
            'Explain what a Bloom filter does for an LSM read.',
            'Decide between a B-tree and an LSM tree for a given workload.',
          ],
          keyTerms: ['lsm-tree', 'memtable', 'SSTable', 'compaction', 'write amplification', 'Bloom filter'],
          links: [
            { label: 'RocksDB wiki', url: 'https://github.com/facebook/rocksdb/wiki', kind: 'docs' },
            { label: 'LevelDB', url: 'https://github.com/google/leveldb', kind: 'repo' },
            { label: 'Apache Cassandra documentation', url: 'https://cassandra.apache.org/doc/latest/', kind: 'docs' },
            { label: 'Hussein Nasser on YouTube', url: 'https://www.youtube.com/@hnasr', kind: 'video' },
          ],
          body: `
## What this lesson covers

A log-structured merge (LSM) tree is a storage structure built for heavy writes. It collects writes in memory, flushes them as sorted files, and merges those files in the background. This lesson walks through a write, a read, and a compaction with real sizes.

## Why it matters

RocksDB, LevelDB, Cassandra, HBase, and most time-series databases use LSM trees. A B-tree updates a page in place, which is a random write. An SSD does about 10,000 random writes per second but 500 MB per second of sequential writes. An LSM tree turns every write into a sequential write, so one disk ingests 10 times more. The price is slower reads and background work.

## The idea with an example

A key-value store receives 50,000 writes per second. Each write is 100 bytes, so 5 MB per second.

Step 1, the write goes to the memtable. The memtable is a sorted structure in memory, for example a skip list. The write also goes to a write-ahead log on disk for safety. The write returns after about 50 us.

Step 2, the memtable reaches 64 MB after 13 seconds. The store freezes it and writes it to disk as one sorted file, a sorted string table (SSTable). This is a sequential write of 64 MB, about 0.1 second.

Step 3, after 10 flushes, level 0 holds 10 SSTables with overlapping key ranges. A read must check all 10. The store runs a compaction. It reads the 10 files, merges them into sorted order, and writes new files into level 1. Level 1 files do not overlap, and level 1 holds up to 640 MB.

Step 4, level 1 fills. Compaction merges it into level 2, which holds 6.4 GB. Each level is 10 times larger than the one above.

The diagram shows the path of one write from the client to the lower levels.

:::flow
title: Path of one write through an LSM tree
Client -> WAL: append 100 bytes
Client -> Memtable: insert in sorted order
Memtable -> Level 0: flush a 64 MB SSTable
Level 0 -> Level 1: compact 10 files
Level 1 -> Level 2: compact when 640 MB is full
:::

Now a read for key "user:42". The store checks the memtable. Not there. It checks each level 0 file. Each file has a Bloom filter, a small bit array that says "definitely not here" or "maybe here". The filters reject 9 of 10 files. It reads one file, finds nothing, and moves to level 1. One file covers that key range. The Bloom filter says maybe. It reads the file block and finds the value. Total: 2 disk reads.

Press Next to follow the read through the levels.

:::scenario
title: Read the key user:42 through the levels
state: place=memtable, files checked=0, disk reads=0, found=no
step: Check the memtable in memory. The key is not there.
state: place=level 0
step: Level 0 has 10 files. Ask each Bloom filter. Nine say definitely not here.
state: files checked=10
step: One filter says maybe. Read that file block. The key is not there, a false positive.
state: disk reads=1
step: Move to level 1. One file covers the key range. Its filter says maybe.
state: place=level 1
step: Read the block and find the value. The read cost 2 disk reads in total.
state: disk reads=2, found=yes
:::

## How it works

The levels form a geometric series. With a size ratio $T$ between levels and $L$ levels, the total capacity is about $T^L$ times the first level. With $T = 10$ and a 64 MB memtable, 5 levels hold 640 GB.

Write amplification is the number of bytes written to disk per byte written by the user. Each byte moves through every level once, and each compaction rewrites the level it merges into. The amplification is about $T \\times L / 2$ for levelled compaction. With $T = 10$ and $L = 5$, that is about 25. So 5 MB per second of user writes causes 125 MB per second of disk writes. That is still far below the sequential limit.

The bars compare the user write rate, the disk write rate, and the disk limit.

:::bars
title: Write rates with amplification of 25
unit: MB per second
User writes: 5
Disk writes after amplification: 125
SSD sequential limit: 500
:::

Read cost is one Bloom filter check per file plus a few disk reads. A read for a key that does not exist checks every level. Bloom filters with 10 bits per key give a false positive rate of about 1 percent.

The procedure to size an LSM store is:

1. Measure the write rate in bytes per second.
2. Multiply by the write amplification to get the disk write rate.
3. Confirm the disk write rate is below half of the disk sequential limit.
4. Measure the read rate and confirm the Bloom filters fit in memory.

| Workload | Better choice |
|---|---|
| Write heavy, time-series, logs | LSM tree |
| Read heavy, many range scans | B-tree |
| Mixed, small dataset in memory | Either |

Caution: a deleted key becomes a tombstone marker. The key still costs space until compaction reaches the bottom level, which can take days.

## Common mistakes

- Mistake: turn off the write-ahead log for speed. Fix: keep it, because the memtable is lost on a crash.
- Mistake: ignore compaction load. Fix: measure disk writes, because compaction can consume the whole disk bandwidth.
- Mistake: assume reads are as fast as a B-tree. Fix: budget 2 to 5 disk reads for a cold read.
- Mistake: delete a large key range and expect space back at once. Fix: wait for compaction or trigger a manual one.

## Check your understanding

- What makes LSM writes fast? Writes go to memory and then to disk in sequential sorted files.
- What does a Bloom filter answer? Whether a key is definitely absent from a file.
- What is write amplification of 25? Each user byte causes 25 bytes of disk writes over its lifetime.

## Go further

The RocksDB wiki describes levelled and tiered compaction, Bloom filters, and tuning. The LevelDB repository is small enough to read in a weekend. The Cassandra documentation shows the same design in a distributed database. Hussein Nasser explains LSM trees against B-trees on YouTube.
`,
        },
        {
          slug: 'write-ahead-log',
          title: 'The write-ahead log',
          summary: 'A database writes each change to a sequential log before it changes the data pages, so a crash loses nothing.',
          minutes: 13,
          objectives: [
            'Explain why the log is written before the data pages.',
            'Describe crash recovery with the log in three steps.',
            'Compute the write cost of fsync at a given commit rate and the gain from group commit.',
            'Explain how the same log drives replication.',
          ],
          keyTerms: ['write-ahead log', 'durability', 'fsync', 'checkpoint', 'group commit', 'crash recovery'],
          links: [
            { label: 'PostgreSQL documentation: Write-Ahead Logging', url: 'https://www.postgresql.org/docs/current/wal-intro.html', kind: 'docs' },
            { label: 'SQLite documentation: Write-Ahead Logging', url: 'https://www.sqlite.org/wal.html', kind: 'docs' },
            { label: 'RocksDB wiki', url: 'https://github.com/facebook/rocksdb/wiki', kind: 'docs' },
            { label: 'Hussein Nasser on YouTube', url: 'https://www.youtube.com/@hnasr', kind: 'video' },
          ],
          body: `
## What this lesson covers

A write-ahead log (WAL) is an append-only file. A database writes every change to the log before it changes the data pages. This lesson explains why that order gives durability, how recovery works, and what the log costs at high commit rates.

## Why it matters

Durability is the promise that a committed write survives a crash. Without a log, a crash in the middle of a page write leaves a half-written page and a corrupt table. With a log, the database replays the committed changes after restart. The same log also feeds replicas, change data capture, and point-in-time restore. Almost every database you use has one.

## The idea with an example

A bank transfer moves 30 from account A to account B. Account A is on page 17. Account B is on page 92.

Without a log, the database writes page 17 with the new balance. Then the power fails. Page 92 is unchanged. 30 has vanished.

With a log, the steps are:

1. Append a record to the log: "transaction 501, page 17, A: 100 to 70".
2. Append a record: "transaction 501, page 92, B: 50 to 80".
3. Append a record: "transaction 501 commit".
4. Call fsync on the log file, so the operating system writes it to the disk.
5. Report commit to the client.
6. Later, write pages 17 and 92 to disk at leisure.

The timeline shows the order of the log write, the fsync, and the page writes.

:::timeline
title: One commit with the write-ahead log
unit: ms
lane Client
lane Database
lane Log disk
lane Data disk
Client -> Database: transfer 30 from A to B @0-0.1
Database: append 3 log records @0.1-0.2
Database -> Log disk: fsync @0.2-1.2
Log disk -> Database: confirmed @1.2-1.3
Database -> Client: commit @1.3-1.4
Database -> Data disk: write pages 17 and 92 later @3-4
:::

Now the power fails after step 5. On restart, the database reads the log. It finds a commit record for transaction 501. It applies both page changes. Both balances are right.

If the power fails after step 2, there is no commit record. Recovery ignores transaction 501. Neither balance changes. The transfer is lost, but the client never got a commit, so it will retry.

Press Next to follow transaction 501 through a crash and a recovery.

:::scenario
title: Crash and recovery of transaction 501
state: log=empty, page 17=A 100, page 92=B 50, client=waiting
step: The database appends the record for page 17, A from 100 to 70.
state: log=1 record
step: It appends the record for page 92, B from 50 to 80, then the commit record.
state: log=3 records
step: It calls fsync on the log and reports commit to the client. The pages on disk are unchanged.
state: client=got commit
step: The power fails before the pages reach disk. On restart the database reads the log.
state: page 17=A 100, page 92=B 50
step: The log has a commit record for 501. Recovery applies both changes. Both balances are right.
state: page 17=A 70, page 92=B 80
step: If the power had failed before the commit record, recovery would ignore 501 and the client would retry.
:::

## How it works

The log works because appending is sequential and small. One commit appends a few hundred bytes. The data pages are large and random, so the database writes them later in batches.

The fsync call is the expensive step. It waits until the disk confirms the write. On an SSD this takes about 100 us to 1 ms. On a hard disk, about 10 ms. At 1 ms per fsync, one log can commit at most 1,000 transactions per second.

The table gives the fsync time and the commit limit for each device.

| Device | Time per fsync | Maximum commits per second without group commit |
|---|---|---|
| SSD | 0.1 to 1 ms | 1,000 to 10,000 |
| Hard disk | 10 ms | 100 |

Group commit raises this limit. The database collects all transactions that arrive during one fsync and writes them in a single call. At 10,000 commits per second with 1 ms per fsync, each fsync carries about 10 commits. Throughput rises 10 times. Each commit waits up to 1 ms extra.

The bars compare the commit rate with and without group commit.

:::bars
title: Commit rate with 1 ms per fsync
unit: commits per second
One fsync per commit: 1000
Group commit, 10 per fsync: 10000
:::

A checkpoint is the point where all data pages up to a log position are on disk. The database records the checkpoint position, and recovery starts there. Without checkpoints, recovery replays the entire log from the start.

The recovery procedure is:

1. Find the last checkpoint position.
2. Read the log forward from there. Redo every change that belongs to a committed transaction.
3. Undo every change that belongs to a transaction with no commit record.

The log also serves replication. A follower reads the log of the leader and applies the same records. The follower is a copy of the leader up to the last record it received. The replication module covers this in detail.

Note: the log grows without limit unless the database recycles it. After a checkpoint, segments older than the checkpoint can be deleted or archived.

Caution: a disk with a volatile write cache can report fsync complete before the data is safe. Use a drive with power-loss protection or disable the cache.

## Common mistakes

- Mistake: disable fsync to speed up commits. Fix: keep fsync on and use group commit, because a crash loses the last seconds of data.
- Mistake: put the log and the data on a slow shared disk. Fix: put the log on its own fast device, because fsync latency sets the commit rate.
- Mistake: never checkpoint. Fix: checkpoint on a timer, because recovery time grows with the log.
- Mistake: delete old log segments before a backup copies them. Fix: archive segments first, or point-in-time restore fails.

## Check your understanding

- Why does the database write the log before the page? So a crash between the two leaves a record that recovery can replay.
- At 2 ms per fsync, what is the maximum commit rate without group commit? 500 per second.
- What does recovery do with a transaction that has no commit record? It undoes or ignores its changes.

## Go further

The PostgreSQL documentation explains its write-ahead log and the settings that control fsync and checkpoints. The SQLite page shows the same design in a single-file database. The RocksDB wiki describes the log in front of an LSM tree. Hussein Nasser walks through durability and fsync in his database videos.
`,
        },
      ],
    },
    {
      slug: 'replication-and-consistency',
      title: 'Replication and consistency',
      description: 'Leader and follower replication, quorums, linearizability in practice, and the Raft protocol.',
      lessons: [
        {
          slug: 'leader-follower-replication',
          title: 'Leader and follower replication',
          summary: 'One leader accepts writes and streams them to followers, which serve reads and take over on failure.',
          minutes: 14,
          objectives: [
            'Describe the write path and the read path in leader-follower replication.',
            'Compare synchronous and asynchronous replication by latency and data loss.',
            'Compute replication lag and its effect on a read-your-writes guarantee.',
            'Describe a failover procedure and its two main risks.',
          ],
          keyTerms: ['leader', 'follower', 'replication lag', 'synchronous replication', 'failover', 'split brain'],
          links: [
            { label: 'PostgreSQL documentation: High Availability and Replication', url: 'https://www.postgresql.org/docs/current/high-availability.html', kind: 'docs' },
            { label: 'MySQL documentation: Replication', url: 'https://dev.mysql.com/doc/refman/8.0/en/replication.html', kind: 'docs' },
            { label: 'Redis documentation', url: 'https://redis.io/docs/latest/', kind: 'docs' },
            { label: 'MIT 6.824 Distributed Systems', url: 'https://pdos.csail.mit.edu/6.824/', kind: 'course' },
            { label: 'ByteByteGo on YouTube', url: 'https://www.youtube.com/@ByteByteGo', kind: 'video' },
          ],
          body: `
## What this lesson covers

Replication keeps a copy of the data on several machines. In leader-follower replication, one machine, the leader, accepts all writes. The other machines, the followers, copy the writes from the leader. This lesson explains the write path, the read path, replication lag, and failover.

## Why it matters

A single database is a single point of failure. A disk fails, and the service is down. Replication gives you a copy to fail over to. It also gives you extra machines to serve reads. The cost is lag between the copies, and the risk of two leaders after a bad failover. Most outages in replicated databases come from one of those two.

## The idea with an example

A database has 1 leader and 2 followers. The write rate is 1,000 writes per second. The read rate is 10,000 reads per second.

A client writes "order 501 paid" to the leader. The leader appends the change to its write-ahead log and applies it. The leader streams the log record to both followers over the network. Each follower applies the record. The round trip inside the datacenter is 0.5 ms.

With asynchronous replication, the leader replies to the client at once, after its own disk write. The write takes 1 ms. The followers apply the record about 1 ms later. If the leader fails in that 1 ms, the write is lost.

With synchronous replication to one follower, the leader waits for that follower to confirm. The write takes 1 + 0.5 + 0.5 = 2 ms. The write is safe on two machines. If the follower is slow, every write is slow.

The timeline shows an asynchronous write and then a synchronous write to one follower.

:::timeline
title: Asynchronous and synchronous write to one follower
unit: ms
lane Client
lane Leader
lane Follower
Client -> Leader: async write @0-0.1
Leader: write to log and disk @0.1-1
Leader -> Client: reply at 1 ms @1-1.1
Leader -> Follower: stream the record @1-1.5
Follower: apply @1.5-2
Client -> Leader: sync write @3-3.1
Leader: write to log and disk @3.1-4
Leader -> Follower: stream the record @4-4.5
Follower: apply @4.5-4.6
Follower -> Leader: confirm @4.6-5.1
Leader -> Client: reply at 2 ms @5.1-5.2
:::

The bars compare the write latency of the two settings.

:::bars
title: Write latency by replication setting
unit: ms
Asynchronous: 1
Synchronous, 1 follower: 2
:::

Now the reads. The leader serves 1,000 writes per second and some reads. Each follower serves 5,000 reads per second. A client reads "order 501" from follower 2 at 0.5 ms after the write. Follower 2 has not applied the record yet. The client sees "unpaid". This is replication lag.

Press Next to follow the write and the stale read.

:::scenario
title: A read during replication lag
state: leader=order 501 unpaid, follower 1=unpaid, follower 2=unpaid, client sees=unknown
step: A client writes order 501 paid to the leader. The leader appends to its log and applies the write.
state: leader=order 501 paid
step: The leader replies to the client at once, because replication is asynchronous.
step: The leader streams the record to both followers. Follower 1 applies it after 1 ms.
state: follower 1=paid
step: At 0.5 ms after the write, the client reads order 501 from follower 2. Follower 2 has not applied the record.
state: client sees=unpaid
step: Follower 2 applies the record at 1 ms. A second read now returns paid. The gap was replication lag.
state: follower 2=paid, client sees=paid
:::

## How it works

The leader keeps a log of every write in order. Each record has a position number. A follower asks for records from its last position. The leader streams them. The follower applies them in the same order. A follower that was down for an hour catches up from its last position.

Replication lag is the time between a write on the leader and its visibility on a follower. Under normal load it is milliseconds. Under heavy writes, or on a slow follower, it grows to seconds or minutes. Monitor it as a number of seconds or a number of log bytes behind.

The table compares the two replication settings.

| Setting | Write latency | Data loss on leader crash | Effect of a slow follower |
|---|---|---|---|
| Asynchronous | 1 ms | Up to the lag, about 1 ms of writes | None |
| Synchronous, 1 follower | 2 ms | None | Every write slows |

Lag breaks three expectations. Read-your-writes: a user posts a comment and does not see it. Monotonic reads: a user sees the comment, refreshes on another follower, and it vanishes. Consistent prefix: a user sees a reply before the message it answers.

The procedure for read-your-writes is:

1. Record the log position of the write in the client session.
2. On a read, send the position to the follower.
3. If the follower is behind that position, wait, or route the read to the leader.

Failover replaces a failed leader with a follower:

1. Detect the leader failure, usually after a timeout of 10 to 30 seconds.
2. Choose the follower with the most recent log position.
3. Promote it to leader.
4. Point the other followers and the clients at the new leader.

The two risks are data loss and split brain. Data loss: the promoted follower was behind, so the last writes vanish. Split brain: the old leader was only slow, not dead, and still accepts writes. Two leaders now have different data. Fencing stops this: the old leader must be shut down, or its writes rejected, before the new leader starts.

Caution: an automatic failover with a 5-second timeout fails over on every network hiccup and causes more outages than it prevents.

## Common mistakes

- Mistake: serve a read after a write from any follower. Fix: route the read to the leader or wait for the write position.
- Mistake: use synchronous replication to all followers. Fix: use one synchronous follower, because one slow follower would stop all writes.
- Mistake: promote a follower without fencing the old leader. Fix: stop the old leader first, or you get two leaders.
- Mistake: ignore the lag metric. Fix: alert when lag passes a few seconds, because a follower that is minutes behind is not a safe failover target.

## Check your understanding

- Where do writes go in leader-follower replication? Only to the leader.
- What is replication lag? The delay between a write on the leader and the same write on a follower.
- What is split brain? Two machines both act as leader and accept different writes.

## Go further

The PostgreSQL high-availability documentation describes streaming replication and synchronous commit settings. The MySQL replication documentation covers the same with its own log format. The Redis documentation explains its asynchronous replicas and Sentinel failover. MIT 6.824 has a lecture on primary-backup replication, and ByteByteGo has short videos on replication and failover.
`,
        },
        {
          slug: 'quorums',
          title: 'Quorum reads and writes',
          summary: 'With N replicas, a write to W and a read from R overlap on at least one fresh copy when W + R > N.',
          minutes: 14,
          objectives: [
            'State the quorum condition and explain why it guarantees an overlap.',
            'Compute W and R for a given N and a given availability goal.',
            'Explain what a sloppy quorum and hinted handoff change.',
            'Describe read repair and anti-entropy as ways to fix stale replicas.',
          ],
          keyTerms: ['quorum', 'replication factor', 'leaderless replication', 'read repair', 'hinted handoff', 'sloppy quorum'],
          links: [
            { label: 'Dynamo: Amazon’s Highly Available Key-value Store', url: 'https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf', kind: 'paper' },
            { label: 'Apache Cassandra documentation', url: 'https://cassandra.apache.org/doc/latest/', kind: 'docs' },
            { label: 'Jepsen: Consistency Models', url: 'https://jepsen.io/consistency', kind: 'docs' },
            { label: 'Hussein Nasser on YouTube', url: 'https://www.youtube.com/@hnasr', kind: 'video' },
          ],
          body: `
## What this lesson covers

Leaderless replication has no single leader. A client writes to several replicas at once and reads from several at once. A quorum is the minimum number of replicas that must answer. This lesson shows the quorum condition with 3 replicas and explains the tools that keep the replicas in agreement.

## Why it matters

Cassandra, DynamoDB, and Riak use quorums. They stay available when one replica is down, with no failover and no leader election. The cost is that reads may return stale or conflicting values unless you pick the quorum sizes with care.

## The idea with an example

A key is stored on N = 3 replicas: A, B, and C. The value is a user profile with a version number.

Step 1, a client writes version 2. It sends the write to all 3 replicas and waits for W = 2 confirmations. A and B confirm. C is slow and has not applied it. The write returns success.

Step 2, another client reads. It sends the read to all 3 and waits for R = 2 answers. The answers come from B, with version 2, and from C, with version 1. The client picks the highest version, 2. The read is correct.

Press Next to follow the write and the read across the three replicas.

:::scenario
title: Quorum write and read with N=3, W=2, R=2
state: A=v1, B=v1, C=v1, read result=none
step: A client writes version 2 to all three replicas and waits for 2 confirmations.
state: A=v2, B=v2
step: A and B confirm. C is slow and still holds version 1. The write returns success.
step: Another client reads from all three and waits for 2 answers. B answers v2 and C answers v1.
step: The client keeps the highest version. The read returns v2.
state: read result=v2
step: Read repair writes v2 back to C, so C is no longer stale.
state: C=v2
:::

Why did it work? W + R = 4, which is more than N = 3. Any set of 2 replicas that wrote and any set of 2 that read must share at least one replica. That shared replica has the fresh value.

Now set W = 1 and R = 1. W + R = 2, not more than 3. A write to A alone and a read from C alone never meet. The read returns version 1. This setting is fast and available but stale.

Now set W = 3 and R = 1. Every write hits all replicas, so any read is fresh. But if one replica is down, no write can succeed. Availability drops.

The table compares the three settings.

| W | R | W + R > 3 | Fresh reads | One replica down |
|---|---|---|---|---|
| 1 | 1 | No | No | Reads and writes work |
| 2 | 2 | Yes | Yes | Reads and writes work |
| 3 | 1 | Yes | Yes | Writes fail |

The grid marks every pair of W and R that overlaps with N = 3, where 1 means yes.

:::matrix
title: Does W plus R exceed N with N = 3
cols: R=1, R=2, R=3
W=1: 0, 0, 1
W=2: 0, 1, 1
W=3: 1, 1, 1
:::

## How it works

The quorum condition is:

$$W + R > N$$

Here $N$ is the number of replicas that hold the key, $W$ is the number that must confirm a write, and $R$ is the number that must answer a read. The common setting is $N = 3$, $W = 2$, $R = 2$. It survives one failed replica for both reads and writes.

The procedure to pick the values is:

1. Pick $N$ from the number of failures you must survive. $N = 3$ survives 1, $N = 5$ survives 2.
2. If writes are more common, pick a small $W$ and a large $R$.
3. If reads are more common, pick a large $W$ and a small $R$.
4. Confirm $W + R > N$.
5. Confirm $W \\le N - f$ and $R \\le N - f$, where $f$ is the number of failures to survive.

The guarantee has limits. Two writes can arrive at the same time on different replicas. The replicas then hold different values with the same version. The store must resolve the conflict. Last-writer-wins uses a timestamp and drops one write. Version vectors keep both and let the application merge them.

A sloppy quorum relaxes the rule. If replica C is down, the store writes to a spare replica D instead and still counts W = 2. Later, D hands the write to C. This is hinted handoff. It raises availability, but a read from A and C during the outage does not see the write on D. The quorum overlap no longer holds.

The diagram shows a sloppy quorum write and the later handoff.

:::flow
title: Sloppy quorum with hinted handoff
Client -> A: write v3
Client -> D: write v3 with a hint for C
A -> Client: confirm
D -> Client: confirm, W is 2
D -> C: hand off v3 when C returns
:::

Two mechanisms repair stale replicas. Read repair: when a read sees version 1 on C and version 2 on B, the client writes version 2 back to C. Anti-entropy: a background process compares replicas with a hash tree and copies missing values. Without these, a replica that missed a write stays stale forever.

Note: a quorum with $W + R > N$ is not linearizable in general. Use a consensus protocol when you need linearizability.

## Common mistakes

- Mistake: set W = 1 and R = 1 for speed and expect fresh reads. Fix: use W + R > N, or accept stale reads knowingly.
- Mistake: treat last-writer-wins as safe. Fix: know that it drops concurrent writes, and use version vectors for data that must not be lost.
- Mistake: enable sloppy quorums and expect the overlap guarantee. Fix: use strict quorums for keys that need fresh reads.
- Mistake: skip anti-entropy because read repair exists. Fix: run anti-entropy, because rarely read keys never get read repair.

## Check your understanding

- With N = 5, W = 3, what is the smallest R that gives an overlap? R = 3.
- Why does W = 2, R = 2 survive one failed replica with N = 3? Two replicas remain, enough for both a write and a read.
- What does hinted handoff do? A spare replica stores a write for a down replica and delivers it later.

## Go further

The Dynamo paper introduced sloppy quorums, hinted handoff, and version vectors in one design. The Cassandra documentation describes its consistency levels, which are W and R under other names. The Jepsen consistency page shows where quorum systems sit among the consistency models. Hussein Nasser explains quorum reads and writes on YouTube.
`,
        },
        {
          slug: 'linearizability-in-practice',
          title: 'Linearizability in practice',
          summary: 'Linearizability makes a replicated value behave like one variable, and it costs a round of agreement per write.',
          minutes: 14,
          objectives: [
            'Check a short history of operations for linearizability.',
            'Explain why a linearizable register needs agreement among replicas.',
            'Identify the operations in a system that need linearizability.',
            'Explain the latency cost of linearizable reads and the common optimisations.',
          ],
          keyTerms: ['linearizability', 'history', 'register', 'compare-and-set', 'lease', 'fencing token'],
          links: [
            { label: 'Jepsen: Consistency Models', url: 'https://jepsen.io/consistency', kind: 'docs' },
            { label: 'Strong consistency models (Aphyr)', url: 'https://aphyr.com/posts/313-strong-consistency-models', kind: 'article' },
            { label: 'etcd documentation', url: 'https://etcd.io/docs/', kind: 'docs' },
            { label: 'Knossos: linearizability checker', url: 'https://github.com/jepsen-io/knossos', kind: 'repo' },
            { label: 'MIT 6.824 Distributed Systems', url: 'https://pdos.csail.mit.edu/6.824/', kind: 'course' },
          ],
          body: `
## What this lesson covers

Linearizability is the strongest consistency model for a single object. The fundamentals module defined it. This lesson shows how to test a history for it, which operations need it, and how real systems pay for it.

## Why it matters

Some operations are wrong if two clients can both succeed. Two users cannot claim the same username. Two jobs cannot both hold the same lock. Two servers cannot both be the leader. Each of these needs one linearizable operation. Everything else in the system can be weaker and faster. Knowing where the line is saves both correctness and latency.

## The idea with an example

A register holds one value. Three clients run these operations, with real-time start and end:

| Client | Operation | Start | End |
|---|---|---|---|
| 1 | write(5) | 0 ms | 10 ms |
| 2 | read() returns 5 | 4 ms | 6 ms |
| 3 | read() returns 0 | 12 ms | 14 ms |

Is this history linearizable? We must place each operation at one instant inside its interval, in an order that a single variable would produce.

The timeline shows the three operations with their start and end times.

:::timeline
title: Three operations on one register
unit: ms
lane Client 1
lane Client 2
lane Client 3
Client 1: write 5 @0-10
Client 2: read returns 5 @4-6
Client 3: read returns 0 @12-14
:::

Client 2 read 5, so the write must take effect before 6 ms. Place the write at 3 ms and the read at 5 ms. Now client 3 reads 0 at some instant after 12 ms. But the value has been 5 since 3 ms. No placement works. The history is not linearizable.

Now change client 3 to return 5. Place the write at 3 ms, read 2 at 5 ms, read 3 at 13 ms. All consistent. The history is linearizable.

Now a case that looks wrong but is allowed. Client 1 writes 5 from 0 to 10 ms. Client 2 reads 0 from 2 to 4 ms. Place the read at 3 ms and the write at 8 ms. Allowed. A read that overlaps a write may return either value.

Press Next to place each operation at one instant.

:::scenario
title: Try to place each operation at one instant
state: write 5 at=unplaced, read by client 2 at=unplaced, read by client 3 at=unplaced, verdict=unknown
step: Client 2 read 5 between 4 and 6 ms. The write must take effect before 6 ms.
step: Place the write at 3 ms and the read of client 2 at 5 ms. Both are inside their intervals.
state: write 5 at=3 ms, read by client 2 at=5 ms
step: Client 3 read 0 between 12 and 14 ms. The value has been 5 since 3 ms. No instant works.
state: read by client 3 at=impossible, verdict=not linearizable
step: Change the read of client 3 to return 5. Place it at 13 ms.
state: read by client 3 at=13 ms, verdict=linearizable
step: A read that overlaps a write may return the old or the new value. The order of the instants decides.
:::

## How it works

The check procedure for a small history is:

1. Write down the start and end time of every operation.
2. Try to pick one instant per operation inside its interval.
3. Sort the instants.
4. Replay the operations in that order on a single variable.
5. If every read returns the value of the latest write before it, the history is linearizable.

For large histories, use a checker tool such as Knossos. The problem is NP-complete in general, so checkers use heuristics.

A replicated system provides linearizability with a leader and agreement. Each write goes to the leader. The leader sends the write to a majority of replicas and waits for their confirmation. Only then does it apply the write and reply. The next lesson on Raft shows the full protocol. The cost is one network round trip to a majority per write, about 1 ms inside a datacenter and 100 ms across continents.

The bars compare the cost of one majority round trip in the two settings.

:::bars
title: Cost of one majority round trip per write
unit: ms
Inside a datacenter: 1
Across continents: 100
:::

Linearizable reads also cost a round trip. A leader that answers from its own state may be a stale leader that was replaced. Two fixes exist. A read index: the leader confirms with a majority that it is still the leader, then answers. A lease: the leader holds a time-bound lease and answers alone while the lease is valid. Leases rely on bounded clock drift.

The operations that need linearizability are:

- Compare-and-set: set a value only if it still equals an expected value. This is the primitive for locks and unique names.
- Leader election: exactly one leader at a time.
- Sequence numbers: no two clients get the same number.

A lock also needs a fencing token. The lock service gives each lock holder an increasing number. The storage system rejects any write with a number lower than the last it saw. This stops a paused client from writing after its lock expired.

Note: keep the linearizable store small. Put locks, configuration, and leader records in etcd or ZooKeeper. Keep bulk data in a faster, weaker store.

## Common mistakes

- Mistake: check only the final state, not the history. Fix: record the timing of each operation, because a stale read is invisible in the final state.
- Mistake: read from a follower and call it linearizable. Fix: read through the leader with a read index, or accept a weaker model.
- Mistake: use a lock without a fencing token. Fix: include the token in each write, because a client can pause past its lock expiry.
- Mistake: put all data in the consensus store. Fix: store only coordination data there, because each write costs a majority round trip.

## Check your understanding

- Can a read that overlaps a write return the old value? Yes, as long as some single ordering explains all operations.
- What primitive gives a unique-name check? Compare-and-set.
- Why does a linearizable read need a round trip? The leader must confirm it has not been replaced.

## Go further

The Jepsen consistency page and the Aphyr post define linearizability with diagrams. The etcd documentation shows a real linearizable store and its read options. Knossos is the checker Jepsen uses on real database histories. MIT 6.824 has a full lecture on linearizability with worked histories.
`,
        },
        {
          slug: 'raft',
          title: 'Raft consensus',
          summary: 'Raft elects a leader, replicates a log to a majority, and commits each entry once a majority holds it.',
          minutes: 17,
          objectives: [
            'Describe the three Raft roles and the term counter.',
            'Walk through one log entry from client request to commit on 5 nodes.',
            'Explain why a majority is required and how many failures N nodes survive.',
            'Describe leader election with randomised timeouts and why it converges.',
          ],
          keyTerms: ['raft', 'consensus', 'term', 'log entry', 'commit index', 'majority', 'leader election'],
          links: [
            { label: 'The Raft Consensus Algorithm (official site)', url: 'https://raft.github.io/', kind: 'docs' },
            { label: 'In Search of an Understandable Consensus Algorithm (Raft paper)', url: 'https://raft.github.io/raft.pdf', kind: 'paper' },
            { label: 'The Secret Lives of Data: Raft visualisation', url: 'https://thesecretlivesofdata.com/raft/', kind: 'article' },
            { label: 'etcd raft library', url: 'https://github.com/etcd-io/raft', kind: 'repo' },
            { label: 'MIT 6.824 Distributed Systems', url: 'https://pdos.csail.mit.edu/6.824/', kind: 'course' },
          ],
          body: `
## What this lesson covers

Consensus is the problem of making several machines agree on one sequence of values, even when some machines fail. Raft is the consensus protocol used by etcd, Consul, CockroachDB, and TiKV. This lesson walks through log replication and leader election on 5 nodes.

## Why it matters

Raft is how a system gets a linearizable log without a single point of failure. If you understand Raft, you understand why a 3-node cluster survives 1 failure and a 5-node cluster survives 2. You also understand why a cluster with no majority stops accepting writes instead of giving wrong answers.

## The idea with an example

A cluster has 5 nodes: S1 to S5. S1 is the leader in term 3. A term is a counter that increases with each election. Each node has a log, a list of entries, and a commit index, the position up to which entries are final.

Step 1, a client sends "set x = 7" to S1. S1 appends the entry at log index 10 with term 3. S1 does not apply it yet.

Step 2, S1 sends the entry to S2 through S5 in an AppendEntries message. The message includes index 9 and its term, so each follower can check that its log matches up to index 9.

Step 3, S2 and S3 append the entry and reply success. S4 is slow. S5 is down. S1 now knows that 3 of 5 nodes hold index 10. That is a majority.

Step 4, S1 sets its commit index to 10 and applies "set x = 7" to its state machine. S1 replies to the client.

Step 5, S1 includes commit index 10 in its next message. S2 and S3 apply the entry. S4 catches up later. S5 catches up when it returns.

The diagram shows the messages for one log entry.

:::flow
title: Log replication of index 10 on 5 nodes
Client -> S1 leader: set x to 7
S1 leader -> S2: AppendEntries index 10
S1 leader -> S3: AppendEntries index 10
S1 leader -> S4: AppendEntries index 10, slow
S1 leader -> S5: AppendEntries index 10, down
S2 -> S1 leader: success
S3 -> S1 leader: success
S1 leader -> Client: committed, 3 of 5 hold it
:::

Now S1 crashes. S2 through S5 stop receiving heartbeats. After a random timeout between 150 and 300 ms, S3 times out first. S3 increments the term to 4 and asks the others for votes. S2 and S4 see that S3's log is at least as complete as theirs. They vote for S3. S3 has 3 votes, a majority, and becomes leader. Index 10 was on a majority, so S3 has it. No committed entry is lost.

Press Next to follow the election.

:::scenario
title: Election after the leader S1 crashes
state: term=3, leader=S1, votes for S3=0, S3 role=follower
step: S1 crashes. S2 to S5 stop receiving heartbeats.
state: leader=none
step: S3 times out first after a random wait between 150 and 300 ms. It increments the term and becomes a candidate.
state: term=4, S3 role=candidate, votes for S3=1
step: S3 sends RequestVote to all nodes with its last log index 10 and term 3.
step: S2 and S4 see that the log of S3 is at least as complete as theirs. They vote for S3.
state: votes for S3=3
step: 3 of 5 is a majority. S3 becomes leader for term 4. Index 10 was on a majority, so S3 holds it.
state: leader=S3, S3 role=leader
:::

## How it works

Each node is in one of three roles: leader, follower, or candidate. The leader handles all client writes and sends heartbeats. Followers only reply. A candidate is a follower that is asking for votes.

A majority of $N$ nodes is $\\lfloor N / 2 \\rfloor + 1$. The cluster survives $f$ failures when:

$$N \\ge 2f + 1$$

Here $N$ is the number of nodes and $f$ is the number of failures to survive. So 3 nodes survive 1 failure, 5 survive 2, and 7 survive 3. A 4-node cluster also survives only 1, so even sizes waste a node.

The table gives the majority and the failures survived for common sizes.

| Nodes | Majority | Failures survived |
|---|---|---|
| 3 | 2 | 1 |
| 4 | 3 | 1 |
| 5 | 3 | 2 |
| 7 | 4 | 3 |

The bars show that 4 nodes survive no more failures than 3.

:::bars
title: Failures survived by cluster size
unit: failures
3 nodes: 1
4 nodes: 1
5 nodes: 2
7 nodes: 3
:::

Any two majorities share at least one node. That shared node holds every committed entry. A candidate wins only if its log is at least as up to date as each voter's log. So the new leader always holds every committed entry.

The election procedure is:

1. A follower receives no heartbeat for its election timeout.
2. It increments its term, becomes a candidate, and votes for itself.
3. It sends RequestVote to all nodes with its last log index and term.
4. A node votes yes if it has not voted in this term and the candidate's log is at least as complete as its own.
5. The candidate becomes leader on a majority of votes, or returns to follower if it sees a higher term.

Randomised timeouts make elections converge. If all nodes timed out at the same instant, they would split the vote every time. With random timeouts, one node usually starts first and wins before the others wake.

Note: Raft gives a linearizable log. To serve linearizable reads, the leader uses a read index or a lease, as the previous lesson described.

## Common mistakes

- Mistake: run an even number of nodes. Fix: use 3 or 5, because 4 nodes survive the same 1 failure as 3.
- Mistake: spread 3 nodes across 2 datacenters. Fix: use 3 datacenters, because losing the one with 2 nodes removes the majority.
- Mistake: set election timeouts shorter than the network round trip. Fix: set the timeout to at least 10 times the round trip.
- Mistake: apply an entry as soon as the leader appends it. Fix: apply only after the commit index passes the entry.

## Check your understanding

- How many nodes does a cluster need to survive 2 failures? 5.
- When is an entry committed? When the leader knows a majority of nodes hold it.
- Why do randomised election timeouts help? One node usually times out first and wins before the others start competing.

## Go further

The official Raft site collects implementations and the visualisation. Read the Raft paper, which was written to be understandable and includes the full state machine on one page. The Secret Lives of Data walks through election and replication step by step. The etcd raft library is the most used production implementation, and MIT 6.824 has a lab in which you implement Raft yourself.
`,
        },
      ],
    },
    {
      slug: 'partitioning',
      title: 'Partitioning',
      description: 'Hash and range partitioning, consistent hashing, rebalancing, and hot keys.',
      lessons: [
        {
          slug: 'hashing-and-consistent-hashing',
          title: 'Hash partitioning and consistent hashing',
          summary: 'Consistent hashing places keys and nodes on a ring so that adding a node moves only about 1/N of the keys.',
          minutes: 15,
          objectives: [
            'Assign keys to nodes with modulo hashing and compute how many keys move when a node is added.',
            'Place nodes and keys on a hash ring and find the owner of a key.',
            'Explain why virtual nodes balance the ring.',
            'Compare hash partitioning with range partitioning for scans.',
          ],
          keyTerms: ['partition', 'shard', 'hash function', 'consistent hashing', 'hash ring', 'virtual node', 'range partitioning'],
          links: [
            { label: 'A Fast, Minimal Memory, Consistent Hash Algorithm (Jump hash)', url: 'https://arxiv.org/abs/1406.2294', kind: 'paper' },
            { label: 'Dynamo: Amazon’s Highly Available Key-value Store', url: 'https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf', kind: 'paper' },
            { label: 'Apache Cassandra documentation', url: 'https://cassandra.apache.org/doc/latest/', kind: 'docs' },
            { label: 'ByteByteGo on YouTube', url: 'https://www.youtube.com/@ByteByteGo', kind: 'video' },
            { label: 'Gaurav Sen on YouTube', url: 'https://www.youtube.com/@gkcs', kind: 'video' },
          ],
          body: `
## What this lesson covers

Partitioning splits a dataset across several nodes so that each node holds a part. A partition is also called a shard. This lesson shows two ways to decide which node owns a key: modulo hashing and consistent hashing. It shows with numbers why the second one is better when nodes come and go.

## Why it matters

One node holds at most a few terabytes and serves at most a few tens of thousands of writes per second. Above that, you must partition. Every cache cluster, every key-value store, and every message queue partitions by key. The method decides how much data moves when you add a node, and moving data is the most dangerous operation in a storage cluster.

## The idea with an example

A cache has 4 nodes. A key goes to node number hash(key) mod 4. Take 4 keys with hash values 17, 22, 35, and 40.

| Key hash | mod 4 | Node |
|---|---|---|
| 17 | 1 | 1 |
| 22 | 2 | 2 |
| 35 | 3 | 3 |
| 40 | 0 | 0 |

Now add a fifth node. The rule becomes mod 5.

| Key hash | mod 5 | Node | Moved? |
|---|---|---|---|
| 17 | 2 | 2 | Yes |
| 22 | 2 | 2 | No |
| 35 | 0 | 0 | Yes |
| 40 | 0 | 0 | No |

Half of the keys moved. With many keys, modulo hashing moves about $N / (N + 1)$ of them, 80 percent when going from 4 to 5 nodes. In a cache, every moved key is a miss. The database behind the cache sees a flood.

Now use consistent hashing. Draw a ring with positions 0 to 99. Hash each node to a position: node A at 10, B at 35, C at 60, D at 85. Hash each key to a position. A key belongs to the first node clockwise from its position.

Key at 17 goes to B at 35. Key at 22 goes to B. Key at 35 goes to B. Key at 40 goes to C. Key at 90 wraps around to A.

Add node E at 50. Only keys between 35 and 50 move, from C to E. The key at 40 moves. The others stay. On average, adding one node moves $1 / (N + 1)$ of the keys, 20 percent for 4 to 5 nodes. The moved keys all come from one neighbour.

Press Next to see which node owns each key as node E joins.

:::scenario
title: Add node E to a ring of 4 nodes
state: key 17=B, key 22=B, key 35=B, key 40=C, key 90=A, moved=0
step: Nodes sit at positions A 10, B 35, C 60, and D 85. A key belongs to the first node clockwise from its position.
step: Keys 17, 22, and 35 reach B at 35 first. Key 40 reaches C at 60. Key 90 wraps around to A at 10.
step: Add node E at position 50. Only keys between 35 and 50 change owner.
step: Key 40 now reaches E at 50 before C at 60. It moves from C to E.
state: key 40=E, moved=1
step: The other 4 keys keep their owner. Adding one node moved 1 of 5 keys, all from one neighbour.
:::

The bars compare the share of keys that move with each method.

:::bars
title: Keys that move when a fifth node joins
unit: percent
Modulo hashing: 80
Consistent hashing: 20
:::

## How it works

A hash function maps a key to a number in a fixed range, for example 0 to $2^{32} - 1$. A good hash spreads keys evenly and does not change over time. Use a stable function such as MurmurHash or xxHash, not the language's built-in hash, because that can differ between processes.

The lookup procedure on a ring is:

1. Hash the key to a position.
2. Find the first node position that is greater than or equal to it. Use binary search over the sorted node positions.
3. If none is found, wrap to the smallest node position.

The diagram shows the lookup from a key to its owner.

:::flow
title: Find the owner of a key on the ring
Key -> Hash function: stable hash such as xxHash
Hash function -> Ring position: number from 0 to 99
Ring position -> Sorted node list: binary search
Sorted node list -> Owner node: first position at or after the key
Ring position -> Owner node: wrap to the smallest position if none
:::

With 4 nodes at random positions, the arcs are uneven. One node can own 40 percent of the ring. Virtual nodes fix this. Each physical node gets 100 to 200 positions on the ring. The arcs average out, and the spread is within a few percent. Virtual nodes also let a bigger machine take more positions.

Range partitioning is the alternative. Keys are sorted, and each node owns a range, for example "a" to "f". Range scans are cheap because adjacent keys sit on one node. But sequential keys such as timestamps all land on one node. Hash partitioning spreads them but makes range scans hit every node.

| Property | Hash | Range |
|---|---|---|
| Even spread | Good | Depends on keys |
| Range scan | Every node | One node |
| Sequential writes | Spread | One hot node |

## Common mistakes

- Mistake: use modulo hashing for a cache cluster. Fix: use consistent hashing, because a resize empties most of the cache.
- Mistake: put each physical node once on the ring. Fix: use 100 or more virtual nodes per physical node.
- Mistake: hash with a function that differs between languages. Fix: use one named stable hash in every client.
- Mistake: partition time-series data by range on the timestamp. Fix: hash by a device id, then range by time within the partition.

## Check your understanding

- With modulo hashing, about what fraction of keys moves from 9 to 10 nodes? About 90 percent.
- With consistent hashing, about what fraction moves from 9 to 10 nodes? About 10 percent.
- Which node owns a key whose position is past the last node on the ring? The first node, by wrap-around.

## Go further

The jump hash paper gives a tiny consistent hash with full code. The Dynamo paper shows the ring with virtual nodes in a production store. The Cassandra documentation describes its token ring and virtual nodes. ByteByteGo and Gaurav Sen both have clear video walkthroughs of consistent hashing.
`,
        },
        {
          slug: 'rebalancing',
          title: 'Rebalancing partitions',
          summary: 'Rebalancing moves partitions between nodes without downtime, with a fixed partition count and a throttled copy.',
          minutes: 13,
          objectives: [
            'Explain why a fixed number of partitions makes rebalancing simple.',
            'Compute the data moved and the time needed to add a node at a given copy rate.',
            'Describe a safe migration sequence for one partition.',
            'Explain how clients find the current owner of a partition.',
          ],
          keyTerms: ['rebalancing', 'partition count', 'migration', 'throttling', 'routing table', 'service discovery'],
          links: [
            { label: 'Apache Kafka documentation', url: 'https://kafka.apache.org/documentation/', kind: 'docs' },
            { label: 'Redis documentation', url: 'https://redis.io/docs/latest/', kind: 'docs' },
            { label: 'Vitess documentation', url: 'https://vitess.io/docs/', kind: 'docs' },
            { label: 'Hussein Nasser on YouTube', url: 'https://www.youtube.com/@hnasr', kind: 'video' },
          ],
          body: `
## What this lesson covers

Rebalancing is the move of data from some nodes to others, usually after a node is added or removed. This lesson shows how a fixed partition count makes the move simple, how long it takes, and how to do it without errors for clients.

## Why it matters

A cluster that cannot rebalance cannot grow. A cluster that rebalances badly fails under the extra load of the copy, or loses writes that arrive during the move. Kafka, Redis Cluster, Elasticsearch, and sharded SQL systems all rebalance. The method is the same in each one.

## The idea with an example

A key-value store has 3 nodes and 300 GB of data. The store uses a fixed count of 30 partitions, 10 per node, 10 GB each. The routing table says which node owns each partition.

A fourth node arrives. The target is 7 or 8 partitions per node. The plan moves 2 partitions from node 1, 3 from node 2, and 3 from node 3 to node 4. That is 8 partitions, 80 GB. No partition splits, and no key changes its partition. Only the owner of a partition changes.

The copy rate is throttled to 50 MB per second, so that the live traffic keeps most of the bandwidth. 80 GB at 50 MB per second takes 1,600 seconds, about 27 minutes. Without the throttle, at 500 MB per second, it takes 3 minutes, but the live reads on nodes 1 to 3 slow down by half.

The bars compare the copy time with and without the throttle.

:::bars
title: Time to move 80 GB
unit: minutes
Throttled at 50 MB per second: 27
Full speed at 500 MB per second: 3
:::

During the copy, writes keep arriving for the moving partitions. The source node keeps serving them and logs each write. When the copy is done, the source sends the log to the target. The target applies it. The routing table switches. The source stops.

Press Next to follow the fourth node into the cluster.

:::scenario
title: Add a fourth node to a 30-partition store
state: node 1=10 partitions, node 2=10, node 3=10, node 4=0, copied=0 GB, time=0 min
step: Each partition holds 10 GB. The target is 7 or 8 partitions per node.
step: The plan moves 2 partitions from node 1, 3 from node 2, and 3 from node 3 to node 4. No key changes partition.
step: The copy is throttled to 50 MB per second. 80 GB takes about 27 minutes.
state: node 1=8 partitions, node 2=7, node 3=7, node 4=8, copied=80 GB, time=27 min
step: During the copy the sources serve writes and log them. After the copy they send the log to node 4.
step: The routing table switches 8 partitions to node 4. Clients refresh the table on a moved error.
:::

## How it works

A fixed partition count removes the need to rehash keys. Pick a count at the start that is far larger than the node count. A good rule is 10 to 100 partitions per node at the expected final size. Each partition is a unit that moves whole. Kafka topics and Redis Cluster slots work this way; Redis uses 16,384 slots.

The migration procedure for one partition is:

1. Mark the partition as "moving" in the routing table. The source still owns it.
2. Copy a snapshot of the partition from source to target, with a throttle.
3. Stream the writes that arrived during the copy to the target.
4. When the target is within a few milliseconds of the source, pause writes to that partition.
5. Send the last writes, switch the owner in the routing table, and resume writes.
6. Delete the partition on the source after a grace period.

The pause in step 4 lasts milliseconds, so clients see a short latency bump, not an error.

The timeline shows the migration of one 10 GB partition.

:::timeline
title: Migrate one 10 GB partition at 50 MB per second
unit: s
lane Routing table
lane Source
lane Target
Routing table: mark partition as moving @0-1
Source -> Target: copy snapshot with throttle @1-201
Source: serve writes and log them @1-205
Source -> Target: stream logged writes @201-205
Source: pause writes for milliseconds @205-205.5
Routing table: switch owner to target @205.5-206
Target: serve reads and writes @206-210
:::

Clients find the owner through a routing table. Three designs exist:

- Clients hold a copy of the table and refresh it on a "moved" error from a node.
- A proxy holds the table and forwards every request.
- A coordination service such as ZooKeeper or etcd holds the table and clients watch for changes.

The table compares the three designs.

| Design | Who holds the table | Cost |
|---|---|---|
| Client-side table | Every client | Refresh on a moved error |
| Proxy | One proxy tier | One extra hop per request |
| Coordination service | ZooKeeper or etcd | Clients watch for changes |

The time to add a node is:

$$t = \\frac{D / N_{\\text{old}} - D / N_{\\text{new}}}{r} \\times N_{\\text{old}}$$

Here $D$ is the total data, $N$ is the node count before and after, and $r$ is the copy rate per node. In the example, each old node sends about 27 GB, so each takes about 9 minutes at 50 MB per second. The three sources work in parallel.

Caution: an automatic rebalance that triggers on every brief node failure moves data in circles and overloads the cluster. Add a delay of several minutes before a rebalance starts.

## Common mistakes

- Mistake: pick a partition count equal to the node count. Fix: pick 10 or more partitions per node, so you can add nodes later.
- Mistake: rebalance at full disk speed. Fix: throttle the copy, because live traffic shares the disk and the network.
- Mistake: switch the owner before the write log catches up. Fix: pause writes for the last milliseconds and send the final entries first.
- Mistake: let clients cache the routing table forever. Fix: refresh on a moved error and on a timer.

## Check your understanding

- Why does a fixed partition count help? Keys never change partition, so only partition ownership moves.
- How long does 60 GB take at 100 MB per second? 600 seconds, 10 minutes.
- What happens to writes during the copy? The source serves them and streams them to the target afterwards.

## Go further

The Kafka documentation describes partition reassignment with throttles. The Redis documentation covers cluster slots and resharding. The Vitess documentation shows resharding of a MySQL cluster with the same copy-then-switch sequence. Hussein Nasser walks through sharding and resharding on YouTube.
`,
        },
        {
          slug: 'hot-keys',
          title: 'Hot keys and skew',
          summary: 'A hot key sends most traffic to one partition, and the fix is to split the key, cache it, or sample it.',
          minutes: 13,
          objectives: [
            'Detect a hot key from per-partition metrics.',
            'Compute the load on one node when a single key takes a given share of traffic.',
            'Apply key salting to spread a hot key over several partitions.',
            'Choose between a local cache and salting for reads and for writes.',
          ],
          keyTerms: ['hot key', 'skew', 'key salting', 'local cache', 'celebrity problem', 'partition'],
          links: [
            { label: 'Scaling Memcache at Facebook (NSDI 2013)', url: 'https://www.usenix.org/conference/nsdi13/technical-sessions/presentation/nishtala', kind: 'paper' },
            { label: 'Amazon Builders Library: Caching challenges and strategies', url: 'https://aws.amazon.com/builders-library/caching-challenges-and-strategies/', kind: 'article' },
            { label: 'Redis documentation', url: 'https://redis.io/docs/latest/', kind: 'docs' },
            { label: 'ByteByteGo on YouTube', url: 'https://www.youtube.com/@ByteByteGo', kind: 'video' },
          ],
          body: `
## What this lesson covers

Partitioning spreads keys evenly only when traffic per key is even. A hot key is a single key that receives a large share of the traffic. This lesson shows how a hot key overloads one node while the others idle, and the three standard fixes.

## Why it matters

A celebrity posts, and 10 million followers read one profile. A flash sale puts one product in every cart. A counter for "total views" takes every write. Each of these is one key on one partition. Adding nodes does not help, because the key still lives on one node. Hot keys are the most common cause of a partial outage in a partitioned store.

## The idea with an example

A cache has 10 nodes and 100,000 reads per second. Spread evenly, each node serves 10,000 reads per second, well under its limit of 50,000.

Now a celebrity key takes 60 percent of traffic. That is 60,000 reads per second on one key, on one node. That node must serve 60,000 plus its share of the rest, 4,000, for 64,000 reads per second. It is over its limit. Its latency climbs, and the requests for every other key on that node slow down too. The other 9 nodes serve 4,000 each and idle.

The bars compare the load on the busiest node before and after each fix.

:::bars
title: Reads per second on the busiest cache node
unit: reads per second
Even spread: 10000
Hot key with no fix: 64000
Node limit: 50000
Salting into 10 copies: 10000
Local cache for 1 second: 4200
:::

Fix 1, local cache. Each application server keeps the hot value in its own memory for 1 second. With 200 application servers, the cache node sees at most 200 reads per second for that key. The cost is up to 1 second of staleness.

Fix 2, key salting. Store the value under 10 keys: "celeb:42:0" to "celeb:42:9". A reader picks a random suffix. Each copy lands on a different node by the hash. Each node sees 6,000 reads per second for its copy. A write must update all 10 copies.

Fix 3, for a hot counter. Each application server adds to a local counter and flushes the sum every 100 ms. 200 servers at 10 flushes per second is 2,000 writes per second on the key, instead of 60,000.

Press Next to apply each fix to the celebrity key.

:::scenario
title: One celebrity key on a 10-node cache
state: reads per second on key=60000, busiest node=64000, limit=50000, fix=none
step: 100,000 reads per second spread over 10 nodes is 10,000 each. Then one key takes 60 percent.
step: The node that owns the key serves 60,000 for that key plus 4,000 for the rest. It is over its limit.
step: Fix 1, each of 200 application servers caches the value for 1 second. The node sees at most 200 reads for the key.
state: reads per second on key=200, busiest node=4200, fix=local cache
step: Fix 2, store the value under 10 salted keys. Each node sees 6,000 reads for its copy. A write must update 10 copies.
state: reads per second on key=6000 per copy, busiest node=10000, fix=salting
step: Fix 3, for a hot counter, each server sums locally and flushes every 100 ms. The key sees 2,000 writes per second.
state: fix=aggregate then flush
:::

## How it works

Detect hot keys from per-partition metrics. Compare the request rate of the busiest partition with the average. A ratio above 3 is skew. Then sample requests on the busy partition and count keys. Redis has a built-in hot key scan in its command-line tool.

Key salting procedure:

1. Pick a number of copies $k$, from 10 to 100.
2. On write, write the value to all $k$ keys, with a suffix 0 to $k - 1$.
3. On read, pick a random suffix and read that key.
4. If a read misses, fall back to the base key or the database.

The diagram shows a write to all copies and a read from one copy.

:::flow
title: Key salting spreads one key over 10 nodes
Writer -> Copy 0: write celeb 42 suffix 0
Writer -> Copy 9: write celeb 42 suffix 9
Reader -> Random suffix: pick 0 to 9
Random suffix -> Copy 3: read one copy on its node
Copy 3 -> Reader: value
:::

The load per node drops from the full key rate $R$ to about $R / k$. The write cost rises from 1 to $k$ writes. Salting fits read-heavy keys.

For write-heavy keys, aggregate first. Each server holds partial counts in memory and flushes a sum on a timer. The store receives one write per server per interval. The count is delayed by the interval.

A local cache fits keys that change rarely and tolerate staleness. The Facebook memcache paper describes leases, which stop every server from refilling the same key at once when it expires.

| Pattern | Fix | Cost |
|---|---|---|
| Hot read, stale ok | Local cache | Staleness |
| Hot read, fresh needed | Salting | k writes per update |
| Hot write counter | Aggregate then flush | Delay |
| Hot write, must be exact | Single partition, size it up | Vertical limit |

Note: a hot key in a message queue has the same shape. One partition key for all events, for example one tenant id, fills one queue partition while others idle. Add a second key component, such as a session id.

## Common mistakes

- Mistake: add nodes to fix a hot key. Fix: the key still lives on one node, so split the key or cache it.
- Mistake: salt a write-heavy key. Fix: aggregate writes locally instead, because salting multiplies writes.
- Mistake: set the local cache time to live at 10 minutes. Fix: use 1 to 5 seconds, which cuts load by a large factor with little staleness.
- Mistake: find hot keys only after an incident. Fix: alert on the ratio of the busiest partition to the average.

## Check your understanding

- A key takes 80 percent of 50,000 reads per second. What load is on its node from that key alone? 40,000 reads per second.
- How does salting into 20 copies change the per-node read load for that key? It drops to about 2,000 reads per second per copy.
- Which fix suits a hot counter? Local aggregation with a periodic flush.

## Go further

The Facebook memcache paper describes leases and regional pools for hot keys at scale. The Amazon Builders Library article on caching covers hot keys and thundering herds. The Redis documentation covers its hot key tooling and client-side caching. ByteByteGo has videos on the celebrity problem in feed systems.
`,
        },
      ],
    },
    {
      slug: 'caching-and-queues',
      title: 'Caching and queues',
      description: 'Cache strategies, invalidation, log-based queues, and back-pressure.',
      lessons: [
        {
          slug: 'cache-strategies',
          title: 'Cache strategies',
          summary: 'A cache keeps hot data close, and the read and write strategy sets the hit rate and the staleness.',
          minutes: 14,
          objectives: [
            'Compute the average latency and the database load for a given cache hit rate.',
            'Describe cache-aside, read-through, write-through, and write-back.',
            'Choose an eviction policy and a cache size for a working set.',
            'Explain what a thundering herd is and one way to stop it.',
          ],
          keyTerms: ['cache', 'hit rate', 'cache-aside', 'write-through', 'write-back', 'eviction', 'time to live'],
          links: [
            { label: 'Redis documentation', url: 'https://redis.io/docs/latest/', kind: 'docs' },
            { label: 'Memcached', url: 'https://github.com/memcached/memcached', kind: 'repo' },
            { label: 'Amazon Builders Library: Caching challenges and strategies', url: 'https://aws.amazon.com/builders-library/caching-challenges-and-strategies/', kind: 'article' },
            { label: 'Scaling Memcache at Facebook (NSDI 2013)', url: 'https://www.usenix.org/conference/nsdi13/technical-sessions/presentation/nishtala', kind: 'paper' },
            { label: 'ByteByteGo on YouTube', url: 'https://www.youtube.com/@ByteByteGo', kind: 'video' },
          ],
          body: `
## What this lesson covers

A cache is a small fast store in front of a large slow one. This lesson shows how the hit rate sets both latency and database load. It then compares the four ways to keep the cache and the database in step.

## Why it matters

A database read costs 1 to 10 ms and a database handles a few thousand reads per second. A cache read costs 0.1 ms and a cache node handles 100,000 reads per second. A cache with a 95 percent hit rate cuts database load by 20 times. Almost every web service relies on this. The cache is also where stale data comes from, so the strategy matters.

## The idea with an example

A service serves 10,000 reads per second. A database read takes 5 ms. A cache read takes 0.2 ms.

With no cache, the database takes 10,000 reads per second and needs 5 replicas at 2,000 each.

With a cache at 90 percent hit rate, 9,000 reads hit the cache and 1,000 go to the database. The average latency is:

$$0.9 \\times 0.2 + 0.1 \\times (0.2 + 5) = 0.18 + 0.52 = 0.70 \\text{ ms}$$

The database load fell 10 times. One replica is enough.

Now raise the hit rate to 99 percent. The database sees 100 reads per second. The average latency is 0.25 ms. The step from 90 to 99 cut database load another 10 times.

The bars compare the database load at each hit rate.

:::bars
title: Database reads per second by hit rate
unit: reads per second
No cache: 10000
90 percent hit rate: 1000
99 percent hit rate: 100
:::

Now the cache node restarts. The hit rate is 0 for a few seconds. The database sees 10,000 reads per second with 1 replica. It fails. This is a cold cache. Plan for it with a warm-up or several cache nodes.

Press Next to follow the load and the latency through the example.

:::scenario
title: Database load and latency at each hit rate
state: hit rate=0 percent, database reads per second=10000, average latency=5 ms, replicas=5
step: With no cache, all 10,000 reads per second reach the database. It needs 5 replicas.
step: Add a cache with a 90 percent hit rate. 9,000 reads hit the cache and 1,000 reach the database.
state: hit rate=90 percent, database reads per second=1000, average latency=0.7 ms, replicas=1
step: Raise the hit rate to 99 percent. Only 100 reads per second reach the database.
state: hit rate=99 percent, database reads per second=100, average latency=0.25 ms
step: The cache node restarts. The hit rate falls to 0 for a few seconds.
state: hit rate=0 percent, database reads per second=10000, average latency=5 ms
step: One replica cannot serve 10,000 reads per second. The database fails. Plan for a cold cache.
:::

## How it works

Four strategies link the cache and the database:

| Strategy | Read | Write | Risk |
|---|---|---|---|
| Cache-aside | App checks cache, then DB, then fills cache | App writes DB, then deletes cache key | Stale window after write |
| Read-through | Cache fetches from DB on miss | Same as cache-aside | Same |
| Write-through | Same | App writes cache and DB together | Slower writes |
| Write-back | Same | App writes cache only, cache flushes later | Data loss on cache failure |

Cache-aside is the default. The read procedure is:

1. Get the key from the cache.
2. If found, return it.
3. If not found, read from the database.
4. Write the value to the cache with a time to live (TTL).
5. Return the value.

The diagram shows the cache-aside read on a miss.

:::flow
title: Cache-aside read on a miss
App -> Cache: get key
Cache -> App: miss
App -> Database: read row
Database -> App: value
App -> Cache: set key with a TTL
App -> Client: value
:::

The TTL is the time after which the cache drops the entry. A short TTL limits staleness. A long TTL raises the hit rate.

Eviction decides what to drop when the cache is full. Least recently used (LRU) drops the entry that was read longest ago. It fits most workloads. Least frequently used (LFU) fits workloads with a stable hot set and scan traffic that would flush an LRU cache.

Size the cache for the working set. The working set is the set of keys read in a window, for example the last hour. If 2 million keys of 1 KB are read per hour, the cache needs 2 GB plus overhead for a high hit rate.

A thundering herd happens when a popular key expires. Thousands of requests miss at once and all go to the database. Three fixes exist. A lease lets only the first miss fetch while the others wait. A stale-while-revalidate policy serves the old value during the refresh. A random TTL spread stops keys from expiring together.

Caution: a write-back cache that holds the only copy of a write loses it on a crash. Use it only for data you can rebuild.

## Common mistakes

- Mistake: cache every key with the same long TTL. Fix: set the TTL per key type from how stale the data may be.
- Mistake: size the cache from total data, not the working set. Fix: measure the keys read per hour and size for those.
- Mistake: run one cache node. Fix: run several with consistent hashing, so a restart loses a fraction of the hits.
- Mistake: let all keys expire at the same second after a deploy. Fix: add a random spread of 10 percent to each TTL.

## Check your understanding

- At 95 percent hit rate and 20,000 reads per second, how many reads reach the database? 1,000 per second.
- What does cache-aside do on a write? It writes the database and deletes the cache key.
- What is a thundering herd? Many requests miss on one key at once and all hit the database.

## Go further

The Redis and Memcached projects are the two standard caches, and the Redis documentation explains eviction policies and client-side caching. The Amazon Builders Library article covers TTL spread, thundering herds, and cold caches. The Facebook memcache paper explains leases and the architecture of a cache at very large scale. ByteByteGo has short videos on each cache strategy.
`,
        },
        {
          slug: 'cache-invalidation',
          title: 'Cache invalidation',
          summary: 'Invalidation removes a cache entry when the source changes, and the order of operations decides whether stale data survives.',
          minutes: 14,
          objectives: [
            'Explain why delete-after-write is safer than update-after-write.',
            'Trace a race between a read and a write that leaves a stale entry.',
            'Describe invalidation from a database change log.',
            'Choose between TTL, explicit invalidation, and versioned keys.',
          ],
          keyTerms: ['invalidation', 'stale read', 'race condition', 'change data capture', 'versioned key', 'time to live'],
          links: [
            { label: 'Scaling Memcache at Facebook (NSDI 2013)', url: 'https://www.usenix.org/conference/nsdi13/technical-sessions/presentation/nishtala', kind: 'paper' },
            { label: 'Debezium: change data capture platform', url: 'https://debezium.io/documentation/', kind: 'docs' },
            { label: 'Amazon Builders Library: Caching challenges and strategies', url: 'https://aws.amazon.com/builders-library/caching-challenges-and-strategies/', kind: 'article' },
            { label: 'Redis documentation', url: 'https://redis.io/docs/latest/', kind: 'docs' },
          ],
          body: `
## What this lesson covers

Invalidation is the removal or replacement of a cache entry after the source data changes. This lesson traces two races between readers and writers, shows which order of operations is safe, and explains invalidation from the database log.

## Why it matters

A stale cache entry shows a user an old price, an old balance, or a deleted post. The cause is almost never the cache software. It is the order of two operations from two clients that interleave. These races are rare per request and certain per day at 10,000 requests per second. Understanding them is the difference between a cache that is mostly right and one you can trust.

## The idea with an example

The database holds price = 10 for item 7. The cache has no entry.

Race 1, update the cache after the write. Writer 1 sets the price to 20 in the database. Writer 2 sets it to 30 in the database. Writer 2 writes 30 to the cache. Writer 1, which was slow, now writes 20 to the cache. The database says 30. The cache says 20. The cache is stale until the TTL expires.

Now use delete instead of update. Writer 1 writes 20 and deletes the cache key. Writer 2 writes 30 and deletes the cache key. The next reader misses, reads 30 from the database, and fills the cache. Correct. Order no longer matters, because a delete is the same whoever runs it last.

Press Next to run race 1 with update and then with delete.

:::scenario
title: Two writers, update the cache or delete the key
state: database=10, cache=empty, method=update
step: Writer 1 sets the price to 20 in the database. Writer 2 sets it to 30 right after.
state: database=30
step: Writer 2 writes 30 to the cache. Then the slow writer 1 writes 20 to the cache.
state: cache=20
step: The database says 30 and the cache says 20. The cache is stale until the TTL expires.
step: Now use delete instead. Writer 1 writes 20 and deletes the key. Writer 2 writes 30 and deletes the key.
state: cache=empty, method=delete
step: The next reader misses, reads 30 from the database, and fills the cache. Order no longer matters.
state: cache=30
:::

Race 2, a read during a write. A reader misses the cache and reads price = 10 from the database. Before it fills the cache, a writer sets the price to 20 and deletes the cache key. The delete finds nothing. The reader then fills the cache with 10. Stale.

The timeline shows the slow reader and the writer in race 2.

:::timeline
title: Race 2, a slow reader fills the cache after the delete
unit: ms
lane Reader
lane Writer
lane Cache
lane Database
Reader -> Cache: get item 7 @0-0.2
Cache -> Reader: miss @0.2-0.4
Reader -> Database: read price @0.4-1
Database -> Reader: price is 10 @1-1.5
Writer -> Database: set price to 20 @2-3
Writer -> Cache: delete item 7, nothing there @3-3.5
Reader: slow, a garbage collection pause @1.5-5
Reader -> Cache: set item 7 to 10, stale @5-5.5
:::

This race needs a slow reader between its database read and its cache fill. It is rare, but it happens. Two fixes exist. A short TTL acts as a safety net. A lease gives the reader a token on the miss, and the delete invalidates the token so the fill is rejected.

## How it works

Three invalidation methods exist, and most systems combine them.

TTL only. Every entry expires after a fixed time. Simple, no coordination, bounded staleness. A 60-second TTL means up to 60 seconds of stale data.

Explicit invalidation. The writer deletes the key after each write. Low staleness. Needs every write path to know every cache key that depends on the data.

Versioned keys. The key includes a version, such as "item:7:v12". A write increments the version in a small store, and readers build the new key. Old entries become unreachable and expire. No delete needed, no race between delete and fill.

The table compares the three methods.

| Method | Staleness | Coordination | Weak point |
|---|---|---|---|
| TTL only | Up to the TTL | None | Stale for the full TTL |
| Explicit delete | Milliseconds | Every write path | A missed write path |
| Versioned keys | Milliseconds | A version store | Old entries use memory until expiry |

The safe write procedure for cache-aside is:

1. Write the new value to the database.
2. Commit the transaction.
3. Delete the cache key.
4. If the delete fails, retry it from a queue.

The delete must come after the commit. If it comes before, a reader can refill the cache with the old value before the commit.

Change data capture (CDC) moves invalidation out of the application. A process reads the database write-ahead log and deletes the cache key for each changed row. Every write path is covered, even manual fixes. Facebook's McSqueal does this. Debezium is the open-source tool. The delay is the lag of the log reader, usually under one second.

The bars compare the worst-case staleness of two methods.

:::bars
title: Worst-case staleness
unit: seconds
TTL of 60 seconds only: 60
Change data capture: 1
:::

Caution: a cache in a second region cannot be invalidated at the same instant. Writes in region A reach the cache in region B after the replication lag. Route writes and the reads right after them to the leader region.

## Common mistakes

- Mistake: update the cache value after a write. Fix: delete the key, because two updates can land in the wrong order.
- Mistake: delete the cache key before the database commit. Fix: delete after the commit, or a reader refills with the old value.
- Mistake: rely on explicit invalidation alone. Fix: keep a TTL as a safety net, because some write path will be missed.
- Mistake: ignore a failed delete. Fix: retry it from a durable queue, because a lost delete means a stale entry for the full TTL.

## Check your understanding

- Why is delete safer than update after a write? Two deletes in any order leave the same result, but two updates do not.
- What is the safety net for a missed invalidation? A TTL on every entry.
- What does change data capture read? The database write-ahead log.

## Go further

The Facebook memcache paper describes leases and McSqueal, which invalidates from the database log. The Debezium documentation shows how to set up change data capture on common databases. The Amazon Builders Library article covers invalidation races and staleness budgets. The Redis documentation covers key expiry and client-side cache invalidation.
`,
        },
        {
          slug: 'log-based-queues',
          title: 'Log-based message queues',
          summary: 'A Kafka-style queue is an append-only log split into partitions, and consumers track their own offsets.',
          minutes: 15,
          objectives: [
            'Describe topics, partitions, offsets, and consumer groups.',
            'Compute the number of partitions needed for a target throughput and consumer count.',
            'Explain at-least-once delivery and why consumers must be idempotent.',
            'Explain how ordering is guaranteed within a partition and not across partitions.',
          ],
          keyTerms: ['message queue', 'topic', 'partition', 'offset', 'consumer group', 'at-least-once', 'idempotent'],
          links: [
            { label: 'Apache Kafka documentation', url: 'https://kafka.apache.org/documentation/', kind: 'docs' },
            { label: 'Apache Kafka documentation: Design', url: 'https://kafka.apache.org/documentation/#design', kind: 'docs' },
            { label: 'Redpanda documentation', url: 'https://docs.redpanda.com/', kind: 'docs' },
            { label: 'Hussein Nasser on YouTube', url: 'https://www.youtube.com/@hnasr', kind: 'video' },
            { label: 'ByteByteGo on YouTube', url: 'https://www.youtube.com/@ByteByteGo', kind: 'video' },
          ],
          body: `
## What this lesson covers

A message queue moves events from producers to consumers without a direct call between them. A log-based queue, such as Apache Kafka, stores events in an append-only log that consumers read at their own pace. This lesson explains partitions, offsets, consumer groups, and delivery guarantees with a sized example.

## Why it matters

A queue lets a slow consumer fall behind without the producer failing. It lets several consumers read the same events for different purposes. It also records events for replay. Order processing, metrics pipelines, change data capture, and LLM training data pipelines all run on a log-based queue.

## The idea with an example

An order service produces 10,000 events per second. Each event is 1 KB. A consumer, the invoice service, processes 2,000 events per second per instance.

Step 1, pick the partition count. The topic "orders" needs enough partitions for the consumers. 10,000 / 2,000 = 5 consumers at minimum. Each partition is read by one consumer in a group, so 5 partitions is the minimum. Pick 12, so you can add consumers later.

Step 2, produce. The producer hashes the order id to pick a partition. Order 501 hashes to partition 3. The broker appends the event at the end of partition 3 and assigns it an offset, for example 88,210. The offset is the position in the partition.

Step 3, consume. The invoice service runs 6 instances in a consumer group. The broker assigns 2 partitions to each. Instance 2 reads partition 3 from its last committed offset, 88,200. It processes 10 events, up to 88,210, and commits offset 88,210.

The diagram shows the path of order 501 from the producer to the committed offset.

:::flow
title: Orders topic with 12 partitions and 6 consumers
Order service -> Partitioner: order 501
Partitioner -> Partition 3: hash of order id mod 12
Partition 3 -> Instance 2: events from offset 88,200
Instance 2 -> Invoice store: 10 invoices
Instance 2 -> Offset store: commit 88,210
:::

Step 4, crash. Instance 2 crashes after processing 88,205 but before the commit. The broker gives partition 3 to instance 4. It starts from 88,200. Events 88,200 to 88,205 are processed again. This is at-least-once delivery.

Press Next to follow the offsets through the crash.

:::scenario
title: Offsets, a crash, and at-least-once delivery
state: partition 3 end=88210, committed offset=88200, processed by=none, repeats=0
step: The producer appends order 501 to partition 3. It gets offset 88,210.
step: Instance 2 reads from the committed offset 88,200 and processes 10 events up to 88,210.
state: processed by=instance 2 up to 88205
step: Instance 2 crashes after 88,205 and before the commit. The committed offset is still 88,200.
step: The broker gives partition 3 to instance 4. It starts from 88,200.
state: processed by=instance 4 from 88200
step: Events 88,200 to 88,205 are processed a second time. The consumer must be idempotent.
state: repeats=6, committed offset=88210
:::

Step 5, retention. The topic keeps 7 days. 10,000 events per second times 1 KB is 10 MB per second, 864 GB per day, 6 TB per week. With replication factor 3, that is 18 TB of disk across the brokers.

The bars compare the storage for one day, one week, and one week with replication.

:::bars
title: Storage for the orders topic
unit: TB
One day: 0.86
One week: 6
One week with 3 replicas: 18
:::

## How it works

A topic is a named stream. A partition is one append-only file of the topic. The broker writes each event once and never changes it. Each partition has a leader broker and follower replicas, as in the replication module. A producer waits for acknowledgement from the leader only, or from all in-sync replicas, by setting acks.

A consumer group is a set of instances that share the partitions of a topic. Each partition goes to exactly one instance in the group. Two groups read the same topic independently. The offset is stored per group and per partition.

The throughput sizing procedure is:

1. Measure events per second and bytes per event.
2. Measure events per second one consumer instance can handle.
3. Divide to get the minimum consumer count.
4. Set the partition count to 2 or 3 times that, because partitions can be added but not removed.
5. Confirm each partition stays under about 10 MB per second.

Ordering holds within one partition. Events for order 501 all go to partition 3 and stay in order. Events across partitions have no order. If you need all events for a user in order, use the user id as the partition key.

At-least-once means no event is lost but some are repeated. The consumer must be idempotent: processing an event twice has the same effect as once. Store the event id with the result, and skip an id you have seen. At-most-once commits the offset before processing and can lose events. Exactly-once in Kafka uses transactions between the consumer offset and the producer output, and works within Kafka only.

The table compares the three delivery guarantees.

| Guarantee | Offset commit | Risk | Consumer rule |
|---|---|---|---|
| At-most-once | Before processing | Lost events | None |
| At-least-once | After processing | Repeated events | Skip seen event ids |
| Exactly-once | In a transaction with the output | Works inside Kafka only | Use Kafka transactions |

Note: a message queue in the style of RabbitMQ deletes a message once a consumer acknowledges it. A log keeps it until retention expires. The log lets you add a new consumer that reads from the start.

## Common mistakes

- Mistake: use one partition for ordering of everything. Fix: partition by the key that needs order, such as a user id.
- Mistake: run more consumer instances than partitions. Fix: the extra instances idle, so add partitions first.
- Mistake: assume each event is delivered once. Fix: make the consumer idempotent with an event id check.
- Mistake: commit the offset before processing. Fix: process, then commit, and accept repeats over losses.

## Check your understanding

- What is an offset? The position of an event in a partition.
- How many consumer instances in one group can read one partition? One.
- What must a consumer do under at-least-once delivery? Handle repeated events without a wrong result.

## Go further

The Kafka documentation is complete and the design section explains the log, the offsets, and the delivery guarantees. The Redpanda documentation covers the same protocol with a different broker. Hussein Nasser has long videos on Kafka internals, and ByteByteGo has short ones on queues and message ordering.
`,
        },
        {
          slug: 'back-pressure',
          title: 'Back-pressure',
          summary: 'Back-pressure slows a fast producer to the speed of a slow consumer instead of letting a queue grow without limit.',
          minutes: 13,
          objectives: [
            'Compute how fast an unbounded queue grows when the producer is faster than the consumer.',
            'Describe three ways to apply back-pressure: bounded queues, credits, and rate limits.',
            'Explain why dropping or rejecting work is sometimes correct.',
            'Trace back-pressure through a chain of three services.',
          ],
          keyTerms: ['back-pressure', 'bounded queue', 'credit-based flow control', 'rate limit', 'consumer lag', 'overload'],
          links: [
            { label: 'Reactive Streams specification', url: 'https://www.reactive-streams.org/', kind: 'docs' },
            { label: 'Google SRE Book: Handling Overload', url: 'https://sre.google/sre-book/handling-overload/', kind: 'docs' },
            { label: 'Apache Kafka documentation', url: 'https://kafka.apache.org/documentation/', kind: 'docs' },
            { label: 'gRPC documentation: Flow control and performance', url: 'https://grpc.io/docs/guides/performance/', kind: 'docs' },
            { label: 'Hussein Nasser on YouTube', url: 'https://www.youtube.com/@hnasr', kind: 'video' },
          ],
          body: `
## What this lesson covers

Back-pressure is a signal from a slow consumer to a fast producer to slow down. Without it, a queue between them grows until memory or disk runs out. This lesson shows the growth with numbers and the three ways to apply the signal.

## Why it matters

Every pipeline has a slowest stage. When traffic rises, that stage falls behind. If nothing stops the stages before it, the queue absorbs the gap and hides the problem. Then the queue fills, the process crashes, and every queued item is lost. Back-pressure makes the problem visible at the source and keeps the system within its limits.

## The idea with an example

A producer sends 1,000 events per second into an unbounded in-memory queue. A consumer processes 800 per second. Each event is 2 KB.

The queue grows by 200 events per second. After 1 minute, 12,000 events, 24 MB. After 1 hour, 720,000 events, 1.4 GB. After 6 hours, 8.6 GB, and a process with 8 GB of memory dies. Every event in the queue is lost. The consumer also processes events that are 6 hours old, which may be useless.

The bars compare the queue memory over time with the bounded case.

:::bars
title: Memory held by the queue
unit: MB
After 1 minute: 24
After 1 hour: 1400
After 6 hours: 8600
Bounded at 10,000 events: 20
:::

Now bound the queue at 10,000 events. After 50 seconds the queue is full. The producer's next put call blocks. The producer slows to 800 per second, the consumer's rate. The latency through the queue is 10,000 / 800 = 12.5 seconds, and stays there. Nothing crashes.

But the producer is a web server. Blocked puts mean blocked requests. The web server now holds 200 extra requests per second in flight. Its own thread pool fills. It starts to reject requests with a 503 error. The back-pressure reached the user, which is the right place for it. The user sees a clear error instead of a 6-hour delay.

Press Next to follow the queue with and without a bound.

:::scenario
title: A queue between a 1,000 per second producer and an 800 per second consumer
state: queue=unbounded, depth=0, memory=0 MB, delay=0 s
step: The queue grows by 200 events per second. After 1 minute it holds 12,000 events, 24 MB.
state: depth=12000, memory=24 MB, delay=15 s
step: After 1 hour it holds 720,000 events, 1.4 GB. The consumer works on events that are 15 minutes old.
state: depth=720000, memory=1400 MB, delay=900 s
step: After 6 hours the process with 8 GB of memory dies. Every queued event is lost.
state: depth=0, memory=crashed, delay=lost
step: Now bound the queue at 10,000 events. After 50 seconds it is full and the next put blocks.
state: queue=bounded at 10000, depth=10000, memory=20 MB, delay=12.5 s
step: The producer slows to 800 per second. The web server fills its thread pool and returns 503 to some users.
state: producer rate=800 per second, user sees=503 on some requests
:::

## How it works

Three mechanisms carry the signal:

- Bounded queue. A put on a full queue blocks or fails. This is the simplest and works inside one process.
- Credit-based flow control. The consumer sends the producer a number of credits, for example 100. The producer sends at most 100 items, then waits for more credits. TCP, HTTP/2, gRPC, and the Reactive Streams standard all work this way.
- Rate limit. The producer sends at most a fixed rate. It does not react to the consumer, so it is a static form of back-pressure.

The table compares the three mechanisms.

| Mechanism | Who decides | Reacts to the consumer | Used by |
|---|---|---|---|
| Bounded queue | The queue | Yes | One process |
| Credits | The consumer | Yes | TCP, HTTP/2, gRPC, Reactive Streams |
| Rate limit | The producer | No | Static quotas |

The procedure to add back-pressure to a pipeline is:

1. Find the slowest stage by measuring the throughput of each one.
2. Bound every queue. Pick a size from the latency you can accept: size equals rate times maximum delay.
3. At the entry of the system, decide what to do when the first queue is full: block, reject, or drop.
4. Alert on queue depth, not only on failures.

The choice at step 3 depends on the data. Reject a user request with an error, so the user can retry. Drop a metric sample, because the next one arrives in a second. Block a batch job, because it has no deadline.

The diagram shows the signal as it travels from the slowest stage to the user.

:::flow
title: Back-pressure travels from the slowest stage to the user
Consumer -> Queue: full, stop accepting
Queue -> Web server: put blocks
Web server -> Thread pool: 200 extra requests in flight
Thread pool -> Load balancer: pool full, reject with 503
Load balancer -> User: clear error, retry later
:::

With a log-based queue like Kafka, the broker stores the backlog on disk, so the producer does not block. The signal is consumer lag, the number of events between the newest offset and the committed offset. Alert when lag rises for more than a few minutes. Then add consumers or slow the producer.

Caution: an unbounded retry queue is the most common hidden unbounded queue. A failing downstream service makes every retry fail, and the queue grows until the process dies.

## Common mistakes

- Mistake: use an unbounded queue to "absorb bursts". Fix: bound it, because a burst that outlasts the bound is an overload and must be visible.
- Mistake: bound the queue but never alert on its depth. Fix: alert at 50 percent depth, because a full queue is already a user-visible failure.
- Mistake: apply back-pressure in the middle and not at the edge. Fix: carry the signal to the entry point, where a reject is cheap and clear.
- Mistake: add consumers to fix lag without checking the downstream database. Fix: find the real slowest stage, which may be the database the consumers write to.

## Check your understanding

- A producer sends 500 per second and a consumer handles 300. How fast does an unbounded queue grow? 200 items per second.
- What is a credit in flow control? Permission from the consumer to send a fixed number of items.
- What is consumer lag in a log-based queue? The number of events between the newest offset and the consumer's committed offset.

## Go further

The Reactive Streams specification defines credit-based back-pressure in four interfaces and is short. The Google SRE book chapter on overload explains how to reject work at the edge. The Kafka documentation describes consumer lag and monitoring. The gRPC performance guide covers HTTP/2 flow control. Hussein Nasser explains TCP flow control, the oldest form of back-pressure, on YouTube.
`,
        },
      ],
    },
    {
      slug: 'reliability',
      title: 'Reliability',
      description: 'Timeouts, retries, circuit breakers, load shedding, and the latency tail.',
      lessons: [
        {
          slug: 'timeouts-and-retries',
          title: 'Timeouts and retries',
          summary: 'A timeout bounds how long a call waits, and a retry with backoff and jitter recovers from short failures without a storm.',
          minutes: 14,
          objectives: [
            'Choose a timeout from the latency percentiles of the callee.',
            'Compute the success rate after retries for a given per-call failure rate.',
            'Compute the load amplification that retries cause in a chain of services.',
            'Apply exponential backoff with jitter and a retry budget.',
          ],
          keyTerms: ['timeout', 'retry', 'exponential backoff', 'jitter', 'retry storm', 'retry budget', 'idempotent'],
          links: [
            { label: 'Amazon Builders Library: Timeouts, retries, and backoff with jitter', url: 'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/', kind: 'article' },
            { label: 'AWS Architecture Blog: Exponential Backoff And Jitter', url: 'https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/', kind: 'article' },
            { label: 'gRPC documentation: Deadlines', url: 'https://grpc.io/docs/guides/deadlines/', kind: 'docs' },
            { label: 'Google SRE Book: Addressing Cascading Failures', url: 'https://sre.google/sre-book/addressing-cascading-failures/', kind: 'docs' },
          ],
          body: `
## What this lesson covers

A timeout is the maximum time a caller waits for a reply. A retry is a second attempt after a failure. Both are simple, and both cause outages when set wrong. This lesson gives the arithmetic for each and a procedure to set them.

## Why it matters

A call with no timeout holds a thread for as long as the callee is stuck. Enough stuck threads and the caller is down too. Retries without limits turn a small failure into a flood: every failed call becomes 3 calls, and the callee that was slow is now overloaded. This pattern, the retry storm, is behind a large share of cascading failures.

## The idea with an example

Service A calls service B. B has a p99 latency of 200 ms and a p99.9 of 800 ms. A sets a timeout of 1 second. Fewer than 0.1 percent of healthy calls time out.

Now B fails 10 percent of calls for a minute. A retries each failed call up to 2 more times. The chance that all 3 attempts fail is $0.1^3 = 0.001$. The success rate rises from 90 percent to 99.9 percent. Retries work.

Now look at the load. A sends 1,000 calls per second. With 10 percent failures and 2 retries, the extra calls are 1,000 × (0.1 + 0.01) = 110 per second. B sees 1,110 calls per second, 11 percent more. Fine.

Now B is not failing 10 percent. B is overloaded and failing 80 percent. Extra calls: 1,000 × (0.8 + 0.64) = 1,440. B sees 2,440 calls per second, 2.4 times its normal load, while it is already overloaded. The retries make B worse. B never recovers while the retries continue.

Press Next to follow the load on B as the failure rate rises.

:::scenario
title: Load on B as the failure rate rises
state: calls from A=1000 per second, failure rate=10 percent, retries=up to 2, load on B=1000 per second
step: B fails 10 percent of calls. The chance that all 3 attempts fail is 0.001. Success rises to 99.9 percent.
state: success rate=99.9 percent
step: Extra calls are 1,000 times 0.1 plus 0.01, which is 110 per second. B sees 1,110 calls per second.
state: load on B=1110 per second
step: Now B is overloaded and fails 80 percent. Extra calls are 1,000 times 0.8 plus 0.64, which is 1,440.
state: failure rate=80 percent, load on B=2440 per second
step: B sees 2.4 times its normal load while it is already overloaded. It never recovers.
step: A 10 percent retry budget caps extra calls at 100 per second. B sees at most 1,100 and can recover.
state: retries=10 percent budget, load on B=1100 per second
:::

The bars compare the load on B in each case.

:::bars
title: Calls per second that reach B
unit: calls per second
Normal: 1000
10 percent failures, 2 retries: 1110
80 percent failures, 2 retries: 2440
80 percent failures, 10 percent retry budget: 1100
:::

Add a chain. C calls A, which calls B. C also retries 3 times. On a failure in B, C's 3 attempts each cause 3 attempts from A. B sees 9 calls for 1 original. With 4 levels, 81 calls. This is the amplification that takes a system down.

The timeline shows the retry storm in the chain for one user request.

:::timeline
title: Retry storm in a chain, C calls A and A calls B
unit: s
lane C
lane A
lane B
C -> A: attempt 1 @0-0.05
A -> B: attempt 1 @0.05-0.1
B: overloaded, times out @0.1-1.1
A -> B: retry 1 @1.2-1.25
B: times out @1.25-2.25
A -> B: retry 2 @2.4-2.45
B: times out @2.45-3.45
A -> C: failure after 3 calls to B @3.5-3.55
C -> A: retry 1, which causes 3 more calls to B @3.6-3.65
:::

## How it works

Set the timeout from the callee's measured latency:

1. Measure the callee's p99.9 latency over a week.
2. Set the timeout slightly above it, so under 0.1 percent of good calls time out.
3. Make sure the sum of timeouts along a chain is less than the user-facing timeout.
4. Pass a deadline with the request, so each hop knows how much time remains.

Exponential backoff spaces the retries out. The wait before attempt $n$ is:

$$t_n = \\min(\\text{cap}, \\; \\text{base} \\times 2^n)$$

Here base is the first wait, for example 100 ms, cap is the maximum wait, for example 10 seconds, and $n$ is the attempt number starting at 0. Waits: 100 ms, 200 ms, 400 ms, 800 ms.

Jitter adds randomness. Without it, 1,000 clients that failed at the same instant all retry at the same instant. Full jitter picks a random wait between 0 and $t_n$. This spreads the retries evenly.

The table gives the wait before each attempt with base 100 ms.

| Attempt | Wait without jitter | Wait with full jitter |
|---|---|---|
| 0 | 100 ms | 0 to 100 ms |
| 1 | 200 ms | 0 to 200 ms |
| 2 | 400 ms | 0 to 400 ms |
| 3 | 800 ms | 0 to 800 ms |

A retry budget caps retries as a fraction of the normal traffic. A common budget is 10 percent: retries may add at most 10 percent to the call rate. Above that, failed calls are not retried. The amplification in the chain above becomes at most 1.1 per level, 1.46 over 4 levels, instead of 81.

The bars compare the amplification over 4 levels with and without a budget.

:::bars
title: Calls that reach B for one user request over 4 levels
unit: calls
No retries: 1
3 attempts per level: 81
10 percent retry budget per level: 1.46
:::

Retry only idempotent calls. An idempotent call has the same effect when run twice. A read is idempotent. A "create order" call is not, unless it carries a unique request id that the callee checks.

Retry only at one level of the chain, usually the one nearest the user. Lower levels should fail fast and let the top level decide.

## Common mistakes

- Mistake: set the timeout equal to the mean latency. Fix: set it above the p99.9, or you cancel good calls and retry them.
- Mistake: retry at every level of a call chain. Fix: retry at one level and fail fast below it.
- Mistake: retry with a fixed interval. Fix: use exponential backoff with full jitter.
- Mistake: retry a non-idempotent write. Fix: add a request id so the callee can detect a repeat, or do not retry.

## Check your understanding

- A call fails 5 percent of the time. What is the failure rate with 1 retry? 0.25 percent.
- Why add jitter to backoff? So clients that failed together do not retry together.
- What does a 10 percent retry budget do? It caps retries at 10 percent of the normal call rate.

## Go further

The Amazon Builders Library article is the clearest practical guide to timeouts, retries, and jitter. The AWS architecture blog post shows the simulations that compare jitter strategies. The gRPC deadlines guide explains how to propagate a deadline through a chain. The Google SRE book chapter on cascading failures shows the retry storms in real incidents. The /labs/timeout-architect lab lets you set per-hop timeouts and see the tail of the chain.
`,
        },
        {
          slug: 'circuit-breakers',
          title: 'Circuit breakers',
          summary: 'A circuit breaker stops calls to a failing dependency for a short time, so the caller fails fast and the callee can recover.',
          minutes: 13,
          objectives: [
            'Describe the closed, open, and half-open states and the transitions between them.',
            'Choose a failure threshold and an open duration from measured numbers.',
            'Explain what a fallback is and give three kinds.',
            'Compare a circuit breaker with a retry budget and with a bulkhead.',
          ],
          keyTerms: ['circuit breaker', 'fail fast', 'half-open', 'fallback', 'bulkhead', 'cascading failure'],
          links: [
            { label: 'Resilience4j', url: 'https://github.com/resilience4j/resilience4j', kind: 'repo' },
            { label: 'Netflix Hystrix (archived, with the design wiki)', url: 'https://github.com/Netflix/Hystrix', kind: 'repo' },
            { label: 'Envoy proxy documentation', url: 'https://www.envoyproxy.io/docs/envoy/latest/', kind: 'docs' },
            { label: 'Google SRE Book: Addressing Cascading Failures', url: 'https://sre.google/sre-book/addressing-cascading-failures/', kind: 'docs' },
          ],
          body: `
## What this lesson covers

A circuit breaker is a switch in front of a call to a dependency. When the dependency fails often, the switch opens and the caller fails at once without making the call. After a wait, the switch lets a few calls through to test the dependency. This lesson shows the three states with numbers.

## Why it matters

When a dependency is down, each call waits for the full timeout before it fails. One second per call, hundreds of calls per second, and the caller's thread pool is full of waiting threads. The caller is now down too, and its callers follow. A circuit breaker turns a 1-second failure into a 1-microsecond failure. The caller stays up and can serve a fallback.

## The idea with an example

Service A calls a recommendation service R 500 times per second with a 1-second timeout. A has 200 worker threads.

R goes down. Every call waits 1 second and fails. By Little's law, A has 500 × 1 = 500 calls in flight. A has 200 threads. The threads fill within 0.4 seconds. A stops serving every request, including those that do not need R.

The bars compare the threads that R can block under each setting.

:::bars
title: Threads blocked on R one second after R fails
unit: threads
Calls in flight by Little's law: 500
Threads that A has: 200
Bulkhead for R: 20
Breaker open: 0
:::

Now add a circuit breaker with a window of 100 calls, a failure threshold of 50 percent, and an open duration of 30 seconds.

Closed state. Calls go through. The breaker counts results over the last 100 calls.

Second 1. R fails. The first 100 calls fail. The failure rate is 100 percent, above 50. The breaker opens.

Open state. For 30 seconds, every call to R fails at once with a "circuit open" error. A serves a fallback: a static list of popular items. A's threads are free. A serves all other requests at full speed.

Second 31. The breaker goes half-open. It lets 10 calls through. If 10 succeed, it closes. If any fail, it opens again for another 30 seconds.

Second 31, R is still down. 10 calls fail. Open again. R sees 10 calls every 30 seconds from A, instead of 500 per second. R has room to recover.

Second 91. R is back. 10 calls succeed. The breaker closes. Traffic returns to normal.

Press Next to follow the breaker through its states.

:::scenario
title: Breaker with a 100-call window, 50 percent threshold, 30 second open time
state: state=closed, failures in window=0 of 100, calls to R per second=500, fallback=off
step: R goes down. The first 100 calls fail. The failure rate is 100 percent, above 50.
state: failures in window=100 of 100
step: The breaker opens. Every call fails at once with a circuit open error. A serves the popular items list.
state: state=open, calls to R per second=0, fallback=on
step: After 30 seconds the breaker goes half-open and lets 10 calls through.
state: state=half-open, calls to R per second=10 per 30 s
step: R is still down. The 10 calls fail. The breaker opens again for 30 seconds.
state: state=open
step: At second 91 R is back. 10 probe calls succeed. The breaker closes and traffic returns to 500 per second.
state: state=closed, failures in window=0 of 100, calls to R per second=500, fallback=off
:::

## How it works

The breaker has three states:

| State | Calls | Transition |
|---|---|---|
| Closed | All pass | Opens when failures in the window pass the threshold |
| Open | All fail fast | Goes half-open after the open duration |
| Half-open | A few pass | Closes on success, reopens on failure |

The diagram shows the transitions between the states.

:::flow
title: The three breaker states
Closed -> Open: failures above 50 percent of the window
Open -> Half-open: after 30 seconds
Half-open -> Closed: 10 probe calls succeed
Half-open -> Open: any probe call fails
:::

The procedure to set the numbers is:

1. Pick a window of 50 to 200 calls, or 10 to 60 seconds. A small window reacts fast but trips on noise.
2. Pick a failure threshold of 50 percent for a non-critical dependency, higher for a critical one.
3. Count timeouts and 5xx errors as failures. Do not count 4xx errors, because they are the caller's fault.
4. Pick an open duration of 10 to 60 seconds. Longer durations give the dependency more time to recover.
5. Pick a half-open probe count of 5 to 10 calls.

A fallback is what the caller returns when the breaker is open. Three kinds:

- A cached value from the last success.
- A static default, such as a popular-items list or an empty section.
- A degraded path, such as a simpler model or a smaller result.

A bulkhead is a related pattern. It gives each dependency its own thread pool or connection pool, so a stuck dependency fills only its own pool. In the example, a bulkhead of 20 threads for R would have left 180 threads for everything else, even without a breaker. Use both.

A retry budget limits extra load. A breaker removes load. The budget acts per call. The breaker acts per dependency.

## Common mistakes

- Mistake: count client errors as failures. Fix: count only timeouts and server errors, or a bad request from one user opens the breaker for all.
- Mistake: set the open duration to 1 second. Fix: use 10 seconds or more, or the breaker flaps and the dependency gets no rest.
- Mistake: open a breaker with no fallback. Fix: define the fallback first, because an open breaker with no fallback is only a faster error.
- Mistake: share one breaker across all dependencies. Fix: one breaker per dependency, and ideally per endpoint.

## Check your understanding

- What does the open state do? It fails every call at once without calling the dependency.
- What is the purpose of the half-open state? To test the dependency with a few calls before full traffic returns.
- How does a bulkhead differ from a breaker? A bulkhead limits the threads one dependency can hold; a breaker stops calls when failures are high.

## Go further

Resilience4j is the standard Java library and its documentation explains every setting. The archived Hystrix repository has the original design wiki with the state diagram. The Envoy documentation shows circuit breaking and outlier detection at the proxy level. The Google SRE book chapter on cascading failures shows what happens without these patterns. The /labs/agent-control-room lab lets you chain fallbacks and see the reliability of the whole chain.
`,
        },
        {
          slug: 'load-shedding',
          title: 'Load shedding and admission control',
          summary: 'Load shedding rejects some requests at the door so that the rest finish within their deadline.',
          minutes: 13,
          objectives: [
            'Explain why a server that accepts every request serves none of them under overload.',
            'Compute the useful throughput with and without shedding at a given overload.',
            'Choose a shedding signal: queue depth, concurrency, or CPU.',
            'Apply priority so that cheap and important requests survive.',
          ],
          keyTerms: ['load shedding', 'admission control', 'overload', 'goodput', 'priority', 'concurrency limit'],
          links: [
            { label: 'Amazon Builders Library: Using load shedding to avoid overload', url: 'https://aws.amazon.com/builders-library/using-load-shedding-to-avoid-overload/', kind: 'article' },
            { label: 'Google SRE Book: Handling Overload', url: 'https://sre.google/sre-book/handling-overload/', kind: 'docs' },
            { label: 'Netflix concurrency-limits library', url: 'https://github.com/Netflix/concurrency-limits', kind: 'repo' },
            { label: 'Envoy proxy documentation', url: 'https://www.envoyproxy.io/docs/envoy/latest/', kind: 'docs' },
          ],
          body: `
## What this lesson covers

Load shedding is the rejection of some requests when a server has more work than it can finish in time. This lesson shows why a server that accepts everything can end up with zero useful output, and how to pick the shedding rule.

## Why it matters

Overload does not degrade a server a little. It collapses it. Past the limit, every request waits in a queue, every request passes its deadline, and the server does the work for nothing. Goodput, the rate of requests that complete in time, drops to zero while the CPU is at 100 percent. Shedding keeps goodput at the server's capacity no matter how high the offered load.

## The idea with an example

A server completes 1,000 requests per second at most. Each request takes 1 ms of CPU. Clients give up after 1 second.

Offered load rises to 2,000 per second. The server accepts all of them. The queue grows by 1,000 per second. After 1 second, the queue holds 1,000 requests and the wait is 1 second. After 2 seconds, 2 seconds. Every request now waits longer than the client timeout. The client gives up, but the server still processes the request when its turn comes, 3 seconds later. The server works at 1,000 per second on requests nobody wants. Goodput is zero.

Now add shedding. The server accepts at most 100 requests in its queue. The 101st is rejected at once with a 503 error. The queue wait is at most 100 ms. Every accepted request finishes in time. The server completes 1,000 useful requests per second and rejects 1,000 per second in a few microseconds each. Goodput is 1,000. Half the clients get a fast error and can retry later, with backoff.

The bars compare the goodput with and without shedding.

:::bars
title: Goodput at 2,000 offered requests per second
unit: requests per second
Capacity: 1000
No shedding, after 2 seconds: 0
Shedding above 100 queued: 1000
:::

Now add priority. The 2,000 requests are 1,500 feed reads and 500 payments. The server sheds feed reads first. All 500 payments and 500 feed reads complete. The users who lose are the ones who lose least.

Press Next to follow the goodput through the example.

:::scenario
title: Goodput at 2,000 offered on a 1,000 per second server
state: offered=2000 per second, queue limit=none, queue wait=0 s, goodput=1000 per second
step: The server accepts everything. The queue grows by 1,000 requests per second.
state: queue wait=1 s
step: After 2 seconds the wait is 2 seconds. Every request passes the 1 second client timeout.
state: queue wait=2 s, goodput=0
step: The server still processes abandoned requests at 1,000 per second. The CPU is at 100 percent for nothing.
step: Now cap the queue at 100. The 101st request gets a 503 at once. The wait is at most 100 ms.
state: queue limit=100, queue wait=0.1 s, goodput=1000 per second, rejected=1000 per second
step: Add priority. Shed feed reads first. All 500 payments and 500 feed reads complete.
state: payments done=500 per second, feed reads done=500 per second
:::

## How it works

Three signals tell a server it is overloaded:

- Queue depth or queue wait time. The most direct. Shed when the wait exceeds a fraction of the deadline.
- Concurrency. The number of requests in progress. By Little's law, it equals rate times latency, so it rises as soon as latency rises. Netflix's concurrency-limits library adapts the limit from measured latency.
- CPU or memory use. Slow to react and hard to map to requests. Use as a backup.

The table compares the three signals.

| Signal | Reaction speed | Maps to requests | Use |
|---|---|---|---|
| Queue wait time | Fast | Direct | Primary |
| Concurrency | Fast | By Little's law | Primary, adaptive |
| CPU or memory | Slow | Indirect | Backup |

The procedure to add shedding is:

1. Measure the capacity $C$ in requests per second, from a load test.
2. Set a concurrency limit of $C \\times W$, where $W$ is the target latency, with 20 percent headroom.
3. Reject requests above the limit with a clear code, such as 503 and a retry-after header.
4. Assign each request a priority class. Shed the lowest class first.
5. Make the reject path cheap: no logging per request, no database call.

The diagram shows the accept path and the reject path at the door of the server.

:::flow
title: Admission control at the door of a server
Client -> Load balancer: 2,000 requests per second
Load balancer -> Admission check: priority header
Admission check -> Queue: accept while under 100 queued
Admission check -> Client: 503 with retry-after, microseconds
Queue -> Worker: 1,000 per second, 1 ms each
Worker -> Client: reply within 100 ms
:::

Goodput under overload with shedding stays near:

$$G = \\min(\\lambda, C)$$

Here $G$ is goodput, $\\lambda$ is offered load, and $C$ is capacity. Without shedding, $G$ falls toward zero once $\\lambda > C$ for longer than the deadline.

Shed early in the chain. A reject at the load balancer costs nothing. A reject after the database call wasted the whole request. Pass the priority in a header so every hop sheds the same classes.

Health checks and retries from clients must count as load. Serve the health check from the shedding path too, or the load balancer sends more traffic to the most overloaded server.

Caution: a server that sheds 50 percent of traffic looks broken on a dashboard. Record shed requests as a separate metric, not as errors, and make the alert say "overload".

## Common mistakes

- Mistake: accept every request and let the queue grow. Fix: bound the queue, because an unbounded queue drives goodput to zero.
- Mistake: shed with an expensive reject path. Fix: reject before any logging or parsing, in microseconds.
- Mistake: shed at random. Fix: shed by priority class, so payments survive and prefetches do not.
- Mistake: shed only at the deepest service. Fix: shed at the edge, where a reject costs the least work.

## Check your understanding

- What is goodput? The rate of requests that complete within their deadline.
- Why does a 1-second client timeout make an overloaded server useless? Every request waits longer than that, so the server works on abandoned requests.
- Which signal reacts fastest to overload? Concurrency or queue wait time.

## Go further

The Amazon Builders Library article on load shedding shows the goodput collapse with charts from real services. The Google SRE book chapter on overload describes per-client quotas and criticality classes. The Netflix concurrency-limits library adapts the limit from latency and is small enough to read. The Envoy documentation shows admission control at the proxy.
`,
        },
        {
          slug: 'tail-latency',
          title: 'Tail latency',
          summary: 'The slowest 1 percent of calls set the latency of any request that fans out, and hedging and limits cut the tail.',
          minutes: 14,
          objectives: [
            'Compute the chance that a fan-out request hits at least one slow call.',
            'Explain why the p99 of a fan-out is near the p99.99 of one call.',
            'Apply hedged requests and compute the extra load they add.',
            'List the common causes of a long tail in a server.',
          ],
          keyTerms: ['p99-latency', 'tail latency', 'fan-out', 'hedged request', 'tail-tolerant', 'garbage collection pause'],
          links: [
            { label: 'Google SRE Book: Monitoring Distributed Systems', url: 'https://sre.google/sre-book/monitoring-distributed-systems/', kind: 'docs' },
            { label: 'HdrHistogram', url: 'https://github.com/HdrHistogram/HdrHistogram', kind: 'repo' },
            { label: 'gRPC documentation: Request hedging (gRFC A6)', url: 'https://github.com/grpc/proposal/blob/master/A6-client-retries.md', kind: 'docs' },
            { label: 'MIT 6.824 Distributed Systems', url: 'https://pdos.csail.mit.edu/6.824/', kind: 'course' },
            { label: 'ByteByteGo on YouTube', url: 'https://www.youtube.com/@ByteByteGo', kind: 'video' },
          ],
          body: `
## What this lesson covers

Tail latency is the latency of the slowest requests, at p99 and beyond. This lesson shows with numbers why a request that calls 100 servers is almost always slow, even when each server is almost always fast. It then shows the techniques that cut the tail.

## Why it matters

A search, a feed, or a retrieval step in an LLM pipeline fans out to many shards and waits for all of them. The user sees the slowest shard. A 1 percent tail per shard becomes a 63 percent tail for the user. Tail latency is also what drives timeouts, retries, and the queueing collapse of the previous lessons. Reducing it is the main latency work in a large system.

## The idea with an example

A server answers 99 percent of calls in 10 ms and 1 percent in 1 second. The mean is about 20 ms. The p99 is 10 ms, so it looks fine on a dashboard with a p99 line.

A request fans out to 100 such servers and waits for all. The chance that one server is fast is 0.99. The chance that all 100 are fast is:

$$0.99^{100} \\approx 0.366$$

So 63 percent of user requests wait 1 second. The user p50 is 1 second. The system is slow for most users while each server is fast for 99 percent of calls.

Now fan out to 10 servers. $0.99^{10} = 0.904$. 10 percent of users wait 1 second. Still bad.

Now cut each server's tail to 0.01 percent, with a 1 in 10,000 slow call. $0.9999^{100} = 0.99$. 1 percent of users wait 1 second. The server p99.99 became the user p99.

The bars compare the share of users that wait in each case.

:::bars
title: Users that wait 1 second
unit: percent
Fan-out 100, 1 percent per shard: 63
Fan-out 10, 1 percent per shard: 10
Fan-out 100, 0.01 percent per shard: 1
:::

Now add hedging. The client sends each shard call, and if no reply arrives within 20 ms, sends the same call to a second replica. It uses the first reply. A slow call is now slow only if both replicas are slow: $0.01^2 = 0.0001$. The user sees the same 1 percent tail as above, at a cost of a second call for 1 percent of shard calls. Extra load: 1 percent.

Press Next to follow the fan-out arithmetic.

:::scenario
title: Fan-out of one request to many shards
state: fan-out=100, per-shard slow fraction=1 percent, users that wait 1 s=unknown, hedging=off
step: Each shard is fast 99 percent of the time. All 100 must be fast for a fast reply.
step: 0.99 to the power 100 is 0.366. 63 percent of users wait 1 second.
state: users that wait 1 s=63 percent
step: Cut the fan-out to 10. 0.99 to the power 10 is 0.904. 10 percent of users wait.
state: fan-out=10, users that wait 1 s=10 percent
step: Keep fan-out 100 but cut each shard tail to 0.01 percent. 0.9999 to the power 100 is 0.99.
state: fan-out=100, per-shard slow fraction=0.01 percent, users that wait 1 s=1 percent
step: Or hedge. Send a second copy after 20 ms. A shard call is slow only if both replicas are slow. Extra load is 1 percent.
state: per-shard slow fraction=1 percent, hedging=on, extra load=1 percent
:::

## How it works

The general rule for fan-out to $n$ servers with a per-server slow fraction $p$ is:

$$P(\\text{slow}) = 1 - (1 - p)^n$$

Here $P(\\text{slow})$ is the chance the user request is slow, $p$ is the per-server slow fraction, and $n$ is the fan-out. For a target user tail $P$ you need $p \\approx P / n$. A user p99 with fan-out 100 needs server p99.99.

The table gives the user tail for several fan-outs and per-shard tails.

| Fan-out | Per-shard tail | Users that hit the tail |
|---|---|---|
| 10 | 1 percent | 10 percent |
| 100 | 1 percent | 63 percent |
| 100 | 0.01 percent | 1 percent |

The common causes of a long tail in one server are:

- Garbage collection pauses in the runtime, often 50 to 500 ms.
- Queueing behind a slow request on the same thread.
- Cold caches after a deploy or a restart.
- Background work such as compaction, log rotation, or backups.
- Shared hardware: a noisy neighbour on the same machine or disk.
- Network retransmits after packet loss, 200 ms or more.

The techniques to cut the tail are:

1. Hedged requests. Send a second copy after a short delay, and cancel the loser. Set the delay at the p95 so hedging adds about 5 percent load.
2. Tied requests. Send to two servers at once, and each server cancels the other when it starts. Lower latency than hedging, no duplicate work.
3. Partial results. Return after 95 percent of shards reply. A feed with 95 of 100 shards is still a feed.
4. Micro-partitions. Many small shards per server, so a slow server can shed shards to others fast.
5. Limit the fan-out. Fewer, larger shards reduce $n$.

The timeline shows a hedged call that wins against a slow replica.

:::timeline
title: Hedged request after a 20 ms delay
unit: ms
lane Client
lane Replica 1
lane Replica 2
Client -> Replica 1: shard call @0-0.5
Replica 1: slow, a garbage collection pause @0.5-100
Client -> Replica 2: hedge after 20 ms @20-20.5
Replica 2: answer in 10 ms @20.5-30.5
Replica 2 -> Client: reply at 31 ms @30.5-31
Client -> Replica 1: cancel @31-31.5
:::

Measure the tail with a histogram, such as HdrHistogram, and record p99, p99.9, and p99.99 per server. The p99.9 of each server is the number that predicts the user p99 at fan-out 10.

Caution: hedging a non-idempotent call runs it twice. Hedge reads only, or carry a request id.

## Common mistakes

- Mistake: judge a server by its p99 when it serves a fan-out. Fix: track p99.9 and p99.99, because those set the user latency.
- Mistake: hedge with a delay of zero. Fix: delay the hedge until the p95, or you double the load.
- Mistake: wait for every shard. Fix: return a partial result after a deadline when the product allows.
- Mistake: ignore garbage collection pauses. Fix: measure pause time and tune the heap or move the hot path off the collected runtime.

## Check your understanding

- With fan-out 50 and a 1 percent per-server tail, what fraction of user requests hit the tail? About 39 percent.
- What per-server tail does a 1 percent user tail need at fan-out 100? About 0.01 percent.
- How much load does hedging at the p95 add? About 5 percent.

## Go further

The Google SRE book chapter on monitoring explains why to track latency as a distribution. HdrHistogram records the full distribution with little memory. The gRPC retry proposal describes hedging as implemented in a real client. MIT 6.824 and ByteByteGo both cover the tail at scale and fan-out arithmetic. The /labs/timeout-architect lab simulates the tail of a chain of hops.
`,
        },
      ],
    },
    {
      slug: 'case-studies',
      title: 'Case studies',
      description: 'Four end-to-end designs that use every module: a URL shortener, a chat service, a feed, and an LLM gateway.',
      lessons: [
        {
          slug: 'url-shortener',
          title: 'Design a URL shortener',
          summary: 'A URL shortener maps a short key to a long URL, with a read-heavy load that a cache and a key-value store serve.',
          minutes: 15,
          objectives: [
            'Estimate the QPS, storage, and cache size of a shortener from the write rate.',
            'Choose a key generation method and compute how many keys 7 characters give.',
            'Design the read path with a cache and the write path with a unique-key check.',
            'Explain how to handle a hot short link.',
          ],
          keyTerms: ['key generation', 'base62', 'read-heavy', 'cache-aside', 'hot key', 'redirect'],
          links: [
            { label: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', kind: 'repo' },
            { label: 'System Design 101 (ByteByteGo)', url: 'https://github.com/ByteByteGoHq/system-design-101', kind: 'repo' },
            { label: 'Redis documentation', url: 'https://redis.io/docs/latest/', kind: 'docs' },
            { label: 'ByteByteGo on YouTube', url: 'https://www.youtube.com/@ByteByteGo', kind: 'video' },
            { label: 'Gaurav Sen on YouTube', url: 'https://www.youtube.com/@gkcs', kind: 'video' },
          ],
          body: `
## What this lesson covers

A URL shortener takes a long URL and returns a short one. A visit to the short one redirects to the long one. This lesson designs the service end to end: the estimate, the key, the storage, the cache, and the failure cases.

## Why it matters

The shortener is the standard first design question. It has one write path and one read path, and the read path is 100 times hotter. Every decision here, from the key format to the cache size, comes up again in bigger systems. If you can size and defend this design, you can do the same for a feed or a gateway.

## The idea with an example

Requirements. 100 million new links per month. Each link is read 100 times over its life. Links live 5 years. The redirect must take under 50 ms at p99.

Estimate. Writes: 100 million per month / 2.6 million seconds = 40 per second, about 120 at peak. Reads: 100 times that, 4,000 per second, 12,000 at peak. Storage: each row holds a 7-character key, a 500-byte URL, and metadata, about 600 bytes. 100 million × 600 bytes = 60 GB per month. Over 5 years, 6 billion rows, 3.6 TB.

The bars compare the request rates from the estimate.

:::bars
title: Requests per second
unit: per second
Writes, average: 40
Writes, peak: 120
Reads, average: 4000
Reads, peak: 12000
Cache misses at peak: 1200
:::

Key. Use base62: the digits 0 to 9, a to z, and A to Z, 62 characters. A 7-character key gives $62^7 \\approx 3.5 \\times 10^{12}$ keys, 3.5 trillion. We need 6 billion. Plenty.

Key generation. Option 1, hash the long URL and take 7 characters. Two URLs can collide, so check and retry. Option 2, a counter. Each write takes the next integer and encodes it in base62. No collisions. The counter is a single point, so pre-allocate ranges. Each server takes a block of 1,000 ids from a central store and hands them out locally. Option 2 with ranges is the choice.

Storage. The data is a key to a value with no joins. A key-value store partitioned by key fits.

Read path. A redirect hits the cache first. The working set is the links read in the last day. Suppose 20 percent of reads go to 1 percent of links. Then a cache of 10 million entries at 600 bytes, 6 GB, gives a hit rate above 90 percent. The 1,200 misses per second at peak go to the store, which handles them with one node.

Press Next to create one short link and serve its first redirect.

:::scenario
title: Create a short link and serve a redirect
state: next id=1000, local range=1000 to 1999, key=none, cache=empty, store rows=0
step: A client sends a long URL. The web server validates it.
step: The server takes id 1000 from its local range. The next id is 1001.
state: next id=1001
step: The server encodes 1000 in base62. The result is g8, padded to 7 characters.
state: key=00000g8
step: The server writes the key, the URL, the creation date, and the expiry to the store and returns the short URL.
state: store rows=1
step: A visitor opens the short URL. The cache misses, the store returns the long URL, and the cache fills.
state: cache=1 entry
step: The server returns a 302 redirect. The next visitor hits the cache in 0.2 ms.
:::

Write path:

1. Validate the long URL.
2. Take the next id from the local range.
3. Encode it in base62 to get the key.
4. Write (key, URL, created, expiry) to the store.
5. Return the short URL.

The diagram shows the read path and the write path of the whole system.

:::flow
title: Read path and write path of the shortener
Browser -> Load balancer: GET short key
Load balancer -> Web server: route
Web server -> Local cache: 1 second TTL for hot links
Web server -> Cache cluster: get key, 90 percent hits
Cache cluster -> Key-value store: miss, 1,200 per second at peak
Web server -> Browser: 302 redirect
Web server -> Id range store: take a block of 1,000 ids
Web server -> Key-value store: write key and URL
:::

## How it works

The redirect returns HTTP status 302, not 301. A 301 tells the browser to cache the redirect forever, so you lose the visit count and cannot change the target. A 302 brings every visit through the service.

Hot links. One link in a viral post can take 50,000 reads per second. That is one key on one cache node. Use a local in-process cache with a 1-second TTL on each web server, as the hot keys lesson described. 200 web servers at 1 read per second each put 200 reads on the cache node.

Expiry. Store an expiry date per link. A daily job deletes expired rows. Reads check the expiry before redirecting.

Availability. Run the store with 3 replicas. Run the cache with consistent hashing over several nodes. Run the web tier behind a load balancer with a health check. The redirect path has no dependency on the write path, so a counter outage stops new links but not redirects.

| Component | Size | Why |
|---|---|---|
| Web servers | 4 to 8 | 12,000 QPS at 3,000 each with headroom |
| Cache | 3 nodes, 6 GB total | 90 percent hit rate on the working set |
| Store | 3 replicas, 4 TB each | 5 years of rows |
| Id range store | 3-node consensus | Unique ranges, rarely called |

Note: the write path can also carry a custom alias chosen by the user. Check it with a compare-and-set on the key, so two users cannot claim the same alias.

## Common mistakes

- Mistake: generate keys from a hash and skip the collision check. Fix: check the key, or two URLs share a short link.
- Mistake: use a 301 redirect. Fix: use 302, so visits reach the service and targets can change.
- Mistake: size the cache from total rows. Fix: size from the daily working set.
- Mistake: make redirects depend on the id service. Fix: keep the read path free of write-path dependencies.

## Check your understanding

- How many keys does a 6-character base62 key give? About 57 billion.
- Why pre-allocate id ranges? So each server generates keys without a call to the central counter per write.
- What is the write-to-read ratio in this design? About 1 to 100.

## Go further

The System Design Primer and ByteByteGo's System Design 101 both have shortener designs with diagrams to compare with this one. The Redis documentation covers the cache and the counter primitive. ByteByteGo and Gaurav Sen walk through the design on video. The /labs/capacity lab reproduces the estimate.
`,
        },
        {
          slug: 'chat-service',
          title: 'Design a chat service',
          summary: 'A chat service keeps a persistent connection per user, stores messages by conversation, and delivers each one at least once.',
          minutes: 16,
          objectives: [
            'Estimate connections, messages per second, and storage for a chat service.',
            'Design the connection tier with WebSockets and a presence registry.',
            'Choose a message storage key and explain the ordering guarantee.',
            'Explain delivery acknowledgement and offline delivery.',
          ],
          keyTerms: ['WebSocket', 'persistent connection', 'presence', 'message ordering', 'delivery receipt', 'fan-out'],
          links: [
            { label: 'MDN: The WebSocket API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API', kind: 'docs' },
            { label: 'RFC 6455: The WebSocket Protocol', url: 'https://datatracker.ietf.org/doc/html/rfc6455', kind: 'docs' },
            { label: 'How Discord stores trillions of messages', url: 'https://discord.com/blog/how-discord-stores-trillions-of-messages', kind: 'article' },
            { label: 'Apache Cassandra documentation', url: 'https://cassandra.apache.org/doc/latest/', kind: 'docs' },
            { label: 'ByteByteGo on YouTube', url: 'https://www.youtube.com/@ByteByteGo', kind: 'video' },
          ],
          body: `
## What this lesson covers

A chat service delivers a message from one user to another in under a second, stores it, and shows it on every device. This lesson designs the connection tier, the message store, and the delivery path, with sizes for 10 million concurrent users.

## Why it matters

Chat is the standard design for stateful connections. A web request is short and stateless. A chat connection stays open for hours, and the server must know which machine holds the connection for each user. That state, called presence, changes the whole design. The same pattern appears in multiplayer games, collaborative editors, and live LLM token streams.

## The idea with an example

Requirements. 50 million daily users, 10 million online at peak. Each user sends 40 messages per day. Messages are 100 bytes of text. Group chats have up to 100 members. Messages are kept forever. Delivery under 500 ms.

Estimate. Messages: 50 million × 40 = 2 billion per day, 23,000 per second, about 70,000 at peak. Storage: 2 billion × 100 bytes = 200 GB per day of text, plus metadata, about 400 GB per day, 150 TB per year. Connections: 10 million open connections at peak.

The bars compare the message rates and the push rate at peak.

:::bars
title: Messages per second
unit: per second
Average: 23000
Peak: 70000
Pushes at peak with group size 5: 350000
:::

Connection tier. A WebSocket is a long-lived two-way connection over one TCP socket. One server holds about 100,000 open connections with 10 KB of memory each, 1 GB. So the tier needs 100 servers for 10 million users, 150 with headroom.

Presence. A registry maps user id to the server that holds the connection. It is a key-value store with 10 million entries, 50 bytes each, 500 MB. It updates on connect and disconnect, a few thousand writes per second.

The table lists the size of each component.

| Component | Size | Why |
|---|---|---|
| Connection servers | 150 | 10 million connections at 100,000 each, with headroom |
| Presence registry | 500 MB | 10 million entries of 50 bytes |
| Message store | 150 TB per year | 400 GB per day with metadata |

Message path. User A on server 12 sends a message to user B:

1. Server 12 receives the message over the WebSocket.
2. Server 12 writes the message to the message store and gets a message id.
3. Server 12 looks up B in the presence registry. B is on server 47.
4. Server 12 sends the message to server 47 over an internal connection.
5. Server 47 pushes it to B over the WebSocket.
6. B's client sends an acknowledgement. Server 47 marks the message delivered.

The path has 2 network hops inside the datacenter and 1 store write. Total under 20 ms.

The diagram shows the message path from user A to user B.

:::flow
title: Message from user A on server 12 to user B on server 47
User A -> Server 12: message over WebSocket
Server 12 -> Message store: write, get message id
Server 12 -> Presence registry: where is B
Presence registry -> Server 12: server 47
Server 12 -> Server 47: internal push
Server 47 -> User B: push over WebSocket
User B -> Server 47: acknowledgement
:::

Press Next to follow one message through delivery, a resend, and an offline user.

:::scenario
title: Deliver one message with acknowledgement and resend
state: B online=yes, B server=47, message=stored, delivered=no, resends=0
step: Server 12 writes the message to the store and asks the presence registry for B. B is on server 47.
step: Server 47 pushes the message to B. No acknowledgement arrives in 5 seconds.
state: resends=1
step: Server 47 resends. B had received the first copy and deduplicates by message id. B sends an acknowledgement.
state: delivered=yes
step: B goes offline. A new message finds no entry for B in the registry.
state: B online=no, B server=none, delivered=no
step: Server 12 stores the message as undelivered and sends a push notification. When B connects, the client asks for messages since its last seen id.
state: B online=yes, B server=31, delivered=yes
:::

## How it works

Message storage. The key is the conversation id. Within a conversation, messages are sorted by a time-ordered message id. A wide-column store such as Cassandra fits: partition by conversation id, cluster by message id. A query "last 50 messages of conversation X" reads one partition in order.

Message ids must be unique and sortable. Use an id with a timestamp in the high bits and a sequence number in the low bits, as in Twitter's Snowflake format. Clients sort by id. Two messages sent in the same millisecond from two devices get ids that differ in the sequence bits, so the order is defined.

Old conversations become large partitions. Discord adds a time bucket to the key, for example conversation id plus a 10-day window, so no partition grows past a few hundred megabytes.

Offline delivery. If B is not in the presence registry, server 12 stores the message as undelivered and sends a push notification. When B connects, the client asks for messages since its last seen id. The store returns them from the conversation partition.

Group fan-out. A message to a 100-member group is one store write and up to 100 pushes. Server 12 looks up all 100 members, groups them by server, and sends one internal message per server. At 70,000 messages per second with an average group size of 5, the push rate is 350,000 per second. Across 150 servers, that is about 2,300 per server.

Delivery guarantees. The client acknowledges each message. If no acknowledgement arrives in 5 seconds, the server resends. The client deduplicates by message id. This is at-least-once delivery with idempotent clients, the same rule as the queue lesson.

Note: a connection server that restarts drops 100,000 connections at once. Clients reconnect with exponential backoff and jitter, or 100,000 reconnects in one second overload the registry.

## Common mistakes

- Mistake: poll for new messages over HTTP every second. Fix: use a WebSocket, because 10 million polls per second is 100 times the message rate.
- Mistake: store all messages of a conversation in one partition forever. Fix: bucket by time so partitions stay small.
- Mistake: order messages by client clock. Fix: assign the id on the server, because client clocks drift.
- Mistake: reconnect at once after a server restart. Fix: use backoff with jitter on the client.

## Check your understanding

- How many connection servers does 10 million users need at 100,000 per server? 100, plus headroom.
- What does the presence registry map? A user id to the server that holds that user's connection.
- Why must the chat client deduplicate messages? The server resends after a missing acknowledgement, so repeats happen.

## Go further

The MDN WebSocket page and RFC 6455 explain the connection protocol. The Discord article explains how they store trillions of messages with time-bucketed partitions. The Cassandra documentation shows how to model a conversation as a partition. ByteByteGo has a full chat design walkthrough on video.
`,
        },
        {
          slug: 'news-feed',
          title: 'Design a news feed',
          summary: 'A feed merges recent posts from followed users, and the fan-out happens on write for most users and on read for celebrities.',
          minutes: 16,
          objectives: [
            'Compare fan-out on write with fan-out on read by storage and latency.',
            'Compute the write amplification of fan-out on write for an average user and a celebrity.',
            'Design a hybrid feed that uses both methods.',
            'Describe the ranking step and where it runs.',
          ],
          keyTerms: ['fan-out on write', 'fan-out on read', 'timeline', 'celebrity problem', 'ranking', 'hybrid fan-out'],
          links: [
            { label: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', kind: 'repo' },
            { label: 'System Design 101 (ByteByteGo)', url: 'https://github.com/ByteByteGoHq/system-design-101', kind: 'repo' },
            { label: 'Redis documentation', url: 'https://redis.io/docs/latest/', kind: 'docs' },
            { label: 'Apache Kafka documentation', url: 'https://kafka.apache.org/documentation/', kind: 'docs' },
            { label: 'Gaurav Sen on YouTube', url: 'https://www.youtube.com/@gkcs', kind: 'video' },
          ],
          body: `
## What this lesson covers

A news feed shows a user the recent posts from the accounts they follow, ranked. This lesson designs the feed with the two standard methods, fan-out on write and fan-out on read, sizes both, and combines them.

## Why it matters

The feed is where the storage lesson's trade-off between read cost and write cost becomes real money. The celebrity case breaks the simple design, and the hybrid fix is used by every large feed.

## The idea with an example

Requirements. 100 million daily users. Each user follows 300 accounts. Each user posts 2 times per day. The feed loads 10 times per day per user and must return in under 200 ms.

Estimate. Posts: 200 million per day, 2,300 per second, 7,000 at peak. Feed loads: 1 billion per day, 11,500 per second, 35,000 at peak.

Fan-out on read. The feed load reads the 300 followed accounts, fetches the recent posts of each, merges, and ranks. That is 300 lookups per feed load, 35,000 × 300 = 10 million lookups per second at peak. Posts cost nothing extra to write.

Fan-out on write. When a user posts, the system writes the post id into the timeline of each follower. A timeline is a list of post ids per user, kept in a cache. With 300 followers on average, each post causes 300 timeline writes. 7,000 posts per second × 300 = 2.1 million writes per second. A feed load reads one timeline, 35,000 reads per second. The feed load is one lookup and takes 1 ms.

The bars compare the operations per second of the two methods at peak.

:::bars
title: Operations per second at peak
unit: thousand per second
Fan-out on read, lookups: 10000
Fan-out on write, timeline writes: 2100
Fan-out on write, timeline reads: 35
:::

Storage for timelines: 100 million users × 500 post ids × 8 bytes = 400 GB. Fits in a cache cluster.

The celebrity case. One account has 50 million followers. One post is 50 million timeline writes. At 100,000 writes per second, that takes 500 seconds. The post appears 8 minutes late for the last follower, and the write queue blocks every other post.

Hybrid. Users with under 10,000 followers fan out on write. Users above that fan out on read. A feed load reads the timeline, then fetches the recent posts of the few celebrities the user follows, usually under 10, and merges. One lookup becomes about 10. The feed load stays under 20 ms. The celebrity post costs 1 write.

Press Next to compare a normal post with a celebrity post.

:::scenario
title: One post from a normal user and one from a celebrity
state: author followers=300, timeline writes=0, feed load lookups=1, delay for last follower=0 s
step: A normal user posts. The fan-out worker appends the post id to 300 timelines.
state: timeline writes=300, delay for last follower=under 1 s
step: A celebrity with 50 million followers posts. Fan-out on write would need 50 million timeline writes.
state: author followers=50 million, timeline writes=50 million, delay for last follower=500 s
step: At 100,000 writes per second the last follower sees the post after 8 minutes, and the queue blocks every other post.
step: Switch the celebrity to fan-out on read. The post costs 1 write. A feed load fetches the recent posts of the few celebrities the user follows.
state: timeline writes=1, feed load lookups=about 10, delay for last follower=0 s
step: The feed load stays under 20 ms and the celebrity post costs 1 write.
:::

## How it works

The write path for a normal user:

1. The post service writes the post to the post store and returns the post id.
2. The post service publishes an event to a queue with the post id and the author id.
3. A fan-out worker reads the event and fetches the follower list of the author.
4. The worker appends the post id to each follower's timeline in the cache, in batches of 1,000.
5. The worker trims each timeline to the last 500 ids.

The diagram shows the write path for a normal user.

:::flow
title: Fan-out on write for a normal user
Post service -> Post store: write post, get id
Post service -> Queue: event with post id and author
Queue -> Fan-out worker: read event
Fan-out worker -> Follow store: 300 followers
Fan-out worker -> Timeline cache: 300 appends in batches
Timeline cache -> Feed reader: one read per feed load
:::

The read path:

1. Read the timeline for the user from the cache: a list of post ids.
2. Read the recent post ids of each followed celebrity from the post store, with a cache.
3. Merge the lists by time.
4. Fetch the post bodies from the post store by id, in one batch call.
5. Rank the posts and return the top 50.

Ranking takes the candidate posts and scores each one with features such as age, the author's closeness, and predicted engagement. A model computes the score. Run it at read time on the merged list of 500 candidates, so a model change applies to every feed at once.

Inactive users. A user who has not opened the app in 30 days does not need a timeline. Skip them in the fan-out and rebuild the timeline on read when they return. This cuts fan-out writes by more than half.

| Method | Post cost | Feed cost | Fits |
|---|---|---|---|
| Fan-out on write | 300 writes | 1 read | Normal users |
| Fan-out on read | 1 write | 300 reads | Celebrities, inactive users |
| Hybrid | Mixed | About 10 reads | Everyone |

## Common mistakes

- Mistake: fan out on write for every account. Fix: fan out on read for accounts with many followers.
- Mistake: store full post bodies in each timeline. Fix: store post ids only, and fetch bodies in one batch.
- Mistake: fan out to inactive users. Fix: skip users not seen in 30 days and rebuild on their return.
- Mistake: rank at write time. Fix: rank at read time, so the model and the user's state are current.

## Check your understanding

- A user with 2,000 followers posts. How many timeline writes does fan-out on write cause? 2,000.
- Why does a celebrity post fan out on read? 50 million timeline writes per post would take minutes and block other posts.
- What does a timeline store? A list of post ids, not post bodies.

## Go further

The System Design Primer and System Design 101 both include feed designs with the hybrid method. The Redis documentation covers the list operations used for timelines. The Kafka documentation covers the queue between the post service and the fan-out workers. Gaurav Sen has a detailed feed design video. The /labs/capacity lab reproduces the fan-out arithmetic.
`,
        },
        {
          slug: 'llm-serving-gateway',
          title: 'Design an LLM serving gateway',
          summary: 'An LLM gateway routes prompts to model replicas, streams tokens back, and protects the GPUs with admission control.',
          minutes: 17,
          objectives: [
            'Estimate GPU count from request rate, output length, and tokens per second per replica.',
            'Design the gateway with routing, streaming, and a concurrency limit per replica.',
            'Explain why KV cache memory, not compute, limits concurrency on a replica.',
            'Apply timeouts, retries, and load shedding to a streaming request.',
          ],
          keyTerms: ['gateway', 'kv-cache', 'continuous-batching', 'paged-attention', 'time to first token', 'streaming', 'load shedding'],
          links: [
            { label: 'vLLM documentation', url: 'https://docs.vllm.ai/', kind: 'docs' },
            { label: 'Efficient Memory Management for LLM Serving with PagedAttention', url: 'https://arxiv.org/abs/2309.06180', kind: 'paper' },
            { label: 'DistServe: Disaggregating Prefill and Decoding', url: 'https://arxiv.org/abs/2401.09670', kind: 'paper' },
            { label: 'SGLang', url: 'https://github.com/sgl-project/sglang', kind: 'repo' },
            { label: 'Google SRE Book: Handling Overload', url: 'https://sre.google/sre-book/handling-overload/', kind: 'docs' },
          ],
          body: `
## What this lesson covers

An LLM serving gateway sits between clients and a fleet of model replicas on graphics processing units (GPUs). It routes each prompt, streams tokens back, and keeps the GPUs from overload. This lesson designs it with real sizes and applies the reliability patterns from the last module to a streaming request.

## Why it matters

A GPU replica is the most expensive server in the stack. The gateway is where you spend the GPU budget well.

## The idea with an example

Requirements. 1,000 requests per second at peak. Each request has a 1,000-token prompt and a 300-token answer. Time to first token under 1 second at p99. Tokens stream to the client as they are produced.

Replica capacity. One replica runs a 70-billion-weight model in 16-bit on 2 GPUs with 80 GB each, 160 GB total. The weights take 140 GB. 20 GB remain for the key-value (KV) cache, which stores the attention keys and values for every token in flight. For this model, the KV cache needs about 320 KB per token. 20 GB / 320 KB = 62,500 tokens in flight. A request holds 1,300 tokens at its end, so about 48 concurrent requests fit. Memory, not compute, sets this limit.

The bars compare the memory on one replica.

:::bars
title: Memory on one replica with 2 GPUs
unit: GB
Weights in 16-bit: 140
KV cache: 20
Total GPU memory: 160
:::

Replica throughput. With continuous batching, the replica decodes about 40 tokens per second per request at 48 concurrent requests, about 2,000 tokens per second total. A request takes 300 / 40 = 7.5 seconds. By Little's law, the replica serves 48 / 7.5 = 6.4 requests per second.

Fleet size. 1,000 / 6.4 = 156 replicas, 312 GPUs. With 30 percent headroom, about 200 replicas.

Press Next to follow the arithmetic from the KV cache to the fleet size.

:::scenario
title: From KV cache memory to the fleet size
state: weights=140 GB, KV cache=20 GB, tokens in flight=0, concurrent requests=0, requests per second per replica=0, replicas=0
step: Two 80 GB GPUs hold 160 GB. The 70-billion-weight model in 16-bit takes 140 GB. 20 GB remain for the KV cache.
step: Each token in flight needs about 320 KB. 20 GB divided by 320 KB is 62,500 tokens.
state: tokens in flight=62500
step: A request holds 1,300 tokens at its end. 62,500 divided by 1,300 is about 48 concurrent requests.
state: concurrent requests=48
step: Each request decodes 300 tokens at 40 per second, 7.5 seconds. By Little's law one replica serves 48 divided by 7.5, 6.4 requests per second.
state: requests per second per replica=6.4
step: 1,000 requests per second divided by 6.4 is 156 replicas. With 30 percent headroom, about 200 replicas, 400 GPUs.
state: replicas=200
:::

The bars compare the replica count with and without headroom.

:::bars
title: Replicas for 1,000 requests per second
unit: replicas
Minimum at 6.4 per replica: 156
With 30 percent headroom: 200
:::

Request path:

1. The client sends the prompt to the gateway over HTTP with streaming enabled.
2. The gateway authenticates, checks the rate limit for the client, and counts the prompt tokens.
3. The gateway picks a replica with free KV cache memory and the fewest queued requests.
4. The replica runs the prefill step on the prompt, which takes about 200 ms for 1,000 tokens, and emits the first token.
5. The replica decodes one token per step and the gateway forwards each token to the client at once.
6. On the last token, the replica frees the KV cache and the gateway records the token counts.

The diagram shows one streaming request through the gateway.

:::flow
title: One streaming request through the gateway
Client -> Gateway: prompt with streaming on
Gateway -> Rate limiter: check quota and count tokens
Rate limiter -> Router: admitted
Router -> Replica 7: most free KV cache
Replica 7 -> Gateway: first token after a 200 ms prefill
Gateway -> Client: stream each token at once
Replica 7 -> Gateway: last token, free the KV cache
Gateway -> Usage log: token counts
:::

## How it works

Routing. The gateway keeps a view of each replica: free KV cache tokens, queue depth, and in-flight requests. It routes to the replica with the most free cache. For prompts that share a long prefix, such as a system prompt, it routes to the replica that already holds that prefix in its cache. vLLM and SGLang reuse cached prefixes.

Admission control. Each replica has a concurrency limit from its KV cache size. The gateway holds a bounded queue per replica. Above the bound, it rejects with a 429 code and a retry-after header.

Timeouts. Set two. Time to first token, 2 seconds, which catches a stuck prefill. Time between tokens, 5 seconds, which catches a stalled decode. Do not set one total timeout, because a 2,000-token answer takes a minute by design.

The timeline shows where the two timeouts apply on one streaming request.

:::timeline
title: Two timeouts on a streaming request
unit: s
lane Client
lane Gateway
lane Replica
Client -> Gateway: prompt @0-0.02
Gateway -> Replica: route @0.02-0.04
Replica: prefill 1,000 tokens @0.04-0.24
Replica -> Client: first token, inside the 2 s limit @0.24-0.26
Replica: decode 300 tokens @0.26-7.5
Replica -> Client: one token every 25 ms, 5 s limit between tokens @1-1.02
Replica -> Client: last token @7.5-7.52
:::

Retries and hedging. Retry only before the first token. After tokens have streamed, a retry would repeat text to the client.

Priority. Interactive chat gets a higher class than batch summarisation. Under overload, shed batch first.

Prefill and decode separation. Prefill is compute-bound and decode is memory-bound. DistServe runs them on separate replicas, so a long prefill does not stall other requests.

| Metric | Target | Why |
|---|---|---|
| Time to first token p99 | 1 s | User sees a response start |
| Tokens per second per request | 30 or more | Faster than reading speed |
| KV cache use per replica | Under 90 percent | Room for the next request |

Caution: a client that sends a 100,000-token prompt takes 32 GB of KV cache on its own. Cap the prompt length at the gateway, and count prompt tokens before you route.

## Common mistakes

- Mistake: size the fleet by compute alone. Fix: size by KV cache memory, because that sets concurrency.
- Mistake: set one total request timeout. Fix: set a time to first token and a time between tokens.
- Mistake: retry after tokens have streamed. Fix: retry only before the first token.
- Mistake: let one client fill a replica with long prompts. Fix: cap prompt tokens and apply a per-client rate limit in tokens, not requests.

## Check your understanding

- A replica has 30 GB of KV cache and uses 250 KB per token. How many tokens fit? 120,000.
- Why does admission control matter more for a GPU than for a web server? A GPU over its memory limit slows every request, and each request is seconds long.
- When is a retry safe on a streaming request? Only before the first token reaches the client.

## Go further

The vLLM documentation explains continuous batching, paged attention, and prefix caching in a real server. The PagedAttention paper shows why KV cache memory limits concurrency. The DistServe paper separates prefill and decode. SGLang shows prefix-aware routing. The Google SRE book chapter on overload covers the admission control rules. The /labs/kv-cache lab computes KV cache size for any model, and the /labs/pareto-router lab routes requests between models by cost and quality.
`,
        },
      ],
    },
  ],
}
