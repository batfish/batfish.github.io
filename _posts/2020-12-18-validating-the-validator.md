---
title: "Validating the validator"
date: "2020-12-18"
author: Victor Heohiardi
tags:
  - "batfish"
  - "intent"
  - "networkautomation"
  - "networkvalidation"
  - "validation"
---

Batfish provides a unique power to its users: validate network configurations before pushing them to the network. Its analysis is production-scale—unlike with emulation, you don’t need to build a trimmed version of your network. It is also comprehensive—considers all traffic, not just a few flows. These abilities help network engineers proactively fix errors that are responsible for 50-80% of the outages.

Batfish finds these errors by modeling and predicting network behavior given its configuration. The higher the fidelity of Batfish models the better it will be at flagging errors.

So, the question is: _How do we build and validate Batfish models?_

As any network engineer will testify, accurately predicting network behavior based on configuration is super challenging. Device behaviors differ substantially across vendors (Cisco vs. Juniper), across platforms of the same vendor (IOS vs. IOS-XR), and sometimes even versions of the same platform. Further, it is impossible to build high-fidelity models based solely on reading RFCs or vendor docs. RFCs are silent about vendor config syntax, and vendor docs are often incomplete, ambiguous and sometimes even misleading. And don’t even get me started on how wrong the Internet is— to see what I mean, try using it to figure EIGRP metric computation.

To appreciate the need to go beyond RFCs and docs, consider the following FRR configuration.

```
1 !
2 ip community-list 14 permit 65001:4
3 ip community-list 24 permit 65002:4
4 !
5 route-map com_update permit 10
6   match community 14
7   on-match goto 20
8   set community 65002:4 additive
9 !
10 route-map com_update permit 20
11   match community 65002:4
12   set community 65002:5 additive
13 !
14 route-map com_update permit 30
15   match community 24
16   set community 65002:6 additive
17 !
```

If a route with community 65001:4 is processed by this route map, which communities will be attached in the end?

- Will 65002:5 be attached? If you answered ‘yes’, you’d be wrong. The community list referenced on line 11 (65002:4) is not defined and hence the match will not occur.
- Will 65002:6 be attached? If you answered ‘no’, you’d be wrong. Line 15 will match because the community 65002:4, which was attached earlier in Line 8, matches list ‘24’.

Correctly predicting the behavior of this route map requires that you know 1) that FRR expects defined community lists in ‘match community’ statements, 2) what happens when an undefined list is mentioned, and 3) if ‘match community’ statements can match on communities attached by earlier statements in the route map or only on the original set of communities. It is not easy to glean all this information from the docs.

That is why Batfish models are guided by actual device behaviors. Benchmarking these behaviors in our labs and observing them in many real networks helps us build the models and continuously improve their fidelity.

To build models for a feature on a particular platform and version, we use three types of benchmarks to capture the device behavior in detail.

- **Feature-level benchmarking**. We start by lighting up the device of interest in our lab. Commonly, we use virtual /assets/images but need physical devices when that is not an option. We then configure the feature of interest in various ways and observe its behavior for different inputs. For FRR route maps, for instance, we would configure the route map with defined/undefined community lists and inject routes with different communities.
- **Device-level benchmarking.** Network configuration would be a lot simpler if features didn’t interact with each other but the reality is different. For instance, a firewall that supports both network address translation (NAT) and zone filters, one needs to fully understand if filters are applied post-NAT operations and if they operate on pre- or post-NAT headers. To account for feature interactions, we create more complex scenarios where the features are jointly configured in different ways and benchmark the device behavior in each of those scenarios.
- **Network-level benchmarking.** We also construct larger network topologies with multiple devices (possibly of different vendors) configured in common patterns, to help validate end-to-end behaviors.

Batfish models faithfully mimic all the behaviors in our benchmarks. Model building and the benchmarking steps are not executed as a strict waterfall. Rather, we follow an iterative process, where we refine the models in successive iterations. For example, network-level benchmarking may uncover a modeling gap, for which we’d go back to Step 1 to fully understand the gap.

The most challenging part of this process is devising interesting test cases. We can do it mainly because of the experience of our engineers and help from the Batfish community members who contribute test cases and report issues.

Ensuring model fidelity is not a one-time process. It is possible that we missed a feature interaction or that the model fidelity is compromised when we extend Batfish to more platforms and features. Two activities help us guard against these risks. First, when on-boarding a new network and then periodically after that, we compare the show data (interfaces, RIBs, FIBs, etc.) from the network to what is predicted by Batish. This helps flag any feature interactions that are not modeled. This way, as Batfish encounters more networks, its fidelity keeps improving.

Second, as part of our nightly CI (continuous integration) runs, we check that the network state computed by the latest Batfish code base continues to match the show data from real networks and our benchmarking labs. This helps quickly catch unintended regressions in model fidelity.

All said and done, are Batfish models guaranteed to be perfect? No, but neither are humans tasked with checking configuration correctness today. Think of Batfish as a lethal config-error-killing force that combines the knowledge of the most knowledgeable network engineer you have met for each platform that you analyze. Even those engineers might miss an error. But unlike them, Batfish will never forget the platform idiosyncrasies it has learned over time, and it will always catch situations where your Seattle change interacts poorly with your Chicago configuration. However, Batfish will not go with you to grab a drink to celebrate the complex change you executed without a hitch.
