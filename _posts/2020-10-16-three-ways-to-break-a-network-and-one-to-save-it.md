---
title: "Three ways to break a network (and one to save it)"
date: "2020-10-16"
author: Dan Halperin
---

When people mention network configuration bugs, the first thing that comes to your mind is likely typos–or if you prefer technical terms, “fat fingers".  Of course, if you are an experienced network engineer, you know there is more to config bugs than keyboard gremlins.

At Intentionet, we work on a network validation engine called [Batfish](https://www.batfish.org/) which has helped engineers find and squash countless configuration bugs. I thought it’d be fun to share some examples we've seen over the years. While bugs are unique like snowflakes, I think of them as falling into three broad categories.

### Fat Fingers (when there is a gap between the brain and hands)

This category of bugs is as old as typewriters. Some entertaining examples off the top of my head:

- Incorrectly assigned address (a public IP!) to a router interface: _100.x.y.z_ instead of _10.x.y.z_
- Mistyped prefix list name: **prefix-list PFX-LIST 10.1O0.10.128/25** (the letter ‘O’ instead of the number ‘0’ in the prefix)
- Mistyped access-list for a SNMP community: _SNMP-ACCESS-LIST_ instead of _SNMP\_ACCESS\_LIST_ (‘-’ vs ‘\_’)
- Mistyped route-map name: _BLEAD-TRAFFIC_ instead of _BLEED-TRAFFIC_
- Mistyped keyword: **no bgp defaults ipv4-unicast** instead of **no bgp default ipv4-unicast**
- Wrong BGP neighbor IP: **neighbor 169.254.127.3 activate** instead of **neighbor 169.54.127.1 activate**
- Duplicate BGP local AS number on leaf routers in a data center (which effectively disconnected their racks)

These mistakes all come from real production configurations, which device operating systems of course accepted happily.

### Misunderstanding configuration semantics (when you forget what you learned in school)

In this category of bugs, engineers typed exactly what they intended. However, what they wanted was incorrect because they misunderstood configuration semantics.  As an example, check out the address group definition below on a Cisco IOS device.

```
ipv4 address object-group MY-SOURCES
 10 10.17.0.0 255.255.0.0
 20 10.30.137.190 255.255.255.255
```

This group was being used in an ACL guarding which sources could access a sensitive resource. So, which sources can access the resource?

- 10.17.1.1? The right answer is yes.
- 10.30.137.190? Yes
- 10.30.137.191? Still yes
- 10.10.10.10? Still yes!
- 8.8.8.8? Still yes!!

If you are confused, you are not the only one. In fact, we’ve seen multiple engineers getting tripped up by such a bug. In Cisco IOS, the part after the IP address is expected to be a wildcard (reverse netmask), not netmask. So the engineer should have used 0.0.255.255 on Line 10 and 0.0.0.0 on Line 20.

The use of 255.255.255.255 on Line 20 was essentially allowing all source IPs! Maybe the engineers in question had been spending their time with Cisco ASA – which is, of course, a different Cisco operating system with the exact opposite behavior!

As another example, check out the snippet below.

```
ip prefix-list MY-LIST
 seq 10 permit 192.0.1.0/24 !
route-map MY-RT-MAP permit 10
 match ip address MY-LIST
```

Will the route map permit routes for 192.0.1.0/24? Well, you cannot tell from the information I provided. The gotcha is that the syntax in the snippet refers to an ACL, not a prefix list.  For matching on the prefix-list, the command should be **match ip address prefix-list MY-LIST**.

This category of bugs is particularly nefarious. You might stare long and hard at your configs after seeing unexpected network behavior and not spot the bug even when it’s right under your nose. In your mind, the config is correct. Batfish users found such bugs when Batfish-predicted behavior differed from their expectation (e.g., arbitrary source IPs being allowed in the first case). Some users initially chalked it up to a Batfish bug—and sometimes, so did I—until they discovered the bug was in human interpretation of the config at hand.

### Missed interactions (when the enemy is someplace else)

Network configuration is complex because portions of the configuration within a device and even across devices interact with each other. To ensure intended network-wide behavior, engineers need to reason about many configuration lines collectively, sometimes on the same device and sometimes across multiple devices.  This often exceeds the limit of human abilities.

A common case of such interactions, on a single device, relates to ACLs and firewall rules. We have seen numerous bugs where traffic was not being permitted/denied as intended even though the line meant to do that task was correct. The problem was that the line was shadowed by earlier lines. Some interesting examples:

- 32 different /28s early in the ACL collectively shadowing a /23 prefix
- a **permit any any** inserted at the first line in the ACL for debugging, rendered the remainder useless
- **permit 10.23.34.16/30 any** shadowed **deny 10.23.34.19 any** which appeared 10 lines later

It is easy to miss these types of errors when the ACL or firewall policy has 100s or 1000s of lines.

Here is an example of interactions across devices.  This network had two border routers and preferred to use one of them for some external services. The design intent was for traffic to fail over to the second one when the first router or its uplink failed. Simulating this failure in Batfish revealed that routing was indeed correctly configured to move the traffic to the second router, but there was an ACL entry on it that denied access to some of the services. Thus, the network was not redundant as intended.

I have seen many other examples of network redundancy not working as intended because of a configuration bug on a different device. The root causes vary from not advertising a necessary next-hop into IGP, to not putting a BGP neighbor in the right peer group, to missing network statements, to misconfigured iBGP session, and so on. Redundancy problems are notoriously hard to find because the bug could lie dormant on a device that has not been changed in a while and the network functions normally until something fails (or is taken down for maintenance). Batfish helps find such bugs by simulating the impact of failures.

### Squashing configuration bugs

Rooting out configuration bugs is key to network security and reliability because they account for 50-80% of network outages and breaches. More automation certainly helps, but it is not the complete answer. Some of the bugs above happened in automated environments because the input to automation was wrong or incorrect semantics were encoded in the automation pipeline.

Testing network changes before deployment is thus critical. Batfish enables you to do that at production-scale. Its testing is based on how the network will behave, as opposed to what the configuration text looks like, allowing you to catch all types of bugs. This of course assumes that you have the right tests in place. We will cover that in a future post. Stay tuned!
