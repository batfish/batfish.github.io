---
title: "Don't accidentally break the Internet like Level 3 (or Google, Telia, Telekom Malaysia, ...)"
author: Samir Parikh
date: "2017-11-27"
tags:
  - "batfish"
  - "bgp"
  - "networkautomation"
  - "networkoutage"
  - "networkvalidation"
  - "predeployment"
  - "route-leak"
  - "validation"
---

On Monday, Nov 6th, 2017, Level 3 Communications (now part of CenturyLink) made national headlines when a configuration error resulted in a massive outage for many users in the USA. The impacted users were customers of several large ISPs, including Comcast. It took 90 minutes for Level 3 to diagnose and remediate the error, and it took even longer for impacted users to regain Internet access.

> **Given how critical Internet connectivity has become to our lives, outages are highly disruptive for users and damage the reputation of the organizations involved.**

Posts that provide insight into the root cause (e.g., [Wired](https://www.wired.com/story/how-a-tiny-error-shut-off-the-internet-for-parts-of-the-us/), [Outages list](https://puck.nether.net/pipermail/outages/2017-November/010947.html), [Thousand Eyes](https://blog.thousandeyes.com/comcast-outage-level-3-route-leak/)) indicate that the error was related to the configuration of BGP (Border Gateway Protocol), the routing protocol underlying the Internet. In particular, Level 3 appears to have “leaked” more specific BGP routes that it obtained from some of its neighbors. This leak led to traffic traversing paths without ample capacity creating heavy congestion and packet drops.

The error is eerily similar to [Google’s error](http://www.popularmechanics.com/technology/news/a27971/google-accidentally-broke-japans-internet/), which took down Internet access for most of Japan a few months ago, and to many, many prior incidents. To list just a few: [Telia leak](https://www.theregister.co.uk/2016/06/20/telia_engineer_blamed_massive_net_outage/), which impacted part large parts of Europe;  [iTel leak](https://dyn.com/blog/global-impacts-of-recent-leaks/), which impacted Microsoft and Netflix; [Axcelex leak](https://blog.thousandeyes.com/route-leak-causes-amazon-and-aws-outage/), which impacted Amazon and AWS; and [Telekom Malaysia](https://bgpmon.net/massive-route-leak-cause-internet-slowdown/), which, as it happens, impacted Level 3.

> **The fundamental reason behind configuration errors is not the incompetence of the network engineers, but the inherent complexity in today’s network configuration. Humans are simply incapable of reasoning about its correctness.**

To combat this, most network operators rely on small scale test-labs to create a mock of the production network on which they can test and validate changes. This process is time-consuming, expensive and incomplete. Most of these headline-grabbing network outages are a result of specific conditions in the production network coupled with the configuration change. Ensuring the test environment emulates the exact conditions of the production environment in order to catch these errors is simply not possible.

> **Fortunately, recent advances in network validation can provide strong guarantees on the correctness of network configuration and completely prevent such errors. One such technology is [Batfish](http://github.com/batfish/batfish).**

Batfish is a free, open-source tool to validate network configuration. Given a network’s configuration, it models how the network will process routing information and forward traffic. With this capability, before a configuration change is pushed to the network engineers can validate that it does what it is intended to do. They can also analyze, compared to the current configuration, how the network will behave differently after the change.

Using Batfish to prevent accidental route leaks is easy. We illustrate that using the following example network.

![Network Diagram](/assets/images/Net_Diagram.jpg)

AS65000 is mimicking Level 3 in this week’s incident and AS65001 is mimicking Comcast. AS65001 announces a less specific route (10.1.0.0/16) and two more specific routes (10.1.\*.0/24) for the purpose of traffic engineering. AS65000’s policy is to block the more specifics from leaking to AS65002 using route filters.

We created two sets of configurations ([route-leak-1](https://github.com/batfish/batfish/tree/67034746f4d6e52c34bff7bfaa7a4e75b51477da/test_rigs/route-leak-1), [route-leak-2](https://github.com/batfish/batfish/tree/67034746f4d6e52c34bff7bfaa7a4e75b51477da/test_rigs/route-leak-2)) for all the routers of AS65000. The second set represents the new configuration, with an error that allows more specifics routes from AS65001 to leak due to inconsistent BGP communities in route filters on AS65000’s peering routers, R2 and R3. We do not know the exact error that caused route leaks in the Level 3 incident, but that is not important for our purposes;  Batfish can detect leaking irrespective of the underlying error.

To detect the error before deploying the buggy configuration to the network, the operator can do the following (after installing and running Batfish per instructions [here](https://github.com/batfish/batfish/wiki)).

- Initialize the first snapshot representing the reference (current) configuration, and the second snapshot that represents to new (planned) configuration.

```
  batfish> init-testrig route-leak-1
  batfish> init-delta-testrig route-leak-2
```

- Compute which routes will be announced in the second snapshot but not the first

```
    batfish> get bgpAdvertisements differential=true

    + EBGP_SENT dstIp:192.168.51.2 **srcNode:as65000_R1** srcIp:192.168.51.1 **net:10.1.1.0/24** nhip:192.168.51.1 origin:INCOMPLETE asPath:[65000, 65001] communities:[4259840002, 4259840010] orIp:192.168.51.1

    + EBGP_SENT dstIp:192.168.51.2 **srcNode:as65000_R1** srcIp:192.168.51.1 **net:10.1.2.0/24** nhip:192.168.51.1 origin:INCOMPLETE asPath:[65000, 65001] communities:[4259840002, 4259840010] orIp:192.168.51.1
```

The output shows that **R1** announces two /24 routes only in the second configuration (indicated by ‘+’), a red flag if the change was never intended to leak such routes. Had it shown no routes, or only routes expected due to the change, the configuration can be deemed safe to deploy (assuming other correctness checks pass too).

- To confirm if these additional prefixes are part of a less specific route that is already being advertised, one can run the following command

```
    batfish> get bgpAdvertisements prefixSpace=["10.1.1.0/24:0-23"]

      EBGP_SENT dstIp:192.168.51.2 **srcNode:as65000_R1** srcIp:192.168.51.1 **net:10.1.0.0/16** nhip:192.168.51.1 origin:INCOMPLETE asPath:[65000, 65001] communities:[4259840002] orIp:192.168.51.1
```

The output shows that there is indeed a less specific route (10.1.0.0/16) covering the more specifics.

That is it! While we demonstrate Batfish’s interactive usage here, similar checks (and many more) can be embedded in the network’s CI/CD pipeline, such that configuration errors are caught before they impact connectivity. The ability to catch errors proactively is a key advantage of control plane validation. Read more about [control versus data validation here](/2017/09/12/new-network-engineering-workflow-formal-validation.html).

Using control plane validation, network engineers can make configuration changes without taking down the Internet, making headlines like **_“How a tiny error shut off the internet for parts of the US”_** a thing of the past.

