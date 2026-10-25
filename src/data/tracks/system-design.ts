import type { Track } from '../types'

export const track: Track = {
  slug: 'system-design',
  title: 'System Design',
  tagline: 'Distributed systems for people who will be paged.',
  description:
    'Storage, replication, partitioning, caches, queues, and the reliability patterns behind them, with the arithmetic to size each one.',
  accent: 'var(--accent-systems)',
  status: 'live',
  level: 'intermediate',
  order: 7,
  audience: 'Developers who can build a service and now need it to scale, stay up and stay consistent.',
  outcome: 'Design a complete backend with caches, queues, databases and failure handling, and defend each choice.',
  prerequisites: ['start-here'],
  modules: [
    {
      slug: 'fundamentals',
      title: 'Fundamentals',
      description: 'Latency, throughput, queueing, service levels, and back-of-the-envelope estimation.',
      level: 'intermediate',
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

The script below runs the whole estimate. Change the inputs at the top and run it with python3 estimate.py.

:::code
lang: python
file: estimate.py
users = 10_000_000
requests_per_user = 20
bytes_per_request = 10_000
photos_per_user = 2
photo_bytes = 2_000_000
peak_factor = 3
seconds_per_day = 86_400

requests_per_day = users * requests_per_user
avg_qps = requests_per_day / seconds_per_day
peak_qps = avg_qps * peak_factor
read_mb_per_s = peak_qps * bytes_per_request / 1e6
storage_tb_per_day = users * photos_per_user * photo_bytes / 1e12
storage_pb_per_year = storage_tb_per_day * 365 / 1000
upload_qps = users * photos_per_user / seconds_per_day

print(f"requests per day: {requests_per_day:,}")
print(f"average QPS: {avg_qps:,.0f}")
print(f"peak QPS: {peak_qps:,.0f}")
print(f"peak read bandwidth: {read_mb_per_s:,.0f} MB per second")
print(f"storage per day: {storage_tb_per_day:,.0f} TB")
print(f"storage per year: {storage_pb_per_year:,.1f} PB")
print(f"uploads per second at peak: {upload_qps * peak_factor:,.0f}")
:::

:::code
lang: text
requests per day: 200,000,000
average QPS: 2,315
peak QPS: 6,944
peak read bandwidth: 69 MB per second
storage per day: 40 TB
storage per year: 14.6 PB
uploads per second at peak: 694
:::

## Try it

:::exercise
title: Size a video service
task: Repeat the six steps for a video service. It has 5 million daily active users. Each user makes 50 requests per day of 50 KB each, and uploads 1 video of 20 MB per day. Use a peak factor of 3. Compute the peak QPS, the peak read bandwidth in MB per second, and the storage per year in PB. Then answer: does one 10 gigabit link carry the reads?
hint: Copy estimate.py and change the seven inputs at the top. One 10 gigabit link moves 1,250 MB per second.
lang: python
solution:
users = 5_000_000
requests_per_user = 50
bytes_per_request = 50_000
videos_per_user = 1
video_bytes = 20_000_000
peak_factor = 3
seconds_per_day = 86_400

requests_per_day = users * requests_per_user          # 250,000,000
avg_qps = requests_per_day / seconds_per_day           # 2,894
peak_qps = avg_qps * peak_factor                       # 8,681
read_mb_per_s = peak_qps * bytes_per_request / 1e6     # 434 MB per second
storage_tb_per_day = users * videos_per_user * video_bytes / 1e12   # 100 TB
storage_pb_per_year = storage_tb_per_day * 365 / 1000               # 36.5 PB

print(f"peak QPS {peak_qps:,.0f}")
print(f"peak read bandwidth {read_mb_per_s:,.0f} MB per second, link has 1,250")
print(f"storage per year {storage_pb_per_year:.1f} PB")
# One link carries the reads (434 of 1,250 MB per second). The storage does not fit one machine.
:::

## Common mistakes

- Mistake: use the average QPS to size servers. Fix: size for peak QPS and leave a margin of 30 percent.
- Mistake: forget the unit. Fix: write MB or Mbit each time, because the two differ by a factor of 8.
- Mistake: count only reads. Fix: estimate writes and storage separately, because they often set the design.
- Mistake: estimate to three decimal places. Fix: round to one significant figure and state the assumptions.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: back-of-the-envelope estimation
q: A service receives 1 million requests per day. What is its average QPS?
- About 1.2
* About 12
- About 120
- About 1,000
why: Divide 1,000,000 by 86,400 seconds, which gives 11.6, so about 12 requests per second.
q: A service stores 100 MB per second. How much does it store per day?
- About 360 GB
- About 864 GB
* About 8.6 TB
- About 86 TB
why: 100 MB times 86,400 seconds is 8,640,000 MB, which is 8.64 TB.
q: In the photo example, which number forces the design choice?
- The peak QPS of 7,000
- The read bandwidth of 70 MB per second
* The storage of 15 PB per year
- The 700 uploads per second at peak
why: The reads and the bandwidth fit one machine, but 15 PB per year must go to object storage across many machines.
q: Why do you size servers for peak QPS and not for average QPS?
* Traffic is not flat, and the queue forms at the peak
- The average is harder to measure than the peak
- Peak numbers are always smaller and cheaper
- Servers cost the same at any load
why: A server sized for the average is overloaded for the hours around the daily peak, so the estimate uses the peak with a margin.
q: A 1 gigabit per second link moves about how many MB per second?
- 1,000
* 125
- 12.5
- 8,000
why: A byte is 8 bits, so 1,000 megabits per second is 125 megabytes per second.
:::

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

The script below computes percentiles by the procedure above and shows how the mean hides a tail.

:::code
lang: python
file: percentiles.py
import math, random

def percentile(samples, p):
    s = sorted(samples)
    position = math.ceil(p / 100 * len(s))       # 1-based position, rounded up
    return s[position - 1]

random.seed(1)
latencies = [10.0] * 980 + [5000.0] * 20        # ms: 980 fast calls, 20 slow calls
random.shuffle(latencies)

mean = sum(latencies) / len(latencies)
print(f"mean   {mean:7.1f} ms")
for p in (50, 95, 99, 99.9):
    print(f"p{p:<5} {percentile(latencies, p):7.1f} ms")

concurrency = 8
latency_s = 0.010
print(f"throughput at concurrency {concurrency}: {concurrency / latency_s:.0f} requests per second")
:::

:::code
lang: text
mean     109.8 ms
p50       10.0 ms
p95       10.0 ms
p99     5000.0 ms
p99.9   5000.0 ms
throughput at concurrency 8: 800 requests per second
:::

The mean says 110 ms, which no request ever took. The p99 says that 1 in 100 requests waits 5 seconds.

## Try it

:::exercise
title: Latency of a batch
task: A server batches 4 requests and processes each batch in 15 ms. Requests arrive at 50 per second. Compute the throughput of one batch slot in requests per second. Then compute the latency of the first request in a batch and of the last request in the batch. Finally compute the throughput of a server that runs 16 requests at once, each in 40 ms.
hint: The first request waits for 3 more arrivals. At 50 per second, one arrival takes 20 ms. Throughput is concurrency divided by latency.
lang: python
solution:
batch = 4
batch_ms = 15
arrivals_per_s = 50

slot_throughput = batch / (batch_ms / 1000)            # 267 per second
gap_ms = 1000 / arrivals_per_s                         # 20 ms between arrivals
first_latency = (batch - 1) * gap_ms + batch_ms        # 60 + 15 = 75 ms
last_latency = batch_ms                                # 15 ms
print(f"batch slot throughput {slot_throughput:.0f} per second")
print(f"first request {first_latency:.0f} ms, last request {last_latency} ms")

concurrency = 16
latency_s = 0.040
print(f"16 at once in 40 ms: {concurrency / latency_s:.0f} requests per second")   # 400
:::

## Common mistakes

- Mistake: report the mean latency. Fix: report p50, p95, and p99, because the tail is where users notice.
- Mistake: raise the batch size to raise throughput without a latency budget. Fix: set a maximum wait time for a batch to fill.
- Mistake: assume throughput doubles when you double the cores. Fix: measure, because a shared lock or a database often limits concurrency.
- Mistake: measure latency on the server only. Fix: measure at the client, because the network and the queue in front of the server add time.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: latency versus throughput
q: A server runs 16 requests at once, and each takes 40 ms. What is its throughput?
- 40 requests per second
- 160 requests per second
* 400 requests per second
- 640 requests per second
why: Throughput is concurrency divided by latency, 16 divided by 0.040 seconds, which is 400 per second.
q: What does p99 = 300 ms mean?
- The mean latency is 300 ms
* 99 percent of requests complete within 300 ms, and 1 percent take longer
- The slowest request took 300 ms
- 99 requests took exactly 300 ms
why: A percentile is the value below which that fraction of the samples fall.
q: Why does batching raise latency?
* Early requests wait for the batch to fill
- Each request runs slower inside a batch
- The network adds one hop per batch
- The server sorts the batch first
why: The first request in a batch of 8 at 100 per second waits 70 ms for 7 more arrivals before any work starts.
q: 1,000 requests: 20 take 5 seconds and the rest take 10 ms. What is the mean latency?
- About 10 ms
- About 50 ms
* About 110 ms
- About 5 seconds
why: The sum is 980 times 10 plus 20 times 5,000, which is 109,800 ms, and divided by 1,000 that is 109.8 ms.
q: Why must you not average the p99 of each server to get the fleet p99?
- Averages are too slow to compute
* The fleet p99 is not the mean of the per-server values; merge the histograms first
- Each server reports in a different unit
- The p99 is already an average
why: Percentiles do not add or average, so you merge the latency histograms and then take the percentile of the whole.
:::

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

The script below sizes the pool from the example and prints the time in system for each utilisation.

:::code
lang: python
file: littles_law.py
def pool_size(arrival_rate, time_inside_s, margin=0.5):
    L = arrival_rate * time_inside_s
    return L, round(L * (1 + margin))

for query_ms in (5, 20):
    L, pool = pool_size(1000, query_ms / 1000)
    print(f"query {query_ms} ms: L = {L:.0f}, pool with margin = {pool}")

service_rate = 1000          # requests per second, so 1 ms of service each
print("utilisation  time in system")
for rho in (0.5, 0.8, 0.9, 0.99):
    arrival = rho * service_rate
    W_ms = 1000 / (service_rate - arrival)
    print(f"{rho:>10.0%}  {W_ms:>6.0f} ms")
:::

:::code
lang: text
query 5 ms: L = 5, pool with margin = 8
query 20 ms: L = 20, pool with margin = 30
utilisation  time in system
       50%       2 ms
       80%       5 ms
       90%      10 ms
       99%     100 ms
:::

## Try it

:::exercise
title: Size a GPU batch pool
task: An LLM server receives 200 requests per second. Each request stays inside for 1.5 seconds. Compute L and the pool size with a 50 percent margin. Then a second server completes at most 400 requests per second and receives 360 per second. Compute its utilisation and its average time in system with the single-server formula.
hint: L equals the arrival rate times the time inside. Utilisation is arrival rate divided by service rate. W equals 1 divided by (service rate minus arrival rate).
lang: python
solution:
arrival = 200
time_inside_s = 1.5
L = arrival * time_inside_s                    # 300 requests inside
pool = L * 1.5                                 # 450 slots with a 50 percent margin
print(f"L = {L:.0f}, pool = {pool:.0f}")

service_rate = 400
arrival2 = 360
rho = arrival2 / service_rate                  # 0.9
W = 1 / (service_rate - arrival2)              # 0.025 s
print(f"utilisation {rho:.0%}, time in system {W * 1000:.0f} ms")   # 90 percent, 25 ms
:::

## Common mistakes

- Mistake: size a pool from the average arrival rate. Fix: use the peak rate, because the queue forms at peak.
- Mistake: run servers at 95 percent utilisation to save money. Fix: keep 30 percent headroom, because latency grows without limit near 100 percent.
- Mistake: let the queue grow without limit. Fix: bound the queue, because a long queue only delays the failure.
- Mistake: measure service time without the wait time. Fix: measure the full time inside, from arrival to departure.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: Little's law and queueing
q: A queue receives 200 items per second and each item waits 2 seconds. How many items are in the queue?
- 100
* 400
- 800
- 2
why: L equals the arrival rate times the time inside, 200 times 2, which is 400 items.
q: A server completes 500 requests per second and receives 450. What is its utilisation?
- 10 percent
- 50 percent
* 90 percent
- 111 percent
why: Utilisation is the arrival rate divided by the service rate, 450 divided by 500.
q: A server has a service rate of 1,000 per second and receives 950 per second. What is the average time in system?
- 1 ms
* 20 ms
- 50 ms
- 100 ms
why: W equals 1 divided by (1,000 minus 950), which is 0.02 seconds.
q: Why does latency grow so fast near full utilisation?
- The CPU runs hotter and slows down
* The wait scales with 1 divided by (1 minus utilisation), which goes to infinity at 100 percent
- The network link saturates first
- Threads leak memory under load
why: The single-server formula has (1 minus utilisation) in the denominator, so the last few percent of load add most of the wait.
q: You size a connection pool. Which input leads to a pool that is too small?
* The average arrival rate instead of the peak rate
- The peak arrival rate
- The time inside, including waits
- A margin of 50 percent
why: The queue forms at the peak, so L computed from the average rate is smaller than what the peak needs.
:::

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

The script below computes the downtime each target allows, the budget from the example, and a burn rate.

:::code
lang: python
file: error_budget.py
MINUTES_PER_MONTH = 30 * 24 * 60

def allowed_downtime(slo_percent):
    return MINUTES_PER_MONTH * (100 - slo_percent) / 100

for slo in (99, 99.9, 99.95, 99.99):
    print(f"{slo} percent allows {allowed_downtime(slo):.1f} minutes per month")

requests_per_month = 10_000_000
slo = 99.9
budget = requests_per_month * (100 - slo) / 100
spent = [4000, 3000]
remaining = budget - sum(spent)
print(f"budget {budget:.0f} failed requests, remaining {remaining:.0f} ({remaining / budget:.0%})")
if remaining / budget <= 0.30:
    print("policy: freeze releases")

# burn rate: the share of the 30-day budget used in one hour, scaled to the window
errors_last_hour = 200
burn_rate = (errors_last_hour / budget) * (30 * 24)
print(f"burn rate {burn_rate:.1f}")
:::

:::code
lang: text
99 percent allows 432.0 minutes per month
99.9 percent allows 43.2 minutes per month
99.95 percent allows 21.6 minutes per month
99.99 percent allows 4.3 minutes per month
budget 10000 failed requests, remaining 3000 (30%)
policy: freeze releases
burn rate 14.4
:::

## Try it

:::exercise
title: Spend a 99.95 percent budget
task: An API serves 50 million requests per month with an SLO of 99.95 percent. Compute the error budget in failed requests and in minutes of full downtime. In week 1 an outage fails 12,000 requests. Compute the remaining budget as a percentage. Does the 30 percent freeze policy trigger?
hint: The budget is 0.05 percent of the requests and 0.05 percent of 43,200 minutes.
lang: python
solution:
requests = 50_000_000
slo = 99.95
budget = requests * (100 - slo) / 100              # 25,000 failed requests
minutes = 43_200 * (100 - slo) / 100               # 21.6 minutes
spent = 12_000
remaining = (budget - spent) / budget              # 52 percent
print(f"budget {budget:.0f} requests, {minutes:.1f} minutes")
print(f"remaining {remaining:.0%}, freeze: {remaining <= 0.30}")   # 52%, freeze: False
:::

## Common mistakes

- Mistake: set the SLO at 100 percent. Fix: pick a target below 100, because no system is perfect and the budget enables change.
- Mistake: measure the SLI inside the server. Fix: measure at the load balancer or the client, where the user is.
- Mistake: alert on every error. Fix: alert on burn rate, because a few errors are inside the budget.
- Mistake: set the SLA equal to the SLO. Fix: keep the SLA looser, so you have time to react.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: SLOs and error budgets
q: How many minutes of downtime per month does 99.95 percent allow?
- 43 minutes
* About 21.6 minutes
- 4.3 minutes
- 2.2 hours
why: 0.05 percent of 43,200 minutes is 21.6 minutes.
q: What is an error budget?
- The number of bugs a release may contain
* The amount of failure the SLO allows in a window, such as 10,000 failed requests
- The money set aside for incidents
- The number of alerts per month
why: The budget is 100 percent minus the SLO, applied to the events in the window.
q: Why set the SLO slightly below the measured value?
- It makes the SLA easier to sign
* A target you already miss gives no useful signal
- Users prefer lower targets
- It reduces the number of metrics
why: An SLO you miss every day never changes a decision, so it is set from 4 weeks of data at a value you meet.
q: A 30-day budget burns at a rate of 14.4. When is it gone?
- In 14.4 hours
* In about 2 days
- In 30 days
- In 1 hour
why: A burn rate of 1 uses the budget in 30 days, so 14.4 uses it in 30 divided by 14.4, about 2.1 days.
q: Your only dependency has a 99.9 percent SLO and you add no fallback. Can your service meet a 99.99 percent SLO?
* No, the dependency caps you at 99.9 percent
- Yes, if you retry every failed call
- Yes, if you measure the SLI inside the server
- Yes, if the SLA is looser
why: Every failure of the dependency becomes your failure unless a fallback serves the request another way.
:::

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

The script below models two replicas with replication delay and shows what an eventual read and a linearizable read return at each moment.

:::code
lang: python
file: replicas.py
class Replica:
    def __init__(self, name):
        self.name = name
        self.value = 100
        self.pending = []            # (apply_at, value) still in flight

    def read(self, now):
        for apply_at, value in list(self.pending):
            if now >= apply_at:
                self.value = value
                self.pending.remove((apply_at, value))
        return self.value

A, B = Replica("A"), Replica("B")
lag = 1.5                             # time units from A to B

# time 1: client 1 writes 50 to A; A acknowledges at time 2
A.value = 50
B.pending.append((2 + lag, 50))

for now in (3, 3.5, 4):
    print(f"t={now}: eventual read on B returns {B.read(now)}")

# a linearizable read goes to the replica that holds the latest write, or waits
print(f"t=3: linearizable read returns {A.read(3)}")
:::

:::code
lang: text
t=3: eventual read on B returns 100
t=3.5: eventual read on B returns 50
t=4: eventual read on B returns 50
t=3: linearizable read returns 50
:::

## Try it

:::exercise
title: Judge a history
task: On paper. The key x starts at 0. Client 1 writes x = 1 and gets an acknowledgement at time 2. Client 2 reads x at time 3 and gets 1. Client 2 reads x again at time 5 and gets 0. For each of the four models, say whether this history is allowed and why.
hint: Look at the two reads of client 2 in order. Which models allow one client to see a new value and then an older value?
lang: text
solution:
Linearizable: not allowed. The write finished at time 2, so both reads must return 1.
Sequential: not allowed. Client 2 saw 1 and then 0, which reverses the single order of operations.
Causal: not allowed. The two reads come from one client in program order, and the second read goes backwards.
Eventual: allowed. Eventual consistency gives no rule for a single read, as long as replicas converge to 1 once writes stop.
:::

## Common mistakes

- Mistake: assume a database is linearizable because it has a leader. Fix: read the Jepsen report, because follower reads and failover often break the guarantee.
- Mistake: use eventual consistency for a uniqueness check. Fix: route uniqueness checks to a linearizable store.
- Mistake: believe CAP forces a choice at all times. Fix: the choice applies only during a partition; in normal operation you trade latency.
- Mistake: test consistency on one machine. Fix: test with real replicas and injected partitions.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: consistency models
q: Under linearizability, can a read return a value older than a write that completed before the read started?
* No
- Yes, if the read goes to a follower
- Yes, if the write was on a different replica
why: Linearizability places every operation at one instant in real time, so a read after a completed write sees that write.
q: What does eventual consistency guarantee about a single read?
- The value is at most 1 second old
- The latest value
* Nothing, only that replicas converge once writes stop
- The value from a majority of replicas
why: Eventual consistency is a promise about convergence, not about any one read.
q: During a network partition, what does a linearizable system do with a write on the isolated side?
- Accepts it and merges later
* Refuses it
- Accepts it and discards it later
- Forwards it when the partition heals
why: The isolated replica cannot know the latest value, so it must refuse rather than return a wrong answer.
q: Replicas A and B hold balance 100. A write of 50 is acknowledged on A at time 2, and B applies it at time 3.5. What does an eventual read on B return at time 3?
* 100
- 50
- An error
- 75
why: At time 3 the record has not reached B, so B still holds 100.
q: Which operation needs linearizability?
- Reading a profile picture
- Counting likes on a post
* Claiming a unique username
- Showing a feed
why: Two clients must not both succeed in claiming one name, so the check needs one agreed order of operations.
q: When does the CAP trade-off between consistency and availability apply?
- At all times
* Only during a network partition
- Only in normal operation
- Only with more than 3 replicas
why: Without a partition a system can give both; the theorem is about what it drops when replicas cannot talk.
:::

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
      level: 'intermediate',
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

:::video
id: zsjvFFKOm3c
why: Watch all 2 minutes. Note how a query names tables and columns and lets the database find the rows, which is the relational side of this lesson.
:::

:::video
id: G1rOthIU-uo
why: Watch all 2 minutes. Note that every operation is get or set on one key, which is the key-value side of this lesson.
:::

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

The SQL below builds the three tables and runs both queries. Save it as feed.sql and run sqlite3 :memory: with the file as input.

:::code
lang: sql
file: feed.sql
CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE posts (id INTEGER PRIMARY KEY, user_id INTEGER, created_at INTEGER, body TEXT);
CREATE TABLE follows (follower_id INTEGER, followee_id INTEGER);
CREATE INDEX posts_by_user ON posts (user_id, created_at);

INSERT INTO users VALUES (42, 'ada'), (7, 'linus');
INSERT INTO follows VALUES (42, 7);
INSERT INTO posts VALUES (1, 7, 100, 'hello'), (2, 7, 200, 'again');

-- Query 1: the newest posts of one user, one index lookup
SELECT id, body FROM posts WHERE user_id = 7 ORDER BY created_at DESC LIMIT 10;

-- Query 2: the feed of user 42, a join over every followed user
SELECT p.id, p.body
FROM follows f JOIN posts p ON p.user_id = f.followee_id
WHERE f.follower_id = 42
ORDER BY p.created_at DESC LIMIT 10;
:::

The Python below is the key-value version of the feed. The work moves into on_post, and the read is one dictionary lookup.

:::code
lang: python
file: kv_feed.py
feed = {}                            # key feed:<user> -> newest post ids
followers = {7: [42, 43, 44]}

def on_post(author, post_id):
    for f in followers[author]:      # one write per follower
        key = f"feed:{f}"
        feed.setdefault(key, []).insert(0, post_id)
        del feed[key][10:]           # keep the 10 newest

on_post(7, 1)
on_post(7, 2)
print(feed["feed:42"])               # one lookup: [2, 1]
print(len(followers[7]), "writes per post")
:::

## Try it

:::exercise
title: Design the keys
task: On paper. The social network needs three queries: the profile of a user, the list of users who follow a user, and the feed of a user. Write the key you would use for each query in a key-value store. Then list every write that happens when user 42 follows user 7, and every write that happens when user 7 posts.
hint: Each query must be one lookup, so each needs its own key. A follow changes two lists. A post changes one feed per follower.
lang: text
solution:
Keys:
  profile:42        -> the profile of user 42
  followers:7       -> the list of users who follow user 7
  following:42      -> the list of users that 42 follows (needed to rebuild a feed)
  feed:42           -> the 10 newest post ids for user 42

User 42 follows user 7:
  append 42 to followers:7
  append 7 to following:42
  (2 writes)

User 7 posts:
  write the post under post:<id>
  for each user in followers:7, insert the id at the front of feed:<user>
  (1 write plus one write per follower; 200 followers means 201 writes)
:::

## Common mistakes

- Mistake: pick a key-value store before you know the queries. Fix: list the queries first, because the key design must match them.
- Mistake: run a join across services with a loop of key lookups. Fix: precompute the joined value, or use a relational store.
- Mistake: assume a key-value store gives transactions across keys. Fix: read the documentation, because most give atomicity for one key only.
- Mistake: store a 10 MB value under one key. Fix: split large values, because one hot key limits throughput.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: relational versus key-value
q: What is a join?
- A copy of a table on another node
* A query that combines rows from two tables that share a key
- An index over two columns
- A transaction over two tables
why: The join matches rows in one table to rows in another by the value of a shared column.
q: Why is the feed lookup fast in a key-value store?
- Memory is faster than disk
* The feed is precomputed and stored under one key
- There is no schema to check
- The values are smaller
why: The work of the join was done at write time, so the read is one get on the key feed:42.
q: What cost does the key-value feed add?
- One read per follower on each feed load
* One write per follower each time a user posts
- A join at read time
- A larger schema
why: Each post appends its id to the feed of every follower, so a user with 200 followers causes 200 writes.
q: A user with 500 followers posts 4 times a day. How many feed writes does that cause per day?
- 4
- 500
* 2,000
- 125
why: Each post writes to 500 feeds, and 4 posts give 4 times 500, which is 2,000 writes.
q: Which workload should start with a relational store?
- One lookup by key at 1 million per second
- A session cache
* Many query types that change often and need transactions
- A view counter
why: The relational store makes a new query cheap to write, and transactions across rows are built in.
:::

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

The script below computes the tree height and the full-scan cost from the example.

:::code
lang: python
file: btree_height.py
import math

def levels(keys, fan_out):
    return math.ceil(round(math.log(keys) / math.log(fan_out), 9))

for keys, fan_out in ((250_000, 500), (100_000_000, 500), (1_000_000_000, 1000)):
    h = levels(keys, fan_out)
    print(f"{keys:>14,} keys at fan-out {fan_out:>4}: {h} levels, {h + 1} reads with the row page")

page_bytes, row_bytes, rows = 8192, 200, 100_000_000
pages = rows * row_bytes / page_bytes
print(f"full scan reads {pages / 2:,.0f} pages on average, {pages / 2 / 1000:,.0f} seconds at 1 ms each")
:::

:::code
lang: text
       250,000 keys at fan-out  500: 2 levels, 3 reads with the row page
   100,000,000 keys at fan-out  500: 3 levels, 4 reads with the row page
 1,000,000,000 keys at fan-out 1000: 3 levels, 4 reads with the row page
full scan reads 1,220,703 pages on average, 1,221 seconds at 1 ms each
:::

The SQL below builds the composite index and asks the planner for the plan of two queries. Run it with sqlite3 :memory: and the file as input. The first query uses the index. The second cannot, because created_at is the second column.

:::code
lang: sql
file: index.sql
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, created_at INTEGER, total REAL);
CREATE INDEX orders_by_customer_date ON orders (customer_id, created_at);

EXPLAIN QUERY PLAN
SELECT * FROM orders WHERE customer_id = 42 AND created_at > 20240301;

EXPLAIN QUERY PLAN
SELECT * FROM orders WHERE created_at > 20240301;
:::

## Try it

:::exercise
title: Read the plan and count the levels
task: Run index.sql in sqlite3 and read the two plans. Write down which one says SEARCH with the index and which one says SCAN. Then compute by hand how many levels a B-tree needs for 10 billion keys with a fan-out of 200, and how many disk reads one lookup costs when the top two levels are in memory.
hint: 200 to the power 4 is 1.6 billion, which is less than 10 billion. Each level below the ones in memory costs one read, plus one read for the row page.
lang: text
solution:
Plan 1: SEARCH orders USING INDEX orders_by_customer_date (customer_id=? AND created_at>?)
Plan 2: SCAN orders

Levels for 10 billion keys at fan-out 200:
  200 to the power 4 = 1.6 billion, too small
  200 to the power 5 = 320 billion, enough
  so 5 levels

Reads per lookup with the top 2 levels in memory:
  3 index levels on disk + 1 row page = 4 reads, about 4 ms on an SSD
:::

## Common mistakes

- Mistake: add an index on every column. Fix: index the columns in your slowest queries only, because each index slows every write.
- Mistake: put the range column first in a composite index. Fix: put the equality column first.
- Mistake: index a column with 2 distinct values. Fix: skip it, because the index returns half the table and a scan is faster.
- Mistake: trust that a query uses an index. Fix: run EXPLAIN and read the plan.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: indexes and B-trees
q: How many levels does a B-tree need for 1 billion keys with a fan-out of 1,000?
* 3
- 9
- 30
- 1,000
why: 1,000 to the power 3 is 1 billion, so 3 levels of 1,000 pointers each reach every key.
q: Why does an index slow inserts?
- The index locks the whole table
* Each insert must also write one page per index
- The tree is rebuilt after each insert
- Reads block writes
why: The row page is one write, and every index on the table adds one more page write for its new key.
q: Which column order fits the query "where user = 7 and date > X"?
* (user, date)
- (date, user)
- Either order works the same
- date only
why: The equality column goes first so the matching rows sit together, and the range column second keeps them in date order.
q: When is a full scan faster than an index lookup?
- When the table has a primary key
* When the query returns a large fraction of the table
- When the table is larger than memory
- Never
why: Sequential reads are about 10 times faster than random reads on an SSD, so above roughly 10 percent of rows a scan wins.
q: A table has 12 indexes. How many pages does one insert write?
- 1
- 12
* 13
- 24
why: One page for the row plus one page for each of the 12 indexes.
:::

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

The script below is a tiny LSM tree: a memtable that flushes to sorted files, a read that checks each level, and the write amplification arithmetic.

:::code
lang: python
file: lsm.py
import bisect

MEMTABLE_LIMIT = 3
memtable = {}
sstables = []                      # sorted lists of (key, value), newest first

def put(key, value):
    memtable[key] = value
    if len(memtable) >= MEMTABLE_LIMIT:
        sstables.insert(0, sorted(memtable.items()))   # flush: one sequential write
        memtable.clear()

def get(key):
    if key in memtable:
        return memtable[key], "memtable"
    for i, table in enumerate(sstables):
        keys = [k for k, _ in table]
        j = bisect.bisect_left(keys, key)
        if j < len(keys) and keys[j] == key:
            return table[j][1], f"sstable {i}"
    return None, "not found"

for i in range(7):
    put(f"user:{i}", f"v{i}")
print(f"{len(sstables)} sstables on disk, {len(memtable)} key in the memtable")
print(get("user:1"))
print(get("user:6"))

T, L, user_mb_per_s = 10, 5, 5
amplification = T * L / 2
print(f"write amplification about {amplification:.0f}, disk writes {user_mb_per_s * amplification:.0f} MB per second")
:::

:::code
lang: text
2 sstables on disk, 1 key in the memtable
('v1', 'sstable 1')
('v6', 'memtable')
write amplification about 25, disk writes 125 MB per second
:::

## Try it

:::exercise
title: Size an LSM store
task: A store has a 128 MB memtable, a size ratio T of 8, and 4 levels. Users write 20 MB per second. The SSD writes 500 MB per second sequentially. Compute the total capacity, the write amplification, and the disk write rate. Then say whether the disk write rate is below half of the SSD limit, and what you would change if it is not.
hint: Capacity is about T to the power L times the memtable size. Amplification is about T times L divided by 2.
lang: python
solution:
memtable_mb = 128
T, L = 8, 4
user_mb_per_s = 20
ssd_limit = 500

capacity_gb = memtable_mb * pow(T, L) / 1000          # 524 GB
amplification = T * L / 2                             # 16
disk_mb_per_s = user_mb_per_s * amplification         # 320 MB per second
print(f"capacity {capacity_gb:.0f} GB, amplification {amplification:.0f}")
print(f"disk writes {disk_mb_per_s:.0f} MB per second, limit for safety {ssd_limit / 2:.0f}")
print("ok" if disk_mb_per_s < ssd_limit / 2 else "too high: lower T, add a disk, or spread writes over more nodes")
:::

## Common mistakes

- Mistake: turn off the write-ahead log for speed. Fix: keep it, because the memtable is lost on a crash.
- Mistake: ignore compaction load. Fix: measure disk writes, because compaction can consume the whole disk bandwidth.
- Mistake: assume reads are as fast as a B-tree. Fix: budget 2 to 5 disk reads for a cold read.
- Mistake: delete a large key range and expect space back at once. Fix: wait for compaction or trigger a manual one.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: log-structured merge trees
q: What makes LSM writes fast?
- The store has no write-ahead log
* Writes go to memory and then to disk as sequential sorted files
- Keys are smaller than in a B-tree
- Values are compressed
why: An SSD writes sequential data about 10 times faster than it handles random page updates.
q: What does a Bloom filter answer for one file?
- The exact position of the key
- The value of the key
* Whether the key is definitely absent
- Whether the key is definitely present
why: A Bloom filter says "definitely not here" or "maybe here", which skips most files on a read.
q: What does a write amplification of 25 mean?
- The store has 25 levels
* Each user byte causes about 25 bytes of disk writes over its lifetime
- Each level has 25 files
- Writes are 25 times slower than reads
why: Compaction rewrites each byte at every level it passes through, so the disk writes many times the user bytes.
q: T is 10, L is 4, and users write 8 MB per second. What is the disk write rate?
- 40 MB per second
- 80 MB per second
* 160 MB per second
- 320 MB per second
why: The amplification is 10 times 4 divided by 2, which is 20, and 8 times 20 is 160 MB per second.
q: Which workload fits a B-tree better than an LSM tree?
- Time-series ingest
- Log storage
* Read heavy with many range scans
- Write heavy counters
why: A B-tree reads a key in 2 or 3 page reads and scans in order, while an LSM read checks several levels.
q: What happens to a deleted key in an LSM tree?
- It is removed from every file at once
* It becomes a tombstone until compaction reaches the bottom level
- It moves back to the memtable
- It is marked in the Bloom filter
why: Deletes are writes of a marker, so the space returns only when compaction merges the marker down through the levels.
:::

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

The script below is a minimal write-ahead log. It appends the records, calls fsync, then recovers the pages from the log as if the pages were never written.

:::code
lang: python
file: wal.py
import json, os

LOG = "wal.log"
pages = {17: {"A": 100}, 92: {"B": 50}}          # the data pages on disk

def commit(txn_id, changes):
    with open(LOG, "a") as f:
        for page, key, new in changes:
            f.write(json.dumps({"txn": txn_id, "page": page, "key": key, "new": new}) + "\\n")
        f.write(json.dumps({"txn": txn_id, "commit": True}) + "\\n")
        f.flush()
        os.fsync(f.fileno())                     # the expensive step
    return "committed"                           # the pages are written later

def recover():
    records = [json.loads(line) for line in open(LOG)]
    committed = {r["txn"] for r in records if r.get("commit")}
    for r in records:
        if "page" in r and r["txn"] in committed:
            pages[r["page"]][r["key"]] = r["new"]

if os.path.exists(LOG):
    os.remove(LOG)
print(commit(501, [(17, "A", 70), (92, "B", 80)]))
print("pages before recovery:", pages)           # the power failed before the page writes
recover()
print("pages after recovery: ", pages)
:::

:::code
lang: text
committed
pages before recovery: {17: {'A': 100}, 92: {'B': 50}}
pages after recovery:  {17: {'A': 70}, 92: {'B': 80}}
:::

## Try it

:::exercise
title: Measure fsync and group commit
task: Write a script that appends 200 records of 100 bytes to a file and calls fsync after each one, and times it. Then append 200 records with one fsync at the end, and time that. From the first time, compute the maximum commits per second without group commit on your disk.
hint: Use time.perf_counter() around each loop. The maximum commit rate is 200 divided by the seconds the first loop took.
lang: python
solution:
import os, time

record = b"x" * 100

def run(fsync_each):
    with open("wal_test.log", "wb") as f:
        start = time.perf_counter()
        for _ in range(200):
            f.write(record)
            if fsync_each:
                f.flush()
                os.fsync(f.fileno())
        if not fsync_each:
            f.flush()
            os.fsync(f.fileno())
        return time.perf_counter() - start

each = run(True)
group = run(False)
os.remove("wal_test.log")
print(f"fsync per record: {each * 1000:.0f} ms, {200 / each:,.0f} commits per second at most")
print(f"one fsync for 200: {group * 1000:.1f} ms, {200 / group:,.0f} commits per second")
:::

## Common mistakes

- Mistake: disable fsync to speed up commits. Fix: keep fsync on and use group commit, because a crash loses the last seconds of data.
- Mistake: put the log and the data on a slow shared disk. Fix: put the log on its own fast device, because fsync latency sets the commit rate.
- Mistake: never checkpoint. Fix: checkpoint on a timer, because recovery time grows with the log.
- Mistake: delete old log segments before a backup copies them. Fix: archive segments first, or point-in-time restore fails.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: the write-ahead log
q: Why does the database write the log before the data page?
- The log is smaller, so it is faster to read
* A crash between the two leaves a record that recovery can replay
- Pages are read more often than the log
- The log is compressed
why: If the page write fails halfway, the log still holds the committed change and recovery applies it again.
q: At 2 ms per fsync, what is the maximum commit rate without group commit?
- 50 per second
* 500 per second
- 2,000 per second
- 5,000 per second
why: One commit per fsync and 500 fsync calls fit in one second at 2 ms each.
q: What does recovery do with a transaction that has no commit record?
- Applies its changes
* Undoes or ignores its changes
- Applies them if the pages were already written
- Waits for the client to confirm
why: Without a commit record the client never received a commit, so recovery must not apply the partial transaction.
q: Each fsync takes 4 ms and carries 8 commits with group commit. What is the commit rate?
- 250 per second
* 2,000 per second
- 8,000 per second
- 32 per second
why: 250 fsync calls per second times 8 commits per call gives 2,000 commits per second.
q: What is the purpose of a checkpoint?
- It compresses the log
* Recovery starts from it instead of from the start of the log
- It makes fsync faster
- It copies the log to the replicas
why: A checkpoint records the log position up to which all pages are on disk, so recovery replays only the records after it.
:::

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
      level: 'intermediate',
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

The script below models a leader log, a lagging follower, and the read-your-writes check with a log position.

:::code
lang: python
file: replication.py
class Leader:
    def __init__(self):
        self.log = []

    def write(self, key, value):
        self.log.append((key, value))
        return len(self.log)                      # the log position of this write

class Follower:
    def __init__(self, leader):
        self.leader, self.applied, self.data = leader, 0, {}

    def catch_up(self, up_to):
        for key, value in self.leader.log[self.applied:up_to]:
            self.data[key] = value
        self.applied = up_to

    def read(self, key, min_position=0):
        if self.applied < min_position:
            return "lagging, route the read to the leader"
        return self.data.get(key, "unpaid")

leader = Leader()
follower2 = Follower(leader)
position = leader.write("order 501", "paid")
print("read without a position:", follower2.read("order 501"))
print("read-your-writes:       ", follower2.read("order 501", position))
follower2.catch_up(position)
print("after catch up:         ", follower2.read("order 501", position))
:::

:::code
lang: text
read without a position: unpaid
read-your-writes:        lagging, route the read to the leader
after catch up:          paid
:::

## Try it

:::exercise
title: Compute the lag after a burst
task: A leader receives 1,000 writes per second for a 10 minute burst. The follower applies at most 800 writes per second. Compute how many records behind the follower is at the end of the burst, and how many seconds of lag that is. After the burst the leader receives 300 writes per second. Compute how long the follower takes to catch up. Finally, say how many writes an asynchronous failover at the end of the burst would lose.
hint: The lag grows by 200 records per second during the burst. After the burst the follower gains 500 records per second on the leader.
lang: python
solution:
leader_rate, follower_rate, burst_s = 1000, 800, 600
behind = (leader_rate - follower_rate) * burst_s          # 120,000 records
lag_s = behind / follower_rate                             # 150 seconds
print(f"{behind:,} records behind, {lag_s:.0f} seconds of lag")

after_rate = 300
catch_up_s = behind / (follower_rate - after_rate)         # 240 seconds
print(f"catch up in {catch_up_s:.0f} seconds")
print(f"an asynchronous failover now loses up to {behind:,} writes")
:::

## Common mistakes

- Mistake: serve a read after a write from any follower. Fix: route the read to the leader or wait for the write position.
- Mistake: use synchronous replication to all followers. Fix: use one synchronous follower, because one slow follower would stop all writes.
- Mistake: promote a follower without fencing the old leader. Fix: stop the old leader first, or you get two leaders.
- Mistake: ignore the lag metric. Fix: alert when lag passes a few seconds, because a follower that is minutes behind is not a safe failover target.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: leader and follower replication
q: Where do writes go in leader-follower replication?
- To any replica
* Only to the leader
- To the nearest follower
- To the leader and a follower, chosen by the client
why: One leader orders all writes, and the followers copy its log in that order.
q: What is replication lag?
- The time one write takes on the leader
* The delay between a write on the leader and the same write on a follower
- The network round trip between replicas
- The failover timeout
why: Lag is the gap between the log position of the leader and the position a follower has applied.
q: The leader writes to disk in 1 ms and the round trip to a follower is 1 ms. What is the latency of a synchronous write to one follower?
- 1 ms
* 2 ms
- 3 ms
- 0.5 ms
why: The leader writes locally, sends the record, and waits for the confirmation, so 1 plus 1 ms.
q: What is split brain?
- A follower that is minutes behind
- A client that reads stale data
* Two machines both act as leader and accept different writes
- A leader that crashes during a write
why: When the old leader was only slow, it keeps accepting writes while the promoted follower also accepts them.
q: Why not replicate synchronously to every follower?
- It uses too much disk
* One slow follower would stop all writes
- Followers could not serve reads
- Data loss would increase
why: A synchronous write waits for each follower, so the slowest or a dead one blocks every commit.
q: What is the purpose of fencing during failover?
- To speed up the catch-up of followers
* To stop the old leader from accepting writes before the new one starts
- To pick the follower with the most recent log
- To detect the failure faster
why: Fencing shuts down the old leader or rejects its writes, which prevents split brain.
:::

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

The script below checks every pair of W and R for N = 3 by brute force, then runs the write and read from the example.

:::code
lang: python
file: quorum.py
import itertools

def overlaps(N, W, R):
    # True when every write set of size W shares a node with every read set of size R
    nodes = range(N)
    for ws in itertools.combinations(nodes, W):
        for rs in itertools.combinations(nodes, R):
            if not set(ws) & set(rs):
                return False
    return True

N = 3
for W in (1, 2, 3):
    brute = [int(overlaps(N, W, R)) for R in (1, 2, 3)]
    rule = [int(W + R > N) for R in (1, 2, 3)]
    print(f"W={W}: by brute force {brute}, by W + R > N {rule}")

# one quorum write and read with a slow replica C, as (version, value)
replicas = {"A": (1, "old"), "B": (1, "old"), "C": (1, "old")}
for name in ("A", "B"):                  # W = 2 confirm, C is slow
    replicas[name] = (2, "new")
answers = [replicas["B"], replicas["C"]]  # R = 2 answer
print("read returns", max(answers))       # the highest version wins
:::

:::code
lang: text
W=1: by brute force [0, 0, 1], by W + R > N [0, 0, 1]
W=2: by brute force [0, 1, 1], by W + R > N [0, 1, 1]
W=3: by brute force [1, 1, 1], by W + R > N [1, 1, 1]
read returns (2, 'new')
:::

## Try it

:::exercise
title: Pick W and R for 5 replicas
task: A key lives on N = 5 replicas. The store must keep working for reads and writes with 2 replicas down. List every pair of W and R that satisfies all three rules: W + R is more than 5, W is at most 3, and R is at most 3. Then say which pair you would pick for a write-heavy workload, and why there is no faster option.
hint: With f = 2 failures, W and R can each be at most N minus f, which is 3. Check each pair against W + R greater than 5.
lang: python
solution:
N, f = 5, 2
limit = N - f                                          # 3
pairs = [(W, R) for W in range(1, limit + 1) for R in range(1, limit + 1) if W + R > N]
print("allowed pairs:", pairs)                         # only (3, 3)
# A write-heavy workload would prefer a small W, but W = 2 needs R = 4,
# and R = 4 cannot be answered with 2 replicas down. So W = 3, R = 3 is the only choice.
:::

## Common mistakes

- Mistake: set W = 1 and R = 1 for speed and expect fresh reads. Fix: use W + R > N, or accept stale reads knowingly.
- Mistake: treat last-writer-wins as safe. Fix: know that it drops concurrent writes, and use version vectors for data that must not be lost.
- Mistake: enable sloppy quorums and expect the overlap guarantee. Fix: use strict quorums for keys that need fresh reads.
- Mistake: skip anti-entropy because read repair exists. Fix: run anti-entropy, because rarely read keys never get read repair.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: quorum reads and writes
q: With N = 5 and W = 3, what is the smallest R that guarantees an overlap?
- 2
* 3
- 4
- 5
why: W plus R must be more than 5, so R must be at least 3.
q: Why does W = 2, R = 2 keep working with one failed replica when N = 3?
* Two replicas remain, which is enough for both a write and a read
- The third replica is only a backup
- Writes go to one replica only
- Reads come from any one replica
why: A write needs 2 confirmations and a read needs 2 answers, and 2 replicas are still up.
q: N = 3, W = 1, R = 1. A client writes to A, and another client reads from C right after. What does the read return?
- Always the new value
* Possibly the old value
- An error
- Nothing until replication finishes
why: W plus R is 2, not more than 3, so the write set and the read set need not share a replica.
q: What does hinted handoff do?
- The client retries the write on another replica
* A spare replica stores a write for a down replica and delivers it later
- A reader writes the newest value back to stale replicas
- The leader hands its role to a follower
why: The spare holds the write with a hint that names the intended replica, and forwards it when that replica returns.
q: Is a quorum with W + R more than N linearizable in general?
- Yes, always
* No
- Yes, if W equals N
- Yes, with read repair
why: Concurrent writes and partial failures can produce histories that no single order explains, so a consensus protocol is needed for linearizability.
q: Two writes with the same version land on different replicas at the same time. What does last-writer-wins do?
- Merges both values
* Keeps the write with the later timestamp and drops the other
- Rejects both writes
- Asks the client to choose
why: Last-writer-wins resolves the conflict by timestamp, which silently loses one of the writes.
:::

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

The script below checks a small history by trying every order of the operations, as the procedure above describes.

:::code
lang: python
file: linearizable.py
import itertools

# (client, op, value, start, end) for one register that starts at 0
history = [
    (1, "write", 5, 0, 10),
    (2, "read", 5, 4, 6),
    (3, "read", 0, 12, 14),
]

def valid_order(order):
    # an operation that ended before another started must come first
    for a, b in itertools.combinations(order, 2):
        if b[4] < a[3]:
            return False
    value = 0
    for _, op, v, _, _ in order:
        if op == "write":
            value = v
        elif v != value:
            return False
    return True

def linearizable(history):
    return any(valid_order(p) for p in itertools.permutations(history))

print("history 1, client 3 reads 0:", linearizable(history))
history[2] = (3, "read", 5, 12, 14)
print("history 2, client 3 reads 5:", linearizable(history))
print("overlapping read of 0:", linearizable([(1, "write", 5, 0, 10), (2, "read", 0, 2, 4)]))
:::

:::code
lang: text
history 1, client 3 reads 0: False
history 2, client 3 reads 5: True
overlapping read of 0: True
:::

## Try it

:::exercise
title: Judge a four-operation history
task: On paper first. The register starts at 0. Client 1 writes 1 from 0 to 5 ms. Client 2 reads 1 from 2 to 3 ms. Client 3 writes 2 from 4 to 9 ms. Client 4 reads 1 from 10 to 12 ms. Decide whether the history is linearizable and explain which two constraints conflict. Then add the history to linearizable.py and confirm the answer.
hint: The read of 1 at 2 to 3 ms forces write(1) before 3 ms. The read of 1 at 10 to 12 ms forces write(2) before write(1). Can both hold?
lang: python
solution:
# On paper: client 2 read 1 by 3 ms, so write(1) takes effect at or before 3 ms.
# Client 4 reads 1 after both writes ended, so write(2) must come before write(1).
# But write(2) cannot take effect before 4 ms, and write(1) must be before 3 ms.
# The two constraints conflict. The history is not linearizable.

import itertools

def valid_order(order):
    for a, b in itertools.combinations(order, 2):
        if b[4] < a[3]:
            return False
    value = 0
    for _, op, v, _, _ in order:
        if op == "write":
            value = v
        elif v != value:
            return False
    return True

history = [
    (1, "write", 1, 0, 5),
    (2, "read", 1, 2, 3),
    (3, "write", 2, 4, 9),
    (4, "read", 1, 10, 12),
]
print(any(valid_order(p) for p in itertools.permutations(history)))   # False
:::

## Common mistakes

- Mistake: check only the final state, not the history. Fix: record the timing of each operation, because a stale read is invisible in the final state.
- Mistake: read from a follower and call it linearizable. Fix: read through the leader with a read index, or accept a weaker model.
- Mistake: use a lock without a fencing token. Fix: include the token in each write, because a client can pause past its lock expiry.
- Mistake: put all data in the consensus store. Fix: store only coordination data there, because each write costs a majority round trip.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: linearizability in practice
q: Can a read that overlaps a write return the old value?
- Never
* Yes, as long as one ordering of instants explains all operations
- Only on a follower
- Only if the read started before the write started
why: Each operation takes effect at one instant inside its interval, and the read may be placed before the write.
q: Which primitive gives a unique-name check?
- A read followed by a write
* Compare-and-set
- A time to live
- A hash of the name
why: Compare-and-set writes the name only if the slot still holds the expected empty value, in one linearizable step.
q: Why does a linearizable read need a round trip to a majority?
- Followers are slow
* The leader must confirm it has not been replaced
- The disk must fsync first
- Clients may hold a stale cache
why: A leader that was replaced by a partition could still answer from stale state, so it checks with a majority or holds a lease.
q: Client 1 writes 5 from 0 to 10 ms. Client 2 reads 0 from 12 to 14 ms. Is the history linearizable?
- Yes
* No, because the write completed before the read started
- Yes, if the read went to a follower
- It depends on the clocks
why: The read starts after the write ended, so a linearizable register must return 5.
q: What does a fencing token do?
- It speeds up lock acquisition
* The storage rejects writes that carry an older token than the last one it saw
- It replaces the lease
- It counts the operations of a client
why: A client that paused past its lock expiry still holds an old token, and the storage refuses its late writes.
:::

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

The script below prints the majority table and simulates one election with random timeouts after S1 crashes.

:::code
lang: python
file: raft_election.py
import random

def majority(n):
    return n // 2 + 1

for n in (3, 4, 5, 7):
    print(f"{n} nodes: majority {majority(n)}, survives {n - majority(n)} failures")

random.seed(7)
nodes = ["S2", "S3", "S4", "S5"]                   # S1 crashed
last_log = {"S2": 10, "S3": 10, "S4": 9, "S5": 10}
timeouts = {s: random.uniform(150, 300) for s in nodes}
candidate = min(timeouts, key=timeouts.get)
print(f"{candidate} times out first at {timeouts[candidate]:.0f} ms and asks for votes")

votes = 1                                           # the candidate votes for itself
for s in nodes:
    if s != candidate and last_log[s] <= last_log[candidate]:
        votes += 1                                  # the log of the candidate is as complete
needed = majority(5)
result = "leader" if votes >= needed else "no leader, try again"
print(f"votes {votes} of 5, needed {needed}: {result}")
:::

## Try it

:::exercise
title: Who can win the election?
task: On paper. A 5-node cluster has leader S1 in term 3. S1 appends index 11 to its own log and to S2, then crashes before any other node receives it. S3, S4, and S5 have logs up to index 10. Answer three questions. Is index 11 committed? Which nodes can win the next election? If S4 wins, what happens to index 11 on S2?
hint: An entry is committed when a majority holds it. A node votes for a candidate whose log is at least as complete as its own.
lang: text
solution:
1. Index 11 is on 2 of 5 nodes. That is not a majority, so it is not committed.
   S1 never replied to the client.

2. S2 can win: S3, S4, and S5 have shorter logs, so all three vote for S2.
   S3, S4, or S5 can also win: each needs 2 more votes, and the other two
   nodes with index 10 will vote for it. S2 refuses, because its log is longer.
   So any of S2 to S5 can win, depending on who times out first.

3. If S4 wins, it sends AppendEntries with its own log. S2 finds that index 11
   does not match and deletes it. This is safe, because index 11 was never committed.
:::

## Common mistakes

- Mistake: run an even number of nodes. Fix: use 3 or 5, because 4 nodes survive the same 1 failure as 3.
- Mistake: spread 3 nodes across 2 datacenters. Fix: use 3 datacenters, because losing the one with 2 nodes removes the majority.
- Mistake: set election timeouts shorter than the network round trip. Fix: set the timeout to at least 10 times the round trip.
- Mistake: apply an entry as soon as the leader appends it. Fix: apply only after the commit index passes the entry.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: Raft consensus
q: How many nodes does a cluster need to survive 2 failures?
- 3
- 4
* 5
- 6
why: N must be at least 2f plus 1, and with f = 2 that is 5.
q: When is a log entry committed?
- When the leader appends it to its own log
* When the leader knows a majority of nodes hold it
- When every node holds it
- When the client acknowledges it
why: A majority guarantees that any future leader, elected by a majority, holds the entry.
q: Why do randomised election timeouts help?
- They save network bandwidth
* One node usually times out first and wins before the others start competing
- They make terms longer
- They keep the clocks in sync
why: If all nodes timed out together they would split the vote every time, and no leader would emerge.
q: A 7-node cluster loses 4 nodes. What happens to writes?
- They continue on the 3 remaining nodes
* They stop, because 3 is not a majority of 7
- They continue on the leader only
- They continue as reads only
why: The majority of 7 is 4, and the 3 remaining nodes cannot commit any entry.
q: When does a node vote for a candidate?
- When the candidate has the lowest id
* When the candidate's log is at least as complete as its own and it has not voted this term
- When the candidate has the shortest timeout
- Whenever the candidate is in a newer term
why: The log rule ensures that the new leader holds every committed entry.
q: 3 nodes sit in 2 datacenters, and the datacenter with 2 nodes goes offline. What happens?
- The remaining node continues as leader
* The cluster stops, because 1 node is not a majority
- The remaining node elects itself
- Writes continue asynchronously
why: A single node cannot form a majority of 3, so the cluster is unavailable until the other datacenter returns.
:::

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
      level: 'intermediate',
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

The script below counts how many of 1,000 keys move from 4 to 5 nodes with each method. The ring uses 50 virtual nodes per physical node.

:::code
lang: python
file: ring.py
import bisect, hashlib

def h(s):
    return int(hashlib.md5(s.encode()).hexdigest(), 16) % pow(2, 32)   # a stable hash

class Ring:
    def __init__(self, nodes, vnodes=50):
        self.points = sorted((h(f"{n}#{i}"), n) for n in nodes for i in range(vnodes))
        self.positions = [p for p, _ in self.points]

    def owner(self, key):
        i = bisect.bisect_left(self.positions, h(key))
        return self.points[i % len(self.points)][1]     # wrap to the first node

keys = [f"key{i}" for i in range(1000)]

moved = sum(h(k) % 4 != h(k) % 5 for k in keys)
print(f"modulo hashing: {moved / 10:.0f} percent of keys moved")

r4 = Ring(["A", "B", "C", "D"])
r5 = Ring(["A", "B", "C", "D", "E"])
moved = sum(r4.owner(k) != r5.owner(k) for k in keys)
print(f"consistent hashing: {moved / 10:.0f} percent of keys moved")
:::

## Try it

:::exercise
title: Walk the ring by hand
task: On paper. The ring has positions 0 to 99. Nodes sit at A 10, B 35, C 60, and D 85. Keys sit at 5, 33, 61, and 99. Write the owner of each key. Then remove node B. Write which keys change owner and where they go.
hint: A key belongs to the first node clockwise from its position. A key past the last node wraps to the first node.
lang: text
solution:
Owners with 4 nodes:
  key 5  -> A at 10
  key 33 -> B at 35
  key 61 -> D at 85
  key 99 -> A at 10 (wraps past D)

Remove B at 35:
  only keys in the arc from 10 to 35 change owner
  key 33 -> C at 60
  keys 5, 61, and 99 keep their owner
  1 of 4 keys moved, and all of them went to one neighbour, C
:::

## Common mistakes

- Mistake: use modulo hashing for a cache cluster. Fix: use consistent hashing, because a resize empties most of the cache.
- Mistake: put each physical node once on the ring. Fix: use 100 or more virtual nodes per physical node.
- Mistake: hash with a function that differs between languages. Fix: use one named stable hash in every client.
- Mistake: partition time-series data by range on the timestamp. Fix: hash by a device id, then range by time within the partition.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: consistent hashing
q: With modulo hashing, about what fraction of keys moves when you go from 9 to 10 nodes?
- About 10 percent
- About 50 percent
* About 90 percent
- None
why: Modulo hashing moves about N divided by (N plus 1) of the keys, which is 9 of 10.
q: With consistent hashing, about what fraction moves from 9 to 10 nodes?
* About 10 percent
- About 90 percent
- About 50 percent
- None
why: Only the keys in the arc the new node takes over move, about 1 divided by (N plus 1).
q: Which node owns a key whose position is past the last node on the ring?
- The last node
* The first node, by wrap-around
- No node, the key is dropped
- A new node is created
why: The ring has no end, so the search wraps to the smallest node position.
q: Why use virtual nodes?
- They use less memory
* They make the arcs even, so each node owns about the same share
- They make the hash faster
- They stop keys from moving at all
why: With 100 or more positions per node the random arcs average out to within a few percent.
q: Nodes sit at 10, 35, 60, and 85. Which node owns a key at position 70?
- The node at 60
* The node at 85
- The node at 10
- The node at 35
why: The first node clockwise from 70 is at 85.
q: Time-series data is range partitioned by timestamp. What is the problem?
- Range scans become slow
* All current writes land on one node
- The hash function collides
- Keys move on every write
why: New timestamps are all in the newest range, so one partition takes every write while the others idle.
:::

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

The script below plans the moves for the fourth node and computes the copy time at each rate.

:::code
lang: python
file: rebalance.py
def plan(owners, new_node, target_per_node, to_move):
    counts = {}
    for node in owners.values():
        counts[node] = counts.get(node, 0) + 1
    moves = []
    for partition, node in sorted(owners.items()):
        if counts[node] > target_per_node and len(moves) < to_move:
            moves.append((partition, node, new_node))
            counts[node] -= 1
    return moves

owners = {p: f"node{p % 3 + 1}" for p in range(30)}      # 30 partitions, 10 per node
moves = plan(owners, "node4", 7, 8)
print(f"{len(moves)} partitions move, for example {moves[:3]}")

gb_per_partition = 10
total_gb = len(moves) * gb_per_partition
for rate_mb in (50, 500):
    seconds = total_gb * 1000 / rate_mb
    print(f"{total_gb} GB at {rate_mb} MB per second: {seconds / 60:.0f} minutes")
:::

:::code
lang: text
8 partitions move, for example [(0, 'node1', 'node4'), (1, 'node2', 'node4'), (2, 'node3', 'node4')]
80 GB at 50 MB per second: 27 minutes
80 GB at 500 MB per second: 3 minutes
:::

## Try it

:::exercise
title: Add a fifth node
task: A store has 4 nodes, 40 partitions, and 480 GB of data. A fifth node joins. Compute the size of one partition, how many partitions move, the total data moved, and the time to finish when each source node sends at 100 MB per second and all sources work in parallel.
hint: The target is 8 partitions per node. Each of the 4 old nodes gives 2 partitions. The time is set by the data one source sends, not the total.
lang: python
solution:
nodes_before, partitions, total_gb = 4, 40, 480
gb_per_partition = total_gb / partitions                  # 12 GB
target = partitions // (nodes_before + 1)                 # 8 per node
per_source = partitions // nodes_before - target          # 2 partitions from each old node
moved = per_source * nodes_before                         # 8 partitions
moved_gb = moved * gb_per_partition                       # 96 GB
seconds = per_source * gb_per_partition * 1000 / 100      # 240 s per source, in parallel
print(f"{gb_per_partition:.0f} GB per partition, {moved} partitions move, {moved_gb:.0f} GB in total")
print(f"each source sends {per_source * gb_per_partition:.0f} GB: done in {seconds / 60:.0f} minutes")
:::

## Common mistakes

- Mistake: pick a partition count equal to the node count. Fix: pick 10 or more partitions per node, so you can add nodes later.
- Mistake: rebalance at full disk speed. Fix: throttle the copy, because live traffic shares the disk and the network.
- Mistake: switch the owner before the write log catches up. Fix: pause writes for the last milliseconds and send the final entries first.
- Mistake: let clients cache the routing table forever. Fix: refresh on a moved error and on a timer.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: rebalancing partitions
q: Why does a fixed partition count make rebalancing simple?
- It needs fewer nodes
* Keys never change partition, so only the ownership of whole partitions moves
- Partitions stay small
- No routing table is needed
why: The partition of a key depends on the partition count, which never changes, so no key is rehashed.
q: How long does it take to move 60 GB at 100 MB per second?
- 1 minute
* 10 minutes
- 100 minutes
- 6 seconds
why: 60,000 MB divided by 100 MB per second is 600 seconds.
q: What happens to writes that arrive during the copy of a partition?
- They are rejected
* The source serves them, logs them, and streams them to the target afterwards
- They are dropped
- They go to the target directly
why: The source stays the owner until the switch, and the logged writes bring the target up to date.
q: What is a good rule for the partition count at the start?
- Equal to the node count
* 10 to 100 partitions per node at the expected final size
- One per CPU core
- One per key
why: Enough partitions let you add nodes many times without a split, and each partition stays a sensible size.
q: A client sends a request and gets a "moved" error. What should it do?
- Drop the request
* Refresh its routing table and retry
- Wait for the rebalance to finish
- Switch to another cluster
why: The error means ownership changed, and the refreshed table points the retry at the new owner.
q: Why wait several minutes before an automatic rebalance starts after a node failure?
- The disk needs to cool down
* A brief failure would otherwise move data out and back again and overload the cluster
- Clients cache the table for that long
- The log must be compacted first
why: Many failures are short, and a rebalance on each one moves gigabytes for nothing.
:::

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

The script below sends 100,000 reads to 10 nodes with the celebrity key at 60 percent, then applies salting. With 10 copies, chance puts 2 or 3 copies on one node, which is why the procedure says 10 to 100 copies.

:::code
lang: python
file: salting.py
import hashlib, random
from collections import Counter

def node_for(key, nodes=10):
    return int(hashlib.md5(key.encode()).hexdigest(), 16) % nodes

random.seed(3)
reads = ["celeb:42" if random.random() < 0.6 else f"user:{random.randrange(100_000)}"
         for _ in range(100_000)]

plain = Counter(node_for(k) for k in reads)
print("busiest node without a fix:", max(plain.values()), "reads")

for copies in (10, 50):
    salted = Counter(node_for(f"{k}:{random.randrange(copies)}" if k == "celeb:42" else k) for k in reads)
    print(f"busiest node with {copies} copies: {max(salted.values())} reads, {copies} writes per update")
:::

## Try it

:::exercise
title: Fix a hot counter and a hot read
task: A view counter receives 90,000 increments per second on one key. 300 application servers each keep a local sum and flush it every 200 ms. Compute the writes per second on the key after the change. Then a hot profile key gets 60,000 reads per second. Each of the 300 servers caches it for 2 seconds. Compute the maximum reads per second the cache node sees for that key.
hint: Each server flushes 5 times per second. Each server refreshes the cached value at most once per 2 seconds.
lang: python
solution:
servers = 300
flushes_per_second = 1 / 0.2                               # 5 per server
counter_writes = servers * flushes_per_second              # 1,500 per second, down from 90,000
print(f"counter writes per second: {counter_writes:.0f}")

ttl_s = 2
profile_reads = servers / ttl_s                            # 150 per second, down from 60,000
print(f"profile reads per second on the cache node: {profile_reads:.0f}")
:::

## Common mistakes

- Mistake: add nodes to fix a hot key. Fix: the key still lives on one node, so split the key or cache it.
- Mistake: salt a write-heavy key. Fix: aggregate writes locally instead, because salting multiplies writes.
- Mistake: set the local cache time to live at 10 minutes. Fix: use 1 to 5 seconds, which cuts load by a large factor with little staleness.
- Mistake: find hot keys only after an incident. Fix: alert on the ratio of the busiest partition to the average.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: hot keys and skew
q: A key takes 80 percent of 50,000 reads per second. What load does that key alone put on its node?
- 4,000 reads per second
- 10,000 reads per second
* 40,000 reads per second
- 50,000 reads per second
why: 80 percent of 50,000 is 40,000, all on the one node that owns the key.
q: You salt that key into 20 copies. What is the read load per copy?
- 40,000 reads per second
- 20,000 reads per second
* About 2,000 reads per second
- 200 reads per second
why: Readers pick a random suffix, so each of the 20 copies gets about 1 twentieth of 40,000.
q: Which fix suits a hot counter?
- Key salting
- Adding nodes
* Local aggregation with a periodic flush
- A longer time to live
why: Salting multiplies writes, but summing locally and flushing on a timer divides them.
q: Why does adding nodes not fix a hot key?
- It costs too much
* The key still lives on one node
- Rebalancing takes too long
- The hash function changes
why: A key maps to exactly one partition, so new nodes take other keys and leave the hot one where it is.
q: 200 application servers each cache a hot value for 1 second. How many reads per second for that key reach the cache node at most?
- 60,000
* 200
- 1
- 2,000
why: Each server refreshes at most once per second, so the node sees at most one read per server per second.
q: The busiest partition serves 3 times the average. What does that signal?
- Normal variation
* Skew, so sample that partition and look for a hot key
- A failed node
- Too many partitions
why: A ratio above 3 between the busiest partition and the average is the standard alert for skew.
:::

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
      level: 'intermediate',
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

:::video
id: G1rOthIU-uo
why: Watch all 2 minutes. Note the data types and the time to live on a key, which this lesson uses in the cache-aside procedure.
:::

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

The script below is cache-aside in 20 lines, with a time to live and a delete on write. It then prints the latency and database load for each hit rate.

:::code
lang: python
file: cache_aside.py
import time

db = {"item:7": "price 10"}
cache = {}                                  # key -> (value, expires_at)
TTL = 60
db_reads = 0

def get(key):
    global db_reads
    hit = cache.get(key)
    if hit and hit[1] > time.time():
        return hit[0]
    db_reads += 1
    value = db[key]
    cache[key] = (value, time.time() + TTL)
    return value

def write(key, value):
    db[key] = value                         # write the database first
    cache.pop(key, None)                    # then delete the key

for _ in range(10):
    get("item:7")
write("item:7", "price 20")
print(get("item:7"), "after", db_reads, "database reads for 11 gets")

def avg_latency_ms(hit_rate, cache_ms=0.2, db_ms=5):
    return hit_rate * cache_ms + (1 - hit_rate) * (cache_ms + db_ms)

for h in (0.0, 0.9, 0.99):
    print(f"hit rate {h:.0%}: {avg_latency_ms(h):.2f} ms, {10_000 * (1 - h):,.0f} database reads per second")
:::

:::code
lang: text
price 20 after 2 database reads for 11 gets
hit rate 0%: 5.20 ms, 10,000 database reads per second
hit rate 90%: 0.70 ms, 1,000 database reads per second
hit rate 99%: 0.25 ms, 100 database reads per second
:::

## Try it

:::exercise
title: Size the cache for the working set
task: A service reads 5 million distinct keys per hour, 2 KB each. It serves 30,000 reads per second, and the database can take at most 3,000 reads per second. Compute the size of the working set in GB, the hit rate the database limit requires, and the cache size that reaches it if hits are spread evenly over the working set.
hint: The hit rate must be at least 1 minus 3,000 divided by 30,000. With even hits, the hit rate equals the share of the working set that fits in the cache.
lang: python
solution:
keys, key_bytes = 5_000_000, 2_000
reads_per_s, db_limit = 30_000, 3_000

working_set_gb = keys * key_bytes / 1e9              # 10 GB
needed_hit_rate = 1 - db_limit / reads_per_s         # 0.9
cache_gb = working_set_gb * needed_hit_rate          # 9 GB
print(f"working set {working_set_gb:.0f} GB")
print(f"hit rate needed {needed_hit_rate:.0%}, cache of {cache_gb:.0f} GB plus overhead")
:::

## Common mistakes

- Mistake: cache every key with the same long TTL. Fix: set the TTL per key type from how stale the data may be.
- Mistake: size the cache from total data, not the working set. Fix: measure the keys read per hour and size for those.
- Mistake: run one cache node. Fix: run several with consistent hashing, so a restart loses a fraction of the hits.
- Mistake: let all keys expire at the same second after a deploy. Fix: add a random spread of 10 percent to each TTL.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: cache strategies
q: At a 95 percent hit rate and 20,000 reads per second, how many reads reach the database?
- 19,000 per second
* 1,000 per second
- 100 per second
- 5 per second
why: 5 percent of 20,000 is 1,000 misses per second, and each miss reads the database.
q: What does cache-aside do on a write?
- It writes the cache only
* It writes the database, then deletes the cache key
- It writes the cache and the database together
- It deletes the key, then writes the database
why: The next read misses and refills the cache with the fresh value from the database.
q: A cache read takes 0.2 ms and a database read 5 ms. What is the average latency at an 80 percent hit rate?
- 0.7 ms
* 1.2 ms
- 2.6 ms
- 4.2 ms
why: 0.8 times 0.2 plus 0.2 times 5.2 is 0.16 plus 1.04, which is 1.2 ms.
q: What is a thundering herd?
- A cache node that restarts
* Many requests miss on one key at once and all go to the database
- A time to live that is too long
- Too many cache nodes
why: When a popular key expires, every concurrent reader misses and hits the database at the same moment.
q: What is the main risk of a write-back cache?
- Slow writes
- Stale reads
* Data loss when the cache fails before it flushes
- High memory use
why: The cache holds the only copy of the write until it flushes, so a crash loses it.
q: Why add a random spread to each time to live?
* So keys do not expire at the same second
- To raise the hit rate
- To save memory
- To shorten the average TTL
why: Keys filled together after a deploy would expire together and cause a herd on the database.
:::

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

The script below runs race 1 twice with the same interleaving: once with update after write and once with delete after write.

:::code
lang: python
file: race.py
def run(method):
    db = {"item:7": 10}
    cache = {}
    # both writers reach the database in order, but writer 1 is slow after that
    db["item:7"] = 20                      # writer 1
    db["item:7"] = 30                      # writer 2
    if method == "update":
        cache["item:7"] = 30               # writer 2 updates the cache
        cache["item:7"] = 20               # the slow writer 1 updates last
    else:
        cache.pop("item:7", None)          # writer 2 deletes
        cache.pop("item:7", None)          # writer 1 deletes
    value = cache.get("item:7")
    if value is None:                      # the next reader misses and fills
        value = cache["item:7"] = db["item:7"]
    return db["item:7"], value

for method in ("update", "delete"):
    db_value, cache_value = run(method)
    status = "stale" if db_value != cache_value else "correct"
    print(f"{method:6s}: database {db_value}, cache {cache_value}, {status}")
:::

:::code
lang: text
update: database 30, cache 20, stale
delete: database 30, cache 30, correct
:::

## Try it

:::exercise
title: Implement versioned keys
task: Write get_price(item) and set_price(item, price) with versioned keys. A small dictionary holds the current version per item. A read builds the key item:7:v12 from the version and uses the cache. A write stores the new price in the database and increments the version, with no delete. Show that after a write the old cache entry is never read again.
hint: The key is f"{item}:v{version}". A write only changes the version number and the database.
lang: python
solution:
db = {"item:7": 10}
versions = {"item:7": 12}
cache = {}

def get_price(item):
    key = f"{item}:v{versions[item]}"
    if key not in cache:
        cache[key] = db[item]               # fill on a miss
    return cache[key], key

def set_price(item, price):
    db[item] = price
    versions[item] += 1                     # old keys become unreachable

print(get_price("item:7"))                  # (10, 'item:7:v12')
set_price("item:7", 20)
print(get_price("item:7"))                  # (20, 'item:7:v13')
print("old entry still in memory until it expires:", cache["item:7:v12"])
:::

## Common mistakes

- Mistake: update the cache value after a write. Fix: delete the key, because two updates can land in the wrong order.
- Mistake: delete the cache key before the database commit. Fix: delete after the commit, or a reader refills with the old value.
- Mistake: rely on explicit invalidation alone. Fix: keep a TTL as a safety net, because some write path will be missed.
- Mistake: ignore a failed delete. Fix: retry it from a durable queue, because a lost delete means a stale entry for the full TTL.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: cache invalidation
q: Why is a delete after a write safer than an update after a write?
- A delete is faster
* Two deletes in any order leave the same result, but two updates do not
- An update needs a lock
- A delete uses less memory
why: With updates, the slower writer can land last and leave an older value in the cache.
q: What is the safety net for a missed invalidation?
- A retry
* A time to live on every entry
- A versioned key
- A lock on the row
why: Even if a write path forgets to delete the key, the entry expires after the TTL.
q: What does change data capture read to invalidate the cache?
- The cache itself
* The database write-ahead log
- The application logs
- The HTTP access log
why: A log reader sees every committed change, including manual fixes, and deletes the matching keys.
q: A reader reads price 10 from the database, pauses, and a writer sets 20 and deletes the key during the pause. The reader then fills the cache. What is in the cache?
- 20
* 10, a stale value
- Nothing
- An error
why: The delete found nothing, and the slow reader filled the cache with the old value after it.
q: What goes wrong when the delete runs before the database commit?
- The delete fails
* A reader can refill the cache with the old value before the commit
- The cache grows too large
- Nothing, the order does not matter
why: Between the delete and the commit, a miss reads the old row and caches it, so the fresh value is never seen.
q: With versioned keys, what happens to item:7:v12 after a write?
- It is deleted at once
* Readers build v13, and v12 stays unreachable until it expires
- It is updated to the new value
- It is copied to v13
why: The write only increments the version, so the old key is never looked up again.
:::

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

The script below is a log-based queue in 30 lines: 12 partitions, a committed offset per partition, a crash before the commit, and an idempotent consumer that skips repeats.

:::code
lang: python
file: log_queue.py
import hashlib

PARTITIONS = 12
log = {p: [] for p in range(PARTITIONS)}
committed = {p: 0 for p in range(PARTITIONS)}    # for one consumer group
seen = set()                                      # event ids already processed

def produce(key, event):
    p = int(hashlib.md5(key.encode()).hexdigest(), 16) % PARTITIONS
    log[p].append(event)
    return p, len(log[p]) - 1                     # partition and offset

def consume(p, crash_after=None):
    for offset in range(committed[p], len(log[p])):
        event = log[p][offset]
        if event in seen:
            print(f"  skip repeat {event}")
        else:
            seen.add(event)
            print(f"  invoice for {event} at offset {offset}")
        if crash_after and offset - committed[p] + 1 == crash_after:
            print("  crash before the commit")
            return
    committed[p] = len(log[p])

for i in (501, 502, 503):
    p, offset = produce("user-42", f"order-{i}")      # same key, same partition, in order
print("partition", p, "end offset", offset)
consume(p, crash_after=2)
consume(p)
print("committed offset", committed[p])
:::

## Try it

:::exercise
title: Size a topic
task: An events topic receives 25,000 events per second of 2 KB each. One consumer instance handles 4,000 events per second. Retention is 3 days and the replication factor is 3. Compute the minimum consumer count, a partition count with room to grow, the bytes per second, the bytes per second per partition, and the total disk across the brokers.
hint: Round the consumer count up. Pick 2 to 3 times that many partitions. Storage is bytes per second times seconds of retention times the replication factor.
lang: python
solution:
import math

events_per_s, event_bytes = 25_000, 2_000
per_consumer = 4_000
retention_s, replicas = 3 * 86_400, 3

consumers = math.ceil(events_per_s / per_consumer)          # 7
partitions = consumers * 3                                  # 21, round to 24
mb_per_s = events_per_s * event_bytes / 1e6                 # 50 MB per second
per_partition = mb_per_s / partitions                       # about 2.4 MB per second, under 10
disk_tb = mb_per_s * retention_s * replicas / 1e6           # about 39 TB
print(f"{consumers} consumers, {partitions} partitions, {mb_per_s:.0f} MB per second")
print(f"{per_partition:.1f} MB per second per partition, {disk_tb:.0f} TB of disk with replication")
:::

## Common mistakes

- Mistake: use one partition for ordering of everything. Fix: partition by the key that needs order, such as a user id.
- Mistake: run more consumer instances than partitions. Fix: the extra instances idle, so add partitions first.
- Mistake: assume each event is delivered once. Fix: make the consumer idempotent with an event id check.
- Mistake: commit the offset before processing. Fix: process, then commit, and accept repeats over losses.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: log-based message queues
q: What is an offset?
- The number of consumers in a group
* The position of an event in a partition
- The retention time of the topic
- The id of a partition
why: Each partition numbers its events from 0, and a consumer group commits the offset it has reached.
q: How many consumer instances in one group can read one partition?
- Any number
* One
- Two, for failover
- As many as the replication factor
why: Each partition is assigned to exactly one instance in a group, which is what keeps the order of processing.
q: A topic receives 10,000 events per second and one consumer handles 2,000. What is the minimum partition count?
- 1
- 2
* 5
- 10
why: 5 consumers are needed, and each needs its own partition.
q: What must a consumer do under at-least-once delivery?
- Commit the offset before processing
* Handle repeated events without a wrong result
- Read from two partitions at once
- Sort events by timestamp
why: After a crash before the commit, events are delivered again, so the consumer must be idempotent.
q: What order do events in different partitions have?
- Order by timestamp
- Order by offset
* No order
- Order by key
why: Ordering holds within one partition only, which is why related events share a partition key.
q: What happens when the consumer commits the offset before processing?
- Exactly-once delivery
* At-most-once delivery, so a crash can lose events
- At-least-once delivery
- Stronger ordering
why: If the consumer crashes after the commit and before the work, the events are never processed again.
:::

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

The script below runs a fast producer and a slow consumer with a bounded queue. The queue depth never passes 50, and the producer runs at the speed of the consumer.

:::code
lang: python
file: bounded_queue.py
import queue, threading, time

q = queue.Queue(maxsize=50)              # bounded: put blocks when the queue is full
TOTAL = 400
produced = consumed = 0

def producer():
    global produced
    for i in range(TOTAL):
        q.put(i)                         # blocks once 50 items wait
        produced += 1

def consumer():
    global consumed
    while consumed < TOTAL:
        q.get()
        consumed += 1
        time.sleep(0.001)                # about 1,000 per second at most

start = time.perf_counter()
threads = [threading.Thread(target=producer), threading.Thread(target=consumer)]
for t in threads:
    t.start()
while consumed < TOTAL:
    time.sleep(0.1)
    print(f"{time.perf_counter() - start:4.1f} s  produced {produced:3d}  consumed {consumed:3d}  depth {q.qsize():2d}")
for t in threads:
    t.join()
:::

## Try it

:::exercise
title: Bound the queue
task: A producer sends 2,000 events per second of 2 KB each, and the consumer handles 1,500 per second. The product accepts a delay of at most 5 seconds. Compute the queue bound, how many seconds the queue takes to fill, the memory the full queue holds, and the depth at which a 50 percent alert fires.
hint: The bound is the consumer rate times the maximum delay. The queue grows by the difference of the two rates.
lang: python
solution:
producer, consumer, event_kb, max_delay_s = 2000, 1500, 2, 5
bound = consumer * max_delay_s                    # 7,500 events
fill_s = bound / (producer - consumer)            # 15 seconds
memory_mb = bound * event_kb / 1000               # 15 MB
alert_depth = bound * 0.5                         # 3,750 events
print(f"bound {bound} events, full after {fill_s:.0f} s, {memory_mb:.0f} MB, alert at {alert_depth:.0f}")
:::

## Common mistakes

- Mistake: use an unbounded queue to "absorb bursts". Fix: bound it, because a burst that outlasts the bound is an overload and must be visible.
- Mistake: bound the queue but never alert on its depth. Fix: alert at 50 percent depth, because a full queue is already a user-visible failure.
- Mistake: apply back-pressure in the middle and not at the edge. Fix: carry the signal to the entry point, where a reject is cheap and clear.
- Mistake: add consumers to fix lag without checking the downstream database. Fix: find the real slowest stage, which may be the database the consumers write to.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: back-pressure
q: A producer sends 500 items per second and the consumer handles 300. How fast does an unbounded queue grow?
- 800 items per second
* 200 items per second
- 300 items per second
- It does not grow
why: The queue absorbs the difference between the two rates.
q: What is a credit in flow control?
- A retry token
* Permission from the consumer to send a fixed number of items
- A payment for bandwidth
- A timeout value
why: The producer sends up to the credits it holds, then waits for the consumer to grant more.
q: What is consumer lag in a log-based queue?
- The network delay to the broker
* The number of events between the newest offset and the committed offset
- The CPU use of the consumer
- The retention time
why: The broker stores the backlog on disk, so lag is the distance the consumer is behind the end of the log.
q: The consumer handles 800 items per second and the maximum acceptable delay is 10 seconds. What queue bound gives that delay?
- 800
* 8,000
- 80,000
- 10
why: Size equals rate times maximum delay, 800 times 10.
q: Where should a request be rejected when the system is overloaded?
- At the slowest stage
- At the database
* At the entry point, where a reject is cheap and clear
- Nowhere, the queue should absorb it
why: A reject at the edge costs almost nothing and gives the user a clear error at once.
q: Which hidden queue most often grows without limit?
- The TCP receive buffer
- A Kafka partition
* A retry queue in front of a failing dependency
- A thread pool
why: When the dependency is down every retry fails and goes back on the queue, so it grows until memory runs out.
:::

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
      level: 'intermediate',
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

The script below prints the backoff schedule with full jitter, the load on B from the example, and the amplification over 4 levels.

:::code
lang: python
file: retries.py
import random

def backoff_ms(attempt, base=100, cap=10_000):
    return min(cap, base * pow(2, attempt))

random.seed(1)
for n in range(4):
    full = backoff_ms(n)
    print(f"attempt {n}: wait {full} ms, with full jitter {random.uniform(0, full):.0f} ms")

def load_on_b(calls, failure_rate, retries):
    extra = sum(pow(failure_rate, k) for k in range(1, retries + 1))
    return calls * (1 + extra)

for fail in (0.1, 0.8):
    print(f"failure {fail:.0%}, 2 retries: B sees {load_on_b(1000, fail, 2):.0f} calls per second")

budget = 0.10
print(f"with a {budget:.0%} retry budget B sees at most {1000 * (1 + budget):.0f}")
print(f"amplification over 4 levels: 3 attempts each {pow(3, 4)}, with the budget {pow(1.1, 4):.2f}")
:::

:::code
lang: text
attempt 0: wait 100 ms, with full jitter 13 ms
attempt 1: wait 200 ms, with full jitter 169 ms
attempt 2: wait 400 ms, with full jitter 306 ms
attempt 3: wait 800 ms, with full jitter 204 ms
failure 10%, 2 retries: B sees 1110 calls per second
failure 80%, 2 retries: B sees 2440 calls per second
with a 10% retry budget B sees at most 1100
amplification over 4 levels: 3 attempts each 81, with the budget 1.46
:::

## Try it

:::exercise
title: Set the timeout and count the retries
task: Service B has a measured p99.9 latency of 450 ms. Choose a timeout for A. Then compute the failure rate after 1 retry when 5 percent of calls fail. Then A sends 2,000 calls per second and B fails 50 percent of them. Compute the load on B with 3 retries and with a 10 percent retry budget.
hint: The timeout goes slightly above the p99.9. The failure rate after retries is the per-call rate to the power of the attempts. Extra calls are the sum of the failure rate to the power 1, 2, and 3.
lang: python
solution:
p999_ms = 450
timeout_ms = 500                                            # slightly above the p99.9
print(f"timeout {timeout_ms} ms")

fail = 0.05
print(f"failure after 1 retry: {pow(fail, 2):.2%}")         # 0.25 percent

calls, fail, retries = 2000, 0.5, 3
extra = sum(pow(fail, k) for k in range(1, retries + 1))    # 0.5 + 0.25 + 0.125
print(f"load on B with 3 retries: {calls * (1 + extra):.0f}")          # 3,750
print(f"load on B with a 10 percent budget: {calls * 1.1:.0f}")       # 2,200
:::

## Common mistakes

- Mistake: set the timeout equal to the mean latency. Fix: set it above the p99.9, or you cancel good calls and retry them.
- Mistake: retry at every level of a call chain. Fix: retry at one level and fail fast below it.
- Mistake: retry with a fixed interval. Fix: use exponential backoff with full jitter.
- Mistake: retry a non-idempotent write. Fix: add a request id so the callee can detect a repeat, or do not retry.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: timeouts and retries
q: A call fails 5 percent of the time. What is the failure rate with 1 retry?
- 5 percent
- 2.5 percent
* 0.25 percent
- 10 percent
why: Both attempts must fail, and 0.05 times 0.05 is 0.0025.
q: Why add jitter to backoff?
- It shortens the waits
* So clients that failed together do not retry together
- It reduces the number of retries
- It makes the timeout adaptive
why: Without jitter, 1,000 clients that failed at the same instant all retry at the same instant and overload the callee again.
q: What does a 10 percent retry budget do?
- It retries 10 times
* It caps retries at 10 percent of the normal call rate
- It waits 10 percent longer each attempt
- It retries only 10 percent of the calls
why: Above the budget, failed calls are not retried, so a failing callee never sees more than 1.1 times the normal load.
q: A sends 1,000 calls per second, B fails 50 percent, and A retries up to 2 times. How many calls reach B?
- 1,500
* 1,750
- 2,000
- 3,000
why: Extra calls are 1,000 times (0.5 plus 0.25), so B sees 1,000 plus 750.
q: From which number do you set a timeout?
- The mean latency of the callee
- The p50 of the callee
* Slightly above the p99.9 of the callee
- The longest latency ever observed
why: A timeout above the p99.9 cancels fewer than 0.1 percent of good calls while still bounding the wait.
q: Which call is safe to retry?
- Create an order with no request id
- Charge a card with no request id
* A read, or a write that carries a unique request id
- Append a line to a log
why: A retry repeats the call, so the callee must be able to detect a repeat or the call must have no side effect.
:::

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

The script below is a circuit breaker with the numbers from the example, driven by a simulated clock. R is down until second 91.

:::code
lang: python
file: breaker.py
class Breaker:
    def __init__(self, window=100, threshold=0.5, open_s=30, probes=10):
        self.window, self.threshold, self.open_s, self.probes = window, threshold, open_s, probes
        self.state, self.results, self.opened_at, self.probe_ok = "closed", [], None, 0

    def call(self, now, dependency):
        if self.state == "open":
            if now - self.opened_at < self.open_s:
                return "fallback"
            self.state, self.probe_ok = "half-open", 0
        ok = dependency(now)
        if self.state == "half-open":
            if not ok:
                self.state, self.opened_at = "open", now
                return "probe failed"
            self.probe_ok += 1
            if self.probe_ok >= self.probes:
                self.state, self.results = "closed", []
            return "ok"
        self.results = (self.results + [ok])[-self.window:]
        failures = self.results.count(False) / self.window
        if len(self.results) == self.window and failures >= self.threshold:
            self.state, self.opened_at = "open", now
        return "ok" if ok else "error"

def recommendation_service(now):
    return now >= 91                           # down until second 91

b = Breaker()
for second in (0, 1, 2, 31, 32, 61, 91, 92):
    outcomes = [b.call(second + i / 500, recommendation_service) for i in range(500)]
    reached_r = sum(1 for o in outcomes if o != "fallback")
    print(f"second {second:3d}: state {b.state:9s} calls that reached R {reached_r:3d}")
:::

:::code
lang: text
second   0: state open      calls that reached R 100
second   1: state open      calls that reached R   0
second   2: state open      calls that reached R   0
second  31: state open      calls that reached R   1
second  32: state open      calls that reached R   0
second  61: state open      calls that reached R   1
second  91: state closed    calls that reached R 500
second  92: state closed    calls that reached R 500
:::

## Try it

:::exercise
title: Count the calls and size the bulkhead
task: R is down for 2 full minutes. Compute how many calls reach R from A in those 2 minutes without a breaker, and with the breaker from the example, which opens after 100 failures and sends 10 probes every 30 seconds. Then A has 200 threads and wants R to hold at most 10 percent of them. Compute the bulkhead size, and by Little's law the calls per second to R that the bulkhead allows during an outage with a 1 second timeout.
hint: Without a breaker every call reaches R. With the breaker, count the first window plus the probes at seconds 31, 61, and 91. The bulkhead allows threads divided by the time each call holds a thread.
lang: python
solution:
calls_per_s, outage_s = 500, 120
without = calls_per_s * outage_s                          # 60,000
probe_rounds = 3                                          # at seconds 31, 61, and 91
with_breaker = 100 + 10 * probe_rounds                    # 100 calls to trip, then 10 probes per round
print(f"without a breaker {without:,} calls, with the breaker {with_breaker} calls")

threads = 200
bulkhead = int(threads * 0.10)                            # 20 threads
timeout_s = 1
allowed_per_s = bulkhead / timeout_s                      # 20 calls per second to R
print(f"bulkhead {bulkhead} threads, at most {allowed_per_s:.0f} calls per second to R during the outage")
:::

## Common mistakes

- Mistake: count client errors as failures. Fix: count only timeouts and server errors, or a bad request from one user opens the breaker for all.
- Mistake: set the open duration to 1 second. Fix: use 10 seconds or more, or the breaker flaps and the dependency gets no rest.
- Mistake: open a breaker with no fallback. Fix: define the fallback first, because an open breaker with no fallback is only a faster error.
- Mistake: share one breaker across all dependencies. Fix: one breaker per dependency, and ideally per endpoint.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: circuit breakers
q: What does the open state do?
- It retries each call once
* It fails every call at once without calling the dependency
- It queues calls until the dependency returns
- It slows calls down
why: The caller returns a fallback in microseconds instead of waiting for the full timeout.
q: What is the purpose of the half-open state?
- To send half of the traffic
* To test the dependency with a few calls before full traffic returns
- To log the failures
- To warm the cache
why: A few probe calls show whether the dependency recovered, without sending the full load at once.
q: How does a bulkhead differ from a breaker?
- They are the same pattern
* A bulkhead limits the threads one dependency can hold, and a breaker stops calls when failures are high
- A bulkhead retries, a breaker does not
- A bulkhead works on reads, a breaker on writes
why: The bulkhead protects the thread pool even when calls succeed slowly, and the breaker removes load from a failing dependency.
q: A calls R 500 times per second with a 1 second timeout and has 200 threads. How long after R fails are all threads blocked?
* About 0.4 seconds
- 1 second
- 2.5 seconds
- 200 seconds
why: Threads fill at 500 per second, and 200 divided by 500 is 0.4 seconds.
q: Should the breaker count 4xx responses as failures?
- Yes, every error counts
* No, they are the caller's fault and the dependency is healthy
- Only 404
- Only when they exceed 50 percent
why: One client that sends bad requests would otherwise open the breaker for every client.
q: What goes wrong with an open duration of 1 second?
- The breaker never opens
* The breaker flaps, and the dependency gets no time to recover
- The fallback is served too long
- The probes never run
why: Every second the probes hit the dependency, and the breaker opens and closes in a loop.
:::

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

The script below simulates the overloaded server in steps of 0.1 seconds, with and without a queue limit, and reports the goodput.

:::code
lang: python
file: shedding.py
def simulate(offered, capacity, deadline_s, queue_limit=None, seconds=5, dt=0.1):
    queue = 0
    good = rejected = wasted = 0
    for _ in range(int(seconds / dt)):
        arrivals = offered * dt
        if queue_limit is not None:
            room = max(0, queue_limit - queue)
            rejected += max(0, arrivals - room)         # 503 in microseconds
            arrivals = min(arrivals, room)
        wait = queue / capacity                         # seconds a new request waits
        queue += arrivals
        served = min(queue, capacity * dt)
        if wait <= deadline_s:
            good += served
        else:
            wasted += served                            # the client already gave up
        queue -= served
    return good / seconds, rejected / seconds, wasted / seconds

for limit in (None, 100):
    good, rejected, wasted = simulate(2000, 1000, 1.0, limit)
    print(f"queue limit {str(limit):4s}: goodput {good:4.0f}, rejected {rejected:4.0f}, wasted {wasted:4.0f} per second")
:::

:::code
lang: text
queue limit None: goodput  220, rejected    0, wasted  780 per second
queue limit 100 : goodput 1000, rejected 1000, wasted    0 per second
:::

Over a longer run the goodput without a limit falls toward 0, because every request waits longer than the deadline.

## Try it

:::exercise
title: Set the limit and the priorities
task: A server completes 1,000 requests per second and the target latency is 100 ms. Compute the concurrency limit with 20 percent headroom. Then 2,500 requests per second arrive: 1,800 feed reads and 700 payments. With the server at capacity, compute how many of each class complete when the server sheds the lowest class first, and how many feed reads are shed.
hint: The limit is capacity times target latency times 1.2. Payments go first, and the feed reads get what capacity remains.
lang: python
solution:
capacity, target_s = 1000, 0.1
limit = capacity * target_s * 1.2                        # 120 requests in flight
print(f"concurrency limit {limit:.0f}")

feed, payments = 1800, 700
payments_done = min(payments, capacity)                  # 700
feed_done = min(feed, capacity - payments_done)          # 300
print(f"payments {payments_done}, feed reads {feed_done}, feed reads shed {feed - feed_done}")
:::

## Common mistakes

- Mistake: accept every request and let the queue grow. Fix: bound the queue, because an unbounded queue drives goodput to zero.
- Mistake: shed with an expensive reject path. Fix: reject before any logging or parsing, in microseconds.
- Mistake: shed at random. Fix: shed by priority class, so payments survive and prefetches do not.
- Mistake: shed only at the deepest service. Fix: shed at the edge, where a reject costs the least work.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: load shedding and admission control
q: What is goodput?
- The number of requests the server accepts
* The rate of requests that complete within their deadline
- The CPU utilisation of the server
- The number of requests in the queue
why: Work on a request the client has abandoned is throughput but not goodput.
q: Why does a 1 second client timeout make an overloaded server useless without shedding?
- The server crashes after 1 second
* Every request waits longer than 1 second, so the server works on abandoned requests
- The clients stop sending
- The queue empties too fast
why: The queue grows until the wait passes the timeout, and from then on every completed request is wasted.
q: Which signal reacts fastest to overload?
- CPU use
* Concurrency or queue wait time
- Memory use
- The error rate
why: By Little's law concurrency rises the instant latency rises, while CPU and memory lag behind.
q: The queue limit is 100 and each request takes 1 ms. What is the maximum queue wait?
- 1 ms
- 10 ms
* 100 ms
- 1 second
why: The last request in a queue of 100 waits for 100 requests at 1 ms each.
q: Where is the cheapest place to shed a request?
- After the database call
- In the deepest service
* At the edge, before any work is done
- At random points in the chain
why: A reject at the load balancer costs microseconds, while a reject after the database wasted the whole request.
q: How should shed requests appear on a dashboard?
- As errors
- As successes
* As a separate overload metric
- They should not be recorded
why: Shedding is the system working as designed, and an alert that says "overload" leads to the right action.
:::

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

The script below computes the fan-out rule for the three cases and then simulates 2,000 fan-out requests with and without hedging.

:::code
lang: python
file: tail.py
import random

def p_slow(per_server_tail, fan_out):
    return 1 - pow(1 - per_server_tail, fan_out)

for p, n in ((0.01, 10), (0.01, 100), (0.0001, 100)):
    print(f"fan-out {n:3d}, per-server tail {p:.2%}: {p_slow(p, n):.0%} of users wait")

random.seed(5)

def one_call():
    return 1000.0 if random.random() < 0.01 else 10.0     # ms

def request(fan_out=100, hedge_after=None):
    worst = 0.0
    for _ in range(fan_out):
        t = one_call()
        if hedge_after is not None and t > hedge_after:
            t = min(t, hedge_after + one_call())            # a second copy on another replica
        worst = max(worst, t)
    return worst

for hedge in (None, 20):
    samples = sorted(request(hedge_after=hedge) for _ in range(2000))
    print(f"hedge after {hedge} ms: user p50 {samples[1000]:.0f} ms, user p99 {samples[1980]:.0f} ms")
:::

## Try it

:::exercise
title: Fan-out arithmetic
task: A feed fans out to 50 shards. Each shard has a 1 percent tail. Compute the fraction of user requests that hit the tail. Then compute the per-shard tail that gives a 1 percent user tail at fan-out 50. Finally, hedging starts at the shard p95; compute the extra load it adds, and the extra load if the hedge delay were 0.
hint: The user tail is 1 minus (1 minus p) to the power n. For a small target, p is about the target divided by n.
lang: python
solution:
n, p = 50, 0.01
user_tail = 1 - pow(1 - p, n)                      # 0.395
print(f"users that hit the tail: {user_tail:.0%}")

target = 0.01
needed = target / n                                 # 0.0002
print(f"per-shard tail for a 1 percent user tail: {needed:.2%}")

print("hedge at the p95: about 5 percent extra load; hedge at 0 ms: 100 percent extra load")
:::

## Common mistakes

- Mistake: judge a server by its p99 when it serves a fan-out. Fix: track p99.9 and p99.99, because those set the user latency.
- Mistake: hedge with a delay of zero. Fix: delay the hedge until the p95, or you double the load.
- Mistake: wait for every shard. Fix: return a partial result after a deadline when the product allows.
- Mistake: ignore garbage collection pauses. Fix: measure pause time and tune the heap or move the hot path off the collected runtime.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: tail latency
q: With fan-out 50 and a 1 percent per-server tail, what fraction of user requests hit the tail?
- About 1 percent
* About 39 percent
- About 50 percent
- About 63 percent
why: 0.99 to the power 50 is 0.605, so 39.5 percent of requests wait for at least one slow server.
q: What per-server tail does a 1 percent user tail need at fan-out 100?
- 1 percent
- 0.1 percent
* About 0.01 percent
- 0.001 percent
why: The per-server tail must be about the target divided by the fan-out, 0.01 divided by 100.
q: How much extra load does hedging at the p95 add?
- About 1 percent
* About 5 percent
- About 50 percent
- About 100 percent
why: Only the 5 percent of calls slower than the p95 get a second copy.
q: Why is a hedge delay of 0 a mistake?
- The hedge arrives too late
* It sends every call twice and doubles the load
- The second replica is always slower
- It breaks the ordering of replies
why: Hedging must wait until a call looks slow, or every call costs two calls.
q: Which is a common cause of a long tail in one server?
- A cache that is too warm
* A garbage collection pause
- A fan-out that is too small
- A p50 that is too low
why: Pauses of 50 to 500 ms stop every request on the server at once and show up only in the tail.
q: What does returning a partial result mean for a fan-out?
- Returning the first shard only
* Returning after 95 percent of shards reply instead of waiting for the slowest
- Returning a cached result
- Returning an error after the deadline
why: A feed from 95 of 100 shards is still a feed, and the user never waits for the slowest shard.
:::

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
      level: 'intermediate',
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

:::video
id: -MTSQjw5DrM
why: Watch all 2 minutes. Note the GET and POST verbs and the status codes, which the shortener uses for its redirect and its create call.
:::

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

The script below encodes an id in base62, decodes it back, counts the key space, and runs the write path with a local id range.

:::code
lang: python
file: shortener.py
ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

def encode(n, width=7):
    out = ""
    while n:
        n, r = divmod(n, 62)
        out = ALPHABET[r] + out
    return out.rjust(width, "0")

def decode(key):
    n = 0
    for ch in key:
        n = n * 62 + ALPHABET.index(ch)
    return n

print(encode(1000), decode(encode(1000)))
print(f"7 characters give {pow(62, 7):,} keys, 6 characters give {pow(62, 6):,}")

store = {}
next_id = 1000                           # the start of this server's local range

def shorten(url):
    global next_id
    key = encode(next_id)
    next_id += 1
    store[key] = url
    return key

key = shorten("https://example.com/a/very/long/path")
print(key, "->", store[key])
:::

:::code
lang: text
00000g8 1000
7 characters give 3,521,614,606,208 keys, 6 characters give 56,800,235,584
00000g8 -> https://example.com/a/very/long/path
:::

## Try it

:::exercise
title: Re-estimate for a bigger shortener
task: Repeat the estimate for 500 million new links per month, each read 50 times, kept for 3 years, with 600 bytes per row. Compute the average and peak write QPS with a peak factor of 3, the average and peak read QPS, the storage after 3 years, and whether 7 base62 characters are enough for the number of rows.
hint: A month has 2.6 million seconds. Reads are 50 times the writes. Rows after 3 years are 36 times the monthly count.
lang: python
solution:
links_per_month = 500_000_000
reads_per_link, years, row_bytes, peak = 50, 3, 600, 3
seconds_per_month = 2_600_000

write_qps = links_per_month / seconds_per_month                   # 192
read_qps = write_qps * reads_per_link                             # 9,600
rows = links_per_month * 12 * years                               # 18 billion
storage_tb = rows * row_bytes / 1e12                              # 10.8 TB
print(f"writes {write_qps:.0f} per second, {write_qps * peak:.0f} at peak")
print(f"reads {read_qps:.0f} per second, {read_qps * peak:.0f} at peak")
print(f"{rows / 1e9:.0f} billion rows, {storage_tb:.1f} TB")
print("7 characters enough:", rows < pow(62, 7))                 # True, 3.5 trillion keys
:::

## Common mistakes

- Mistake: generate keys from a hash and skip the collision check. Fix: check the key, or two URLs share a short link.
- Mistake: use a 301 redirect. Fix: use 302, so visits reach the service and targets can change.
- Mistake: size the cache from total rows. Fix: size from the daily working set.
- Mistake: make redirects depend on the id service. Fix: keep the read path free of write-path dependencies.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: design a URL shortener
q: How many keys does a 6-character base62 key give?
- About 62 million
* About 57 billion
- About 3.5 trillion
- About 6 billion
why: 62 to the power 6 is 56.8 billion.
q: Why pre-allocate id ranges to each server?
- To make the keys shorter
* So each server generates keys without a call to the central counter per write
- To keep the keys sorted
- To avoid base62
why: A block of 1,000 ids per server turns 1,000 central calls into 1.
q: What is the write-to-read ratio in this design?
- 1 to 1
- 100 to 1
* 1 to 100
- 1 to 10
why: Each link is written once and read about 100 times over its life.
q: 100 million new links per month is about how many writes per second?
- 4
* 40
- 400
- 1,000
why: 100 million divided by 2.6 million seconds is about 38.
q: Why return a 302 and not a 301?
- A 301 is slower
* A 302 brings every visit through the service, so you can count visits and change the target
- A 301 is not cached
- There is no difference
why: A 301 tells the browser to cache the redirect forever, so later visits never reach the service.
q: One link goes viral and gets 50,000 reads per second. What is the fix?
- A bigger database
* A local in-process cache with a 1 second time to live on each web server
- A 301 redirect
- More cache nodes
why: The link is one key on one cache node, so the fix is the hot key fix: cache it on every web server for a second.
:::

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

The script below generates sortable message ids in the Snowflake layout and groups a fan-out by connection server.

:::code
lang: python
file: chat_ids.py
import time
from collections import defaultdict

EPOCH_MS = 1_600_000_000_000
sequence, last_ms = 0, 0

def next_message_id(server_id):
    # 41 bits of time, 10 bits of server, 12 bits of sequence, sortable by time
    global sequence, last_ms
    now = int(time.time() * 1000) - EPOCH_MS
    sequence = (sequence + 1) & 0xFFF if now == last_ms else 0
    last_ms = now
    return (now << 22) | (server_id << 12) | sequence

a, b = next_message_id(12), next_message_id(12)
print("ids sort by time:", a < b, a, b)

presence = {"alice": 12, "bob": 47, "carol": 47, "dave": None}    # user -> server

def fan_out(members):
    by_server = defaultdict(list)
    offline = []
    for user in members:
        server = presence.get(user)
        (offline if server is None else by_server[server]).append(user)
    return dict(by_server), offline

pushes, offline = fan_out(["bob", "carol", "dave"])
print("one internal message per server:", pushes)
print("store as undelivered and notify:", offline)
:::

## Try it

:::exercise
title: Re-estimate the chat service
task: Repeat the estimate for 80 million daily users with 20 million online at peak. Each user sends 100 messages per day. A connection server holds 150,000 connections at 8 KB each. The average group size is 3. Compute the connection servers with 25 percent headroom, the memory per server for connections, the average and peak message rate with a peak factor of 3, and the push rate at peak.
hint: Servers equal online users divided by connections per server, times 1.25. Pushes equal messages times the group size.
lang: python
solution:
daily_users, online, per_server, kb_per_conn = 80_000_000, 20_000_000, 150_000, 8
messages_per_user, group, peak = 100, 3, 3

servers = online / per_server * 1.25                        # 167
memory_gb = per_server * kb_per_conn / 1e6                  # 1.2 GB
messages_per_s = daily_users * messages_per_user / 86_400   # 92,593
peak_messages = messages_per_s * peak                       # 277,778
pushes = peak_messages * group                              # 833,333
print(f"{servers:.0f} connection servers, {memory_gb:.1f} GB of connection memory each")
print(f"{messages_per_s:,.0f} messages per second, {peak_messages:,.0f} at peak, {pushes:,.0f} pushes per second")
:::

## Common mistakes

- Mistake: poll for new messages over HTTP every second. Fix: use a WebSocket, because 10 million polls per second is 100 times the message rate.
- Mistake: store all messages of a conversation in one partition forever. Fix: bucket by time so partitions stay small.
- Mistake: order messages by client clock. Fix: assign the id on the server, because client clocks drift.
- Mistake: reconnect at once after a server restart. Fix: use backoff with jitter on the client.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: design a chat service
q: How many connection servers do 10 million users need at 100,000 connections per server?
- 10
- 50
* 100, plus headroom
- 1,000
why: 10 million divided by 100,000 is 100, and the design adds 50 more for headroom.
q: What does the presence registry map?
- A user id to the list of friends
* A user id to the server that holds that user's connection
- A message id to a server
- A server to its load
why: Server 12 must find that user B is on server 47 to deliver the message.
q: Why must the chat client deduplicate messages?
- Clients send each message twice
* The server resends after a missing acknowledgement, so repeats happen
- The store returns duplicates
- Group messages arrive once per member
why: Delivery is at-least-once, so the client skips a message id it has already shown.
q: 70,000 messages per second with an average group size of 5 gives how many pushes per second?
- 14,000
- 70,000
* 350,000
- 3.5 million
why: Each message is pushed to every member of its group, 70,000 times 5.
q: Which message id design gives a defined order across devices?
- A random UUID
- The client clock
* A server-assigned id with a timestamp in the high bits and a sequence number in the low bits
- A counter per client
why: Server-assigned ids sort by time and break ties with the sequence, while client clocks drift.
q: Why add a time bucket to the conversation partition key?
- It makes writes faster
* Partitions stay small instead of growing forever
- It orders messages
- It reduces the number of servers
why: A partition that holds years of messages grows past a few hundred megabytes and becomes slow and hard to move.
:::

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

The script below is the hybrid feed in 30 lines: normal users fan out on write, celebrities fan out on read, and the feed merges both.

:::code
lang: python
file: feed.py
from collections import defaultdict

CELEBRITY = 10_000                          # followers above this fan out on read
timelines = defaultdict(list)               # user -> newest post ids
celebrity_posts = defaultdict(list)         # author -> post ids
followers = {"ada": ["u1", "u2", "u3"], "star": [f"u{i}" for i in range(50_000)]}
follows = {"u1": ["ada", "star"]}

def post(author, post_id):
    if len(followers[author]) > CELEBRITY:
        celebrity_posts[author].append(post_id)      # 1 write
        return 1
    for f in followers[author]:                       # fan-out on write
        timelines[f].insert(0, post_id)
        del timelines[f][500:]
    return len(followers[author])

def feed(user):
    ids = list(timelines[user])
    for author in follows[user]:
        if len(followers[author]) > CELEBRITY:
            ids += celebrity_posts[author][-10:]      # fan-out on read, a few lookups
    return sorted(ids, reverse=True)[:50]             # newest first, then rank

print("timeline writes for ada's post:", post("ada", 101))
print("timeline writes for star's post:", post("star", 102))
print("feed of u1:", feed("u1"))
:::

:::code
lang: text
timeline writes for ada's post: 3
timeline writes for star's post: 1
feed of u1: [102, 101]
:::

## Try it

:::exercise
title: Re-estimate the feed
task: Repeat the estimate for 50 million daily users who each follow 200 accounts, post 3 times per day, and load the feed 15 times per day. Use a peak factor of 3. Compute the peak timeline writes per second for fan-out on write, the peak lookups per second for fan-out on read, and the timeline storage at 500 post ids of 8 bytes per user.
hint: Posts per second times followers gives the writes. Feed loads per second times follows gives the lookups.
lang: python
solution:
users, follows, posts_per_day, loads_per_day, peak = 50_000_000, 200, 3, 15, 3

posts_per_s = users * posts_per_day / 86_400 * peak            # 5,208 at peak
writes_per_s = posts_per_s * follows                            # 1.04 million
loads_per_s = users * loads_per_day / 86_400 * peak             # 26,042 at peak
lookups_per_s = loads_per_s * follows                           # 5.2 million
storage_gb = users * 500 * 8 / 1e9                              # 200 GB
print(f"fan-out on write: {writes_per_s:,.0f} timeline writes per second at peak")
print(f"fan-out on read: {lookups_per_s:,.0f} lookups per second at peak")
print(f"timeline storage {storage_gb:.0f} GB")
:::

## Common mistakes

- Mistake: fan out on write for every account. Fix: fan out on read for accounts with many followers.
- Mistake: store full post bodies in each timeline. Fix: store post ids only, and fetch bodies in one batch.
- Mistake: fan out to inactive users. Fix: skip users not seen in 30 days and rebuild on their return.
- Mistake: rank at write time. Fix: rank at read time, so the model and the user's state are current.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: design a news feed
q: A user with 2,000 followers posts. How many timeline writes does fan-out on write cause?
- 1
- 300
- 500
* 2,000
why: The post id goes into the timeline of every follower.
q: Why does a celebrity post fan out on read?
- Celebrities post more often
* 50 million timeline writes per post would take minutes and block other posts
- Their posts are larger
- Their followers are inactive
why: At 100,000 writes per second, 50 million writes take 500 seconds and fill the fan-out queue.
q: What does a timeline store?
- Full post bodies
* A list of post ids
- The follower list
- The ranked feed
why: Ids are 8 bytes each, and the bodies are fetched in one batch call at read time.
q: 7,000 posts per second with 300 followers each gives how many timeline writes per second?
- 21,000
- 210,000
* 2.1 million
- 7,300
why: 7,000 times 300 is 2,100,000 writes per second.
q: Where does ranking run?
- At write time in the fan-out worker
* At read time on the merged candidates
- In the database
- On the client
why: Ranking at read time uses the current model and the current state of the user for every feed load.
q: What happens to users who have not opened the app in 30 days?
- They get a larger timeline
* The fan-out skips them and rebuilds their timeline on read when they return
- Their posts are deleted
- They fan out on read forever
why: Skipping inactive users cuts fan-out writes by more than half without changing what they see.
:::

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

:::video
id: 7t2alSnE2-I
why: Watch the first 20 minutes. It builds the kind of HTTP server that the gateway in this lesson is, with routes and request handling that the design below adds limits and streaming to.
:::

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

The script below runs the sizing arithmetic from the KV cache to the GPU count. Change the inputs for another model or another traffic level.

:::code
lang: python
file: fleet.py
gpu_gb, gpus_per_replica = 80, 2
weights_gb = 140
kv_kb_per_token = 320
prompt_tokens, answer_tokens = 1000, 300
tokens_per_s_per_request = 40
peak_rps = 1000
headroom = 0.30

kv_gb = gpu_gb * gpus_per_replica - weights_gb
tokens_in_flight = kv_gb * 1e6 / kv_kb_per_token
concurrent = tokens_in_flight / (prompt_tokens + answer_tokens)
seconds_per_request = answer_tokens / tokens_per_s_per_request
rps_per_replica = concurrent / seconds_per_request          # Little's law
replicas = peak_rps / rps_per_replica
with_headroom = replicas * (1 + headroom)

print(f"KV cache {kv_gb} GB holds {tokens_in_flight:,.0f} tokens")
print(f"{concurrent:.0f} concurrent requests of {seconds_per_request} s each")
print(f"{rps_per_replica:.1f} requests per second per replica")
print(f"{replicas:.0f} replicas, {with_headroom:.0f} with headroom, {with_headroom * gpus_per_replica:.0f} GPUs")
:::

:::code
lang: text
KV cache 20 GB holds 62,500 tokens
48 concurrent requests of 7.5 s each
6.4 requests per second per replica
156 replicas, 203 with headroom, 406 GPUs
:::

The gateway settings from this section fit in one configuration file.

:::code
lang: yaml
file: gateway.yaml
routing:
  policy: most_free_kv_cache
  prefix_aware: true
admission:
  max_queue_per_replica: 8
  reject_status: 429
  retry_after_seconds: 2
limits:
  max_prompt_tokens: 8000
  per_client_tokens_per_minute: 200000
timeouts:
  time_to_first_token_seconds: 2
  time_between_tokens_seconds: 5
priority:
  interactive: 1
  batch: 2
:::

## Try it

:::exercise
title: Size a fleet for a smaller model
task: Repeat the sizing for an 8-billion-weight model in 16-bit, which takes 16 GB, on one 80 GB GPU. The KV cache needs 128 KB per token. Each request has a 2,000-token prompt and a 500-token answer at 60 tokens per second. The peak is 500 requests per second. Compute the KV cache size, the tokens in flight, the concurrent requests, the requests per second per replica, and the replicas with 30 percent headroom.
hint: Copy fleet.py and change the inputs. One GPU means gpus_per_replica is 1.
lang: python
solution:
gpu_gb, gpus_per_replica, weights_gb = 80, 1, 16
kv_kb_per_token = 128
prompt_tokens, answer_tokens, tokens_per_s = 2000, 500, 60
peak_rps, headroom = 500, 0.30

kv_gb = gpu_gb * gpus_per_replica - weights_gb               # 64 GB
tokens_in_flight = kv_gb * 1e6 / kv_kb_per_token             # 500,000
concurrent = tokens_in_flight / (prompt_tokens + answer_tokens)   # 200
seconds_per_request = answer_tokens / tokens_per_s           # 8.3 s
rps_per_replica = concurrent / seconds_per_request           # 24
replicas = peak_rps / rps_per_replica * (1 + headroom)       # 27
print(f"KV {kv_gb} GB, {tokens_in_flight:,.0f} tokens, {concurrent:.0f} concurrent")
print(f"{rps_per_replica:.0f} requests per second per replica, {replicas:.0f} replicas with headroom")
:::

## Common mistakes

- Mistake: size the fleet by compute alone. Fix: size by KV cache memory, because that sets concurrency.
- Mistake: set one total request timeout. Fix: set a time to first token and a time between tokens.
- Mistake: retry after tokens have streamed. Fix: retry only before the first token.
- Mistake: let one client fill a replica with long prompts. Fix: cap prompt tokens and apply a per-client rate limit in tokens, not requests.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: design an LLM serving gateway
q: A replica has 30 GB of KV cache and uses 250 KB per token. How many tokens fit?
- 12,000
* 120,000
- 1.2 million
- 7,500
why: 30 GB is 30 million KB, and divided by 250 KB per token that is 120,000 tokens.
q: Why does admission control matter more for a GPU replica than for a web server?
- GPUs are slower
* A replica past its memory limit slows every request, and each request lasts seconds
- Web servers have no queues
- GPUs cannot return errors
why: One oversized batch stalls dozens of multi-second requests at once, so the limit must hold at the door.
q: When is a retry safe on a streaming request?
- At any time
* Only before the first token reaches the client
- Only after the last token
- Never
why: After tokens have streamed, a retry would repeat text to the client.
q: A replica holds 48 concurrent requests that take 7.5 seconds each. How many requests per second does it serve?
- 360
- 0.16
* 6.4
- 48
why: By Little's law the rate is 48 divided by 7.5 seconds.
q: Why set two timeouts instead of one total timeout?
- One timeout is harder to configure
* A long answer takes a minute by design, so one timeout catches a stuck prefill and the other a stalled decode
- Two timeouts halve the latency
- The client needs two headers
why: A time to first token and a time between tokens each catch a real failure without cutting off a healthy long answer.
q: A client sends a 100,000-token prompt at 320 KB per token. How much KV cache does it take?
- 320 MB
- 3.2 GB
* 32 GB
- 320 GB
why: 100,000 times 320 KB is 32 million KB, which is 32 GB, more than the whole cache of one replica.
:::

## Go further

The vLLM documentation explains continuous batching, paged attention, and prefix caching in a real server. The PagedAttention paper shows why KV cache memory limits concurrency. The DistServe paper separates prefill and decode. SGLang shows prefix-aware routing. The Google SRE book chapter on overload covers the admission control rules. The /labs/kv-cache lab computes KV cache size for any model, and the /labs/pareto-router lab routes requests between models by cost and quality.
`,
        },
      ],
    },
  ],
}
